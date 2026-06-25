import { Request, Response } from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Cart from "../models/Cart.model";
import Transaction from "../models/Transaction.model";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  generateEsewaSignature,
  decodeEsewaResponse,
  verifyEsewaSignature,
} from "../utils/esewaSignature";

// ── POST /api/payment/initiate ───────────────────────────
export async function initiatePayment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart is empty, nothing to checkout",
      });
      return;
    }

    const transactionUuid = uuidv4();
    const productCode = process.env.ESEWA_MERCHANT_CODE as string;
    const totalAmount = cart.totalAmount;

    await Transaction.create({
      userId: req.userId,
      transactionUuid,
      productCode,
      items: cart.items,
      totalAmount,
      status: "PENDING",
    });

    const signature = generateEsewaSignature(totalAmount, transactionUuid, productCode);

    const publicBackendUrl = process.env.PUBLIC_BACKEND_URL as string;

    const paymentData = {
      amount: totalAmount,
      tax_amount: 0,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${publicBackendUrl}/api/payment/verify`,
      failure_url: `${process.env.FRONTEND_URL}/payment-failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    };

    res.status(200).json({
      success: true,
      paymentUrl: process.env.ESEWA_PAYMENT_URL,
      paymentData,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}

// ── GET /api/payment/verify ──────────────────────────────
export async function verifyPayment(req: Request, res: Response): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL as string;

  try {
    const encodedData = req.query.data as string;

    if (!encodedData) {
      res.redirect(`${frontendUrl}/payment-failure?reason=missing_data`);
      return;
    }

    const payload = decodeEsewaResponse(encodedData);

    const signatureValid = verifyEsewaSignature(payload);

    if (!signatureValid) {
      res.redirect(`${frontendUrl}/payment-failure?reason=invalid_signature`);
      return;
    }

    const transaction = await Transaction.findOne({
      transactionUuid: payload.transaction_uuid,
    });

    if (!transaction) {
      res.redirect(`${frontendUrl}/payment-failure?reason=transaction_not_found`);
      return;
    }

    const statusCheckUrl = process.env.ESEWA_STATUS_CHECK_URL as string;
    const merchantCode = process.env.ESEWA_MERCHANT_CODE as string;

    const statusResponse = await axios.get(statusCheckUrl, {
      params: {
        product_code: merchantCode,
        total_amount: transaction.totalAmount,
        transaction_uuid: transaction.transactionUuid,
      },
    });

    const esewaStatus = statusResponse.data.status;
    console.log()



    if (esewaStatus !== "COMPLETE") {
      transaction.status = "FAILED";
      await transaction.save();
      res.redirect(`${frontendUrl}/payment-failure?reason=not_completed`);
      return;
    }

    // const esewaStatus = payload.status;  //payment-test



    transaction.status = "COMPLETE";
    transaction.esewaTransactionCode = payload.transaction_code;
    await transaction.save();

    const cart = await Cart.findOne({ userId: transaction.userId });
    if (cart) {
      cart.items = [];
      cart.calculateTotals();
      await cart.save();
    }

    res.redirect(`${frontendUrl}/payment-success?orderId=${transaction.transactionUuid}`);
  } catch (err) {
    console.error("Payment verification error:", err);
    res.redirect(`${frontendUrl}/payment-failure?reason=server_error`);
  }
}