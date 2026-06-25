import { Response } from "express";
import Cart from "../models/Cart.model";
import { AuthRequest } from "../middleware/auth.middleware";

// ── POST /api/checkout ───────────────────────────────────
export async function checkout(req: AuthRequest, res: Response): Promise<void> {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart is empty, nothing to checkout",
      });
      return;
    }

    // Simulate payment gateway delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Mock payment — 90% success rate to simulate real-world testing
    const paymentSuccess = Math.random() > 0.1;

    if (!paymentSuccess) {
      res.status(402).json({
        success: false,
        message: "Payment failed. Please try again.",
      });
      return;
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orderSummary = {
      orderId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      totalItems: cart.totalItems,
      placedAt: new Date(),
    };

    // Clear cart after successful "payment"
    cart.items = [];
    cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: orderSummary,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}