import { Request, Response } from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import Cart from "../models/Cart.model";
import Order from "../models/Order.model";
import Transaction from "../models/Transaction.model";

import { AuthRequest } from "../middleware/auth.middleware";
import {
  generateEsewaSignature,
  decodeEsewaResponse,
  verifyEsewaSignature,
} from "../utils/esewaSignature";

// ─────────────────────────────────────────────
// INITIATE PAYMENT
// POST /api/payment/initiate
// ─────────────────────────────────────────────
export async function initiatePayment(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    // 1. Grab the latest pending order matching uppercase checkout states safely
    const order = await Order.findOne({
      userId: req.userId,
      $or: [
        { paymentStatus: "UNPAID" },
        { status: "PENDING" }
      ]
    }).sort({ createdAt: -1 });

    if (!order) {
      res.status(400).json({
        success: false,
        message: "No pending or unpaid orders found for this session profile",
      });
      return;
    }

    const transactionUuid = uuidv4();
    const productCode = process.env.ESEWA_MERCHANT_CODE as string;

    // 2. Create transaction tracker document linked directly to our main Order Id
    await Transaction.create({
      userId: req.userId,
      orderId: order._id,
      transactionUuid,
      productCode,
      items: order.items,
      totalAmount: order.totalAmount,
      status: "PENDING",
    });

    // 3. Generate cryptographic signature for eSewa authorization gateways
    const signature = generateEsewaSignature(
      order.totalAmount,
      transactionUuid,
      productCode
    );

    const publicBackendUrl = process.env.PUBLIC_BACKEND_URL as string;

    const paymentData = {
      amount: order.totalAmount,
      tax_amount: 0,
      total_amount: order.totalAmount,
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
    res.status(500).json({
      success: false,
      message: "Server error configuring payment initialization context",
      error: err,
    });
  }
}

// ─────────────────────────────────────────────
// VERIFY PAYMENT (eSewa callback handler)
// GET /api/payment/verify
// ─────────────────────────────────────────────
export async function verifyPayment(
  req: Request,
  res: Response
): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL as string;

  try {
    const encodedData = req.query.data as string;

    if (!encodedData) {
      res.redirect(`${frontendUrl}/payment-failure?reason=missing_data`);
      return;
    }

    // 1. Decode callback values
    const payload = decodeEsewaResponse(encodedData);

    // 2. Verify integrity signature validations
    const signatureValid = verifyEsewaSignature(payload);

    if (!signatureValid) {
      res.redirect(`${frontendUrl}/payment-failure?reason=invalid_signature`);
      return;
    }

    // 3. Locate target transaction document
    const transaction = await Transaction.findOne({
      transactionUuid: payload.transaction_uuid,
    });

    if (!transaction) {
      res.redirect(`${frontendUrl}/payment-failure?reason=transaction_not_found`);
      return;
    }

    // 4. Run secure status confirmation lookup request directly to eSewa servers
    const statusResponse = await axios.get(
      process.env.ESEWA_STATUS_CHECK_URL as string,
      {
        params: {
          product_code: process.env.ESEWA_MERCHANT_CODE,
          total_amount: transaction.totalAmount,
          transaction_uuid: transaction.transactionUuid,
        },
      }
    );

    const esewaStatus = statusResponse.data.status;

    if (esewaStatus !== "COMPLETE") {
      transaction.status = "FAILED";
      await transaction.save();

      await Order.findByIdAndUpdate(transaction.orderId, {
        status: "FAILED",
        paymentStatus: "UNPAID",
      });

      res.redirect(`${frontendUrl}/payment-failure?reason=not_completed`);
      return;
    }

    // 5. SUCCESS → Commit states across collections synchronously
    transaction.status = "COMPLETE";
    transaction.esewaTransactionCode = payload.transaction_code;
    await transaction.save();

    // 6. Finalize master order status
    const order = await Order.findById(transaction.orderId);

    if (order) {
      order.status = "PAID";
      order.paymentStatus = "PAID";
      order.transactionUuid = transaction.transactionUuid;
      await order.save();
    }

    // 7. Reset shopper's cart profile data safely
    const cart = await Cart.findOne({ userId: transaction.userId });

    if (cart) {
      cart.items = [];
      
      if (typeof cart.calculateTotals === "function") {
        cart.calculateTotals();
      } else {
        (cart as any).totalAmount = 0;
        (cart as any).totalItems = 0;
      }
      
      await cart.save();
    }

    // 8. Redirect directly to frontend success template viewport 
    res.redirect(
      `${frontendUrl}/payment-success?orderId=${transaction.transactionUuid}`
    );
  } catch (err) {
    console.error("Payment verification failure exception:", err);
    
    if (!res.headersSent) {
      res.redirect(`${frontendUrl}/payment-failure?reason=server_error`);
    }
  }
}