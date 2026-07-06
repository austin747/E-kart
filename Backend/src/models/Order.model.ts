import mongoose, { Schema, Document, Types } from "mongoose";

// ─────────────────────────────
// Order Item Type
// ─────────────────────────────
export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// ─────────────────────────────
// Order Interface
// ─────────────────────────────
export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;

  status: "PENDING" | "PAID" | "FAILED" | "APPROVED"; // ✅ Added "APPROVED" state
  paymentStatus: "UNPAID" | "PAID";

  transactionUuid?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────
// Schema
// ─────────────────────────────
const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "APPROVED"], // ✅ Added "APPROVED" enum validation
      default: "PENDING",
    },

    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID"],
      default: "UNPAID",
    },

    transactionUuid: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", OrderSchema);