import express from "express"
import { generateQR, resolveBatch, generateMultipleQR } from "../controllers/qr-code.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { UserRole } from "../models/user.model"

const router = express.Router()

// Public routes
router.get("/batch/:batchId", resolveBatch)

// Protected routes
router.post("/generate", authenticate, generateQR)

// Producer routes
router.post("/generate-multiple", authenticate, authorize(UserRole.PRODUCER), generateMultipleQR)

export default router
