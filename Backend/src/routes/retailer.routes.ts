import { Router, Request, Response } from "express";
import { upload } from "../middleware/Upload.middleware"; 
import Product from "../models/Product.model";

const router = Router();

// ── 1. GET RETAILER SPECIFIC INVENTORY ────────────────
// ✅ ADDED: This satisfies the apiGetRetailerProducts call from your frontend!
router.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetches all products across the collection sorted by newest
    // Note: If you implement vendor separation later, you can filter by ownerId here.
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to load retailer product listings",
      error: err.message,
    });
  }
});

// ── 2. CREATE AND UPLOAD RETAILER PRODUCT ──────────────
router.post("/add", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, price, description } = req.body;

    let imagePath = ""; 
    
    if (req.file) {
      imagePath = `uploads/${req.file.filename}`;
    }

    const newProduct = await Product.create({
      name,
      category,
      price: Number(price),
      description,
      image: imagePath, 
      isApproved: false, 
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully! Awaiting review.",
      product: newProduct
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to upload and store item properties",
      error: err.message
    });
  }
});

export default router;