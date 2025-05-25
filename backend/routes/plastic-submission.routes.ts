import express from "express"
import {
  createSubmission,
  getUserSubmissions,
  getSubmissionById,
  verifySubmission,
  getAllSubmissions,
} from "../controllers/plastic-submission.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { UserRole } from "../models/user.model"

const router = express.Router()

// Protected routes
router.post("/", authenticate, createSubmission)
router.get("/user", authenticate, getUserSubmissions)
router.get("/:id", authenticate, getSubmissionById)

// Admin/Recycler routes
router.patch("/:id/verify", authenticate, authorize(UserRole.ADMIN, UserRole.RECYCLER), verifySubmission)
router.get("/", authenticate, authorize(UserRole.ADMIN, UserRole.RECYCLER), getAllSubmissions)

export default router
