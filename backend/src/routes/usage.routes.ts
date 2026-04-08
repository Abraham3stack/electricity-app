import express from 'express';
import { createUsage } from '../controllers/usage.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { predictUsage } from '../controllers/usage.controller.js';
import { getAlert } from '../controllers/usage.controller.js';
import { getUsageHistory } from '../controllers/usage.controller.js';

const router = express.Router();

router.post("/", protect, createUsage);

router.get("/predict", protect, predictUsage);

router.get("/alert", protect, getAlert);

router.get("/history", protect, getUsageHistory);

export default router;