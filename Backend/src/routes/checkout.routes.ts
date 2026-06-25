import { Router } from "express";
import { checkout } from "../controllers/checkout.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, checkout);  // POST /api/checkout

export default router;