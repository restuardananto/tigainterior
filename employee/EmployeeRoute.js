import express from "express";
import { verifyUser } from "../auth/AuthMiddleware.js";
import {
  createEmployee,
  getAllEmployee,
  getEmployeeId,
  updateEmployee,
  deleteEmployee,
} from "./EmployeeController.js";

const router = express.Router();

router.post("/api-employee", verifyUser, createEmployee);
router.get("/api-employee", getAllEmployee);
router.get("/api-employee/:id", getEmployeeId);
router.patch("/api-employee/:id", verifyUser, updateEmployee);
router.delete("/api-employee/:id", verifyUser, deleteEmployee);

export default router;
