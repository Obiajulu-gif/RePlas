import express from "express"
import {
  createBatch,
  getBatchById,
  linkSubmissionToBatch,
  linkConsumerToBatch,
  updateBatchStatus,
  getAllBatches,
} from "../controllers/material-tracker.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { UserRole } from "../models/user.model"

const router = express.Router()

// Public routes
router.get("/batch/:batchId", getBatchById)

// Protected routes
router.post("/consumer/link", authenticate, linkConsumerToBatch)

// Producer routes
router.post("/batch", authenticate, authorize(UserRole.PRODUCER), createBatch)

// Admin/Recycler routes
router.post("/submission/link", authenticate, authorize(UserRole.ADMIN, UserRole.RECYCLER), linkSubmissionToBatch)
router.patch("/batch/:batchId/status", authenticate, authorize(UserRole.ADMIN, UserRole.RECYCLER), updateBatchStatus)
router.get("/batches", authenticate, authorize(UserRole.ADMIN, UserRole.RECYCLER, UserRole.PRODUCER), getAllBatches)

export default router
