import { Router } from "express";
import authRoutes from "./auth/index.routes";
import employeeRoutes from "./master/employee/index.routes";
// import masterRoutes from "./master/index.routes"; // Nanti setelah kita buat

const router = Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);

export default router;
