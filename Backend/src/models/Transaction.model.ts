import mongoose, { Document, Schema } from "mongoose";

export type TransactionStatus = "PENDING" | "COMPLETE" | "FAILED" | "CANCELED";

interface TransactionItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  transactionUuid: string;     // our own unique ID, sent to eSewa
  productCode: string;         // eSewa merchant code (EPAYTEST for sandbox)
  items: TransactionItem[];
  totalAmount: number;
  status: TransactionStatus;
  esewaTransactionCode?: string;  // eSewa's own reference code, filled in after verification
  createdAt: Date;
  updatedAt: Date;
}

const TransactionItemSchema = new Schema<TransactionItem>({
  productId: { type: String, required: true },
  name:      { type: String, required: true },
  image:     { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true },
});

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    items: {
      type: [TransactionItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETE", "FAILED", "CANCELED"],
      default: "PENDING",
    },
    esewaTransactionCode: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);