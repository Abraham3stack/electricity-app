import express from "express";
import { createToken, initializeUnits } from "../controllers/token.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { getBalance } from "../controllers/token.controller.js";

const router = express.Router();

router.post("/", protect, createToken);

router.post("/init", protect, initializeUnits);

router.get("/balance", protect, getBalance);

export default router;