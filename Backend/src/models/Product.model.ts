import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  image: string;
  price: number;
  description: string;
  rating: number;
  reviews: number;
  stock: number;
  ownerId?: mongoose.Types.ObjectId; // Optional (?) so older seeded items don't throw validation errors
  isApproved: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["fitness", "fashion", "electronics", "home"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },
    // ── NEW TENANCY FIELD ─────────────────────────────
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Links directly to your user model collection
      required: false, // Set to false so old hardcoded items/seeds stay valid
    },
    // ── NEW APPROVAL FLAG ─────────────────────────────
    isApproved: {
      type: Boolean,
      default: true, // 👈 Setting this to TRUE by default ensures your current 8 hardcoded catalog items stay visible immediately!
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);