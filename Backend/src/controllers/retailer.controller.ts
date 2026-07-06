import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Product from "../models/Product.model";

// ──────────────────────────────────────────────────────────────────
// GET RETAILER OWNED PRODUCTS
// GET /api/retailer/products
// ──────────────────────────────────────────────────────────────────
export async function getRetailerProducts(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const products = await Product.find({ ownerId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error fetching vendor catalog", error: err });
  }
}

// ──────────────────────────────────────────────────────────────────
// ADD PRODUCT (WITH RELATIVE PATH IMAGE CAPTURE)
// POST /api/retailer/products
// ──────────────────────────────────────────────────────────────────
export async function addProduct(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { name, category, price, description } = req.body;

    if (!name || !category || !price) {
      res.status(400).json({ success: false, message: "Missing required catalog fields" });
      return;
    }

    // ✅ Match network static paths instead of saving absolute file directories
    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; 
    }

    const newProduct = new Product({
      name,
      category,
      price: Number(price),
      description,
      image: imageUrl, // Saved uniformly as: "/uploads/1712345678-123456.png"
      ownerId: req.userId,
      isApproved: false, // Default flags hold items back for administrative review
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product submitted successfully! Pending admin verification review ✅",
      product: newProduct,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error creating item layout", error: err });
  }
}

// ──────────────────────────────────────────────────────────────────
// DELETE PRODUCT
// DELETE /api/retailer/products/:id
// ──────────────────────────────────────────────────────────────────
export async function deleteProduct(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    
    const product = await Product.findOneAndDelete({ _id: id, ownerId: req.userId });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found or unauthorized control context" });
      return;
    }

    res.status(200).json({ success: true, message: "Product cleared out from store collection successfully 🗑️" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error during product deletion execution", error: err });
  }
}