import { Router } from "express";
import { initiatePayment,verifyPayment  } from "../controllers/payment.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/initiate", protect, initiatePayment);  // POST /api/payment/initiate

router.get("/verify", verifyPayment); 

export default router;