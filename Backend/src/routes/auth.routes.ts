import { Router } from "express";
import { register, login, getMe, logout } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";


const router = Router();

// Public routes
router.post("/register", register);   // POST /api/auth/register
router.post("/login",    login);      // POST /api/auth/login
router.post("/logout",   logout);     // POST /api/auth/logout

// Protected routes (need JWT token)
router.get("/me", protect, getMe);    // GET  /api/auth/me

export default router;