import express from "express"
import { handleTokenTransfer, handleBatchUpdate } from "../controllers/webhook.controller"

const router = express.Router()

// Webhook routes
router.post("/token-transfer", handleTokenTransfer)
router.post("/batch-update", handleBatchUpdate)

export default router
