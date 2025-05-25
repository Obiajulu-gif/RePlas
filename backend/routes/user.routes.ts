import express from "express"
import { register, login, getCurrentUser, updateProfile, getAllUsers } from "../controllers/user.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { UserRole } from "../models/user.model"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.get("/me", authenticate, getCurrentUser)
router.patch("/profile", authenticate, updateProfile)

// Admin routes
router.get("/", authenticate, authorize(UserRole.ADMIN), getAllUsers)

export default router
