import express from "express";
import { Login, Me, Logout } from "./AuthController.js";

const router = express.Router();

router.post("/api-login", Login);
router.get("/api-me", Me);
router.delete("/api-logout", Logout);

export default router;
