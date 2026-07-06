import mongoose, { Document, Schema } from "mongoose";

export interface ITransactionItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ITransaction extends Document {
  userId: string;
  orderId: string;
  transactionUuid: string;
  productCode: string;
  items: ITransactionItem[];
  totalAmount: number;
  status: "PENDING" | "COMPLETE" | "FAILED" | "APPROVED"; // ✅ Added APPROVED type
  esewaTransactionCode?: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      unique: true,
    },
    transactionUuid: {
      type: String,
      required: true,
      unique: true,
    },
    productCode: {
      type: String,
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
      enum: ["PENDING", "COMPLETE", "FAILED", "APPROVED"], // ✅ Added APPROVED enum option
      default: "PENDING",
    },
    esewaTransactionCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);