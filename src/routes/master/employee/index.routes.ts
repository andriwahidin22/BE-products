import { Router } from "express";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
} from "../../../controllers/master/employee/index.controller";
import { authenticateToken } from "../../../middleware/AuthMiddleware";

const router = Router();

router.get("/", authenticateToken, getAllEmployees);
router.get("/:id", authenticateToken, getEmployeeById);
router.post("/", authenticateToken, createEmployee);
router.put("/:id", authenticateToken, updateEmployee);
router.delete("/:id", authenticateToken, deleteEmployee);

export default router;
