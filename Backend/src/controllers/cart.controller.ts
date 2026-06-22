import { Response } from "express";
import Cart from "../models/Cart.model";
import { AuthRequest } from "../middleware/auth.middleware";

// ── GET /api/cart ─────────────────────────────────────────
export async function getCart(req: AuthRequest, res: Response): Promise<void> {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      res.status(200).json({
        success: true,
        cart: { items: [], totalAmount: 0, totalItems: 0 },
      });
      return;
    }

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}

// ── POST /api/cart/add ────────────────────────────────────
export async function addToCart(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { productId, name, image, price, quantity = 1 } = req.body;

    if (!productId || !name || !image || !price) {
      res.status(400).json({
        success: false,
        message: "productId, name, image and price are required",
      });
      return;
    }

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: req.userId,
        items: [{ productId, name, image, price, quantity }],
      });
      cart.calculateTotals();
      await cart.save();
    } else {
      // Check if item already exists
      const existingIndex = cart.items.findIndex(
        (item) => String(item.productId) === String(productId)
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, name, image, price, quantity });
      }

      cart.calculateTotals();
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}

// ── PUT /api/cart/update ──────────────────────────────────
export async function updateCartItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      res.status(400).json({
        success: false,
        message: "productId and quantity are required",
      });
      return;
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    const itemIndex = cart.items.findIndex(
      (item) => String(item.productId) === String(productId)
    );

    if (itemIndex === -1) {
      res.status(404).json({ success: false, message: "Item not in cart" });
      return;
    }

    if (quantity < 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}

// ── DELETE /api/cart/remove/:productId ───────────────────
export async function removeFromCart(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter(
      (item) => String(item.productId) !== String(productId)
    );

    cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}

// ── DELETE /api/cart/clear ────────────────────────────────
export async function clearCart(req: AuthRequest, res: Response): Promise<void> {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    cart.items = [];
    cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}