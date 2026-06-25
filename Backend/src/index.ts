import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import checkoutRoutes from "./routes/checkout.routes";
import paymentRoutes from "./routes/payment.routes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payment",paymentRoutes);



// ── Health check ──
app.get("/", (_req, res) => {
  res.json({ message: "ShopNow API running ✅" });
});

// ── DB + Server ──
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
  })
  .catch((err) => console.error("MongoDB error:", err));