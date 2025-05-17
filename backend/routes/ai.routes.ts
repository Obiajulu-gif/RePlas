import express from "express"
import { chat, analyze, environmentalImpact, detectFake } from "../controllers/ai.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { UserRole } from "../models/user.model"

const router = express.Router()

// Protected routes
router.post("/chat", authenticate, chat)
router.post("/analyze", authenticate, analyze)
router.get("/impact", authenticate, environmentalImpact)

// Admin/Recycler routes
router.post("/detect-fake", authenticate, authorize(UserRole.ADMIN, UserRole.RECYCLER), detectFake)

export default router
