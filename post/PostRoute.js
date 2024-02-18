import express from "express";
import {
  createPost,
  getAllPost,
  getPostId,
  updatePost,
  deletePost,
} from "./PostController.js";
import { verifyUser } from "../auth/AuthMiddleware.js";

const router = express.Router();

router.post("/api-post", verifyUser, createPost);
router.get("/api-post", getAllPost);
router.get("/api-post/:id", getPostId);
router.patch("/api-post/:id", verifyUser, updatePost);
router.delete("/api-post/:id", verifyUser, deletePost);

export default router;
