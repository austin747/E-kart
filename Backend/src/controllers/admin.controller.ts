import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User.model";
import Transaction from "../models/Transaction.model";
import Product from "../models/Product.model";
import Order from "../models/Order.model"; // ✅ Added Order Import

// ─────────────────────────────────────────────
// GET ALL USERS
// GET /api/admin/users
// ─────────────────────────────────────────────
export async function getAllUsers(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}

// ─────────────────────────────────────────────
// GET ALL ORDERS
// GET /api/admin/orders
// ─────────────────────────────────────────────
export async function getAllOrders(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const orders = await Transaction.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}

// ─────────────────────────────────────────────
// GET ALL PRODUCTS
// GET /api/admin/products
// ─────────────────────────────────────────────
export async function getAllProducts(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error fetching products", error: err });
  }
}

// ─────────────────────────────────────────────
// UPDATE USER ROLE
// PUT /api/admin/users/:id/role
// ─────────────────────────────────────────────
export async function updateUserRole(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!["customer", "retailer", "admin"].includes(role)) {
      res.status(400).json({ success: false, message: "Invalid role" });
      return;
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}

// ─────────────────────────────────────────────
// APPROVE ORDER (WITH DUAL-COLLECTION SYNC)
// PUT /api/admin/orders/:id/approve
// ─────────────────────────────────────────────
export async function approveOrder(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    
    // 1. Find and update the Transaction document
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      res.status(404).json({ success: false, message: "Transaction record not found" });
      return;
    }

    if (transaction.status !== "COMPLETE") {
      res.status(400).json({
        success: false,
        message: `Only COMPLETE (paid) transactions can be approved. Current status: ${transaction.status}`,
      });
      return;
    }

    transaction.status = "APPROVED";
    await transaction.save();

    // 2. ✅ Synchronously find and approve the main customer Order document
    if (transaction.orderId) {
      await Order.findByIdAndUpdate(transaction.orderId, {
        status: "APPROVED"
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Order approved successfully across the entire platform ✅", 
      order: transaction 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error during cross-model status update", error: err });
  }
}

// ─────────────────────────────────────────────
// APPROVE PRODUCT
// PUT /api/admin/products/:id/approve
// ─────────────────────────────────────────────
export async function approveProduct(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product approved and live on the public catalog ✅",
      product,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error during product approval", error: err });
  }
}