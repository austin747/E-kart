import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All cart routes are protected — must be logged in
router.get("/",                    protect, getCart);         // GET    /api/cart
router.post("/add",                protect, addToCart);       // POST   /api/cart/add
router.put("/update",              protect, updateCartItem);  // PUT    /api/cart/update
router.delete("/remove/:productId",protect, removeFromCart);  // DELETE /api/cart/remove/:id
router.delete("/clear",            protect, clearCart);       // DELETE /api/cart/clear

export default router;