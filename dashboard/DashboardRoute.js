import express from "express";
import { getStats, createStats } from "./DashboardController.js";

const router = express.Router();

router.get("/api-stats", getStats);
router.post("/api-createstats", createStats);

export default router;
