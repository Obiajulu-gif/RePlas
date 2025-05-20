import express from "express"
import { handleBlockchainEvent, handleExternalServiceWebhook } from "../controllers/webhook.controller"

const router = express.Router()

// Blockchain event webhooks
router.post("/blockchain", handleBlockchainEvent)

// External service webhooks
router.post("/external/:service", handleExternalServiceWebhook)

export default router
