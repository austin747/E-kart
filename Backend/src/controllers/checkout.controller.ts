import { Response } from "express";
import Cart from "../models/Cart.model";
import Order from "../models/Order.model";
import { AuthRequest } from "../middleware/auth.middleware";

// ─────────────────────────────────────────────
// CREATE ORDER FROM CART
// POST /api/checkout
// ─────────────────────────────────────────────
export async function checkout(req: AuthRequest, res: Response): Promise<void> {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart is empty, cannot proceed to checkout",
      });
      return;
    }

    // Creates the order record with matching uppercase enum fields
    const order = await Order.create({
      userId: req.userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      status: "PENDING",
      paymentStatus: "UNPAID",
    });

    res.status(200).json({
      success: true,
      message: "Order created successfully. Proceed to payment details. ✅",
      order,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Server error creating checkout sequence", 
      error: err 
    });
  }
}