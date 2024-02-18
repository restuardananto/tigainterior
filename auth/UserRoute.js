import express from "express";
import {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
} from "./UserController.js";
import { verifyUser } from "./AuthMiddleware.js";

const router = express.Router();

router.post("/api-user", createUser);
router.get("/api-user", verifyUser, getUser);
router.get("/api-user/:id", verifyUser, getUserById);
router.patch("/api-user/:id", verifyUser, updateUser);
router.delete("/api-user/:id", verifyUser, deleteUser);

export default router;
