import { Router, Request, Response, NextFunction } from "express";
import { upload } from "../middleware/Upload.middleware";
import Product from "../models/Product.model";

const router = Router();

// ── 1. GET RETAILER SPECIFIC INVENTORY ────────────────
router.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to load retailer product listings",
      error: err.message,
    });
  }
});

// ── 2. CREATE AND UPLOAD RETAILER PRODUCT ──────────────
router.post(
  "/add",
  // Wrap multer so any error INSIDE the upload/Cloudinary step is caught
  // and logged properly, instead of crashing past our try/catch below.
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("image")(req, res, (err: any) => {
      if (err) {
        console.error("Multer/Cloudinary upload error message:", err?.message);
        console.error(
          "Multer/Cloudinary upload error full:",
          JSON.stringify(err, Object.getOwnPropertyNames(err))
        );
        res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: err?.message || String(err),
        });
        return;
      }
      next();
    });
  },
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("req.file:", req.file); // temporary debug — remove once confirmed working

      const { name, category, price, description } = req.body;

      // FIXED: no more shadowed variable — this now actually updates imagePath
      const imagePath = req.file ? (req.file as any).path : "";

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
        product: newProduct,
      });
    } catch (err: any) {
      console.error("Product creation error message:", err?.message);
      console.error(
        "Product creation error full:",
        JSON.stringify(err, Object.getOwnPropertyNames(err))
      );
      res.status(500).json({
        success: false,
        message: "Failed to upload and store item properties",
        error: err?.message || String(err),
      });
    }
  }
);

router.delete("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: err.message,
    });
  }
});

export default router;