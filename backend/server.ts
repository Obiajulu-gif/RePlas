import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import { config } from "dotenv"
import userRoutes from "./routes/user.routes"
import plasticSubmissionRoutes from "./routes/plastic-submission.routes"
import tokenRewardRoutes from "./routes/token-reward.routes"
import aiRoutes from "./routes/ai.routes"
import qrCodeRoutes from "./routes/qr-code.routes"
import materialTrackerRoutes from "./routes/material-tracker.routes"
import webhookRoutes from "./routes/webhook.routes"
import { errorHandler } from "./middleware/error.middleware"
import { connectToDatabase } from "./config/database"
import { setupCeloProvider } from "./config/blockchain"

// Load environment variables
config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Initialize database connection
connectToDatabase()

// Initialize Celo provider
setupCeloProvider()

// Routes
app.use("/api/users", userRoutes)
app.use("/api/submissions", plasticSubmissionRoutes)
app.use("/api/rewards", tokenRewardRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/qr", qrCodeRoutes)
app.use("/api/materials", materialTrackerRoutes)
app.use("/api/webhooks", webhookRoutes)

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
