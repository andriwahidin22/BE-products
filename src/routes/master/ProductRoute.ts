import { Router } from "express";
import ProductController from "../../controllers/master/ProductController";
import { authenticate, adminOnly } from "../../middleware/AuthMiddleware";
import upload from "../../middleware/uploadMiddleware";

const router = Router();

// Public routes
router.get("/", ProductController.getAllProducts);

// Admin-only routes
router.post(
  "/",
  authenticate,
  adminOnly,
  upload.single("image"),
  ProductController.createProduct
);
router.put("/:id", authenticate, adminOnly, ProductController.updateProduct);
router.delete("/:id", authenticate, adminOnly, ProductController.deleteProduct);

export default router;
