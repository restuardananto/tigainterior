import express from "express";
import {
  createGallery,
  getAllGallery,
  getGalleryPost,
  // getGalleryId,
  updateGallery,
  deleteGallery,
} from "./GalleryController.js";
import { verifyUser } from "../auth/AuthMiddleware.js";

const router = express.Router();

router.post("/api-gallery", verifyUser, createGallery);
router.get("/api-gallery", getAllGallery);
router.get("/api-gallery/:post_id", getGalleryPost);
// router.get("/api-gallery/:id", getGalleryId);
router.patch("/api-gallery/:id", verifyUser, updateGallery);
router.delete("/api-gallery/:id", verifyUser, deleteGallery);

export default router;
