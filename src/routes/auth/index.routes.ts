import { Router } from "express";
import { login, logout, me } from "../../controllers/auth/index.controller";
import { authenticateToken } from "../../middleware/AuthMiddleware";

const router = Router();

router.post("/login", login);
router.post("/logout", authenticateToken, logout);
router.get("/me", authenticateToken, me);

export default router;
