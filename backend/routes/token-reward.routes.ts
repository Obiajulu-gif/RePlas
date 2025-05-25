import express from "express"
import {
  getBalance,
  getTransactionHistory,
  transferTokens,
  adminDistributeRewards,
} from "../controllers/token-reward.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { UserRole } from "../models/user.model"

const router = express.Router()

// Protected routes
router.get("/balance", authenticate, getBalance)
router.get("/transactions", authenticate, getTransactionHistory)
router.post("/transfer", authenticate, transferTokens)

// Admin routes
router.post("/distribute", authenticate, authorize(UserRole.ADMIN), adminDistributeRewards)

export default router
