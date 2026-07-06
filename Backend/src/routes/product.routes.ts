import { Router, Request, Response } from "express";
import Product from "../models/Product.model";

const router = Router();

// ──────────────────────────────────────────────────────────────────
// GET ALL PUBLIC APPROVED PRODUCTS
// GET /api/products
// ──────────────────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    // Only fetch items where isApproved is true, sorting by newest first
    const products = await Product.find({ isApproved: true }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error retrieving items for marketplace directory",
      error: err,
    });
  }
});

export default router;