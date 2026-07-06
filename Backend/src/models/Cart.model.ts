import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  totalItems: number;
  calculateTotals: () => void;
}

const CartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true },

    items: [
      {
        productId: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔥 IMPORTANT METHOD
CartSchema.methods.calculateTotals = function () {
  this.totalItems = this.items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  this.totalAmount = this.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
};

export default mongoose.model<ICart>("Cart", CartSchema);