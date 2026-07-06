import { Router } from "express";
import {
  getAllUsers,
  getAllOrders,
  getAllProducts,
  updateUserRole,
  approveOrder,
  approveProduct,
} from "../controllers/admin.controller";
import { protect, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/users",                  getAllUsers);     // GET  /api/admin/users
router.get("/orders",                 getAllOrders);    // GET  /api/admin/orders
router.get("/products",               getAllProducts);  // GET  /api/admin/products  ← NEW
router.put("/users/:id/role",         updateUserRole); // PUT  /api/admin/users/:id/role
router.put("/orders/:id/approve",     approveOrder);   // PUT  /api/admin/orders/:id/approve
router.put("/products/:id/approve",   approveProduct); // PUT  /api/admin/products/:id/approve

export default router;