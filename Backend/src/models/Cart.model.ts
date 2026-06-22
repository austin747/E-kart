import mongoose, { Document, Schema } from "mongoose";

interface CartItem {
  productId: string;   // ✅ changed from ObjectId to string
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  calculateTotals: () => void;
}

const CartItemSchema = new Schema<CartItem>({
  productId: {
    type: String,        // ✅ changed from Schema.Types.ObjectId
    required: true,
  },
  name:     { type: String, required: true },
  image:    { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items:       { type: [CartItemSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
    totalItems:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

CartSchema.methods.calculateTotals = function (): void {
  this.totalItems = this.items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );
  this.totalAmount = this.items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );
};

export default mongoose.model<ICart>("Cart", CartSchema);