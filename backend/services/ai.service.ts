import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai"
import { config } from "dotenv"

config()

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Get chat model
const getChatModel = (): GenerativeModel => {
  return genAI.getGenerativeModel({ model: "gemini-pro" })
}

// Get vision model
const getVisionModel = (): GenerativeModel => {
  return genAI.getGenerativeModel({ model: "gemini-pro-vision" })
}

// Chat with AI
export const chatWithAI = async (messages: { role: string; content: string }[]): Promise<string> => {
  try {
    const model = getChatModel()

    const chat = model.startChat({
      history: messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    })

    const result = await chat.sendMessage(messages[messages.length - 1].content)
    const response = result.response

    return response.text()
  } catch (error) {
    console.error("AI chat error:", error)
    throw new Error("Failed to get response from AI")
  }
}

// Chat with AI (streaming)
export const streamChatWithAI = async (
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void,
): Promise<void> => {
  try {
    const model = getChatModel()

    const chat = model.startChat({
      history: messages.slice(0, -1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    })

    const lastMessage = messages[messages.length - 1].content
    const result = await chat.sendMessageStream(lastMessage)

    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      onChunk(chunkText)
    }
  } catch (error) {
    console.error("AI streaming chat error:", error)
    throw new Error("Failed to stream response from AI")
  }
}

// Analyze image
export const analyzeImage = async (
  imageUrl: string,
): Promise<{
  type: string
  confidence: number
  recyclable: boolean
  description: string
}> => {
  try {
    // Fetch image data
    const imageResponse = await fetch(imageUrl)
    const imageData = await imageResponse.arrayBuffer()

    // Convert to base64
    const base64Image = Buffer.from(imageData).toString("base64")

    const model = getVisionModel()

    const prompt = `
      Analyze this image of plastic waste. 
      Identify the type of plastic (PET, HDPE, PVC, LDPE, PP, PS, or OTHER).
      Determine if it's recyclable.
      Provide a brief description.
      Format your response as JSON with the following fields:
      {
        "type": "The plastic type",
        "confidence": 0.95, // your confidence level between 0 and 1
        "recyclable": true/false,
        "description": "Brief description of what you see"
      }
    `

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
    ])

    const aiResponse = result.response
    const text = aiResponse.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error("AI image analysis error:", error)

    // Return default response if analysis fails
    return {
      type: "OTHER",
      confidence: 0.5,
      recyclable: false,
      description: "Unable to analyze image accurately",
    }
  }
}

// Generate environmental impact
export const generateEnvironmentalImpact = async (
  submissions: { type: string; weight: number; timestamp: number }[],
): Promise<{
  co2Offset: number
  waterSaved: number
  treesEquivalent: number
  summary: string
}> => {
  try {
    // Calculate total weight
    const totalWeight = submissions.reduce((sum, sub) => sum + sub.weight, 0)

    // In a real implementation, we would use more accurate conversion factors
    // These are simplified estimates
    const co2Offset = totalWeight * 2 // 2kg CO2 per 1kg plastic
    const waterSaved = totalWeight * 8.7 // 8.7L water per 1kg plastic
    const treesEquivalent = co2Offset / 240 // 240kg CO2 per tree per year

    const model = getChatModel()

    const prompt = `
      I've recycled ${totalWeight.toFixed(1)}kg of plastic waste.
      Based on this, I've calculated:
      - CO2 offset: ${co2Offset.toFixed(1)}kg
      - Water saved: ${waterSaved.toFixed(1)}L
      - Trees equivalent: ${treesEquivalent.toFixed(2)} trees
      
      Please provide a brief, encouraging summary of this environmental impact.
      Keep it under 100 words and make it motivational.
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const summary = response.text()

    return {
      co2Offset,
      waterSaved,
      treesEquivalent,
      summary,
    }
  } catch (error) {
    console.error("Environmental impact generation error:", error)

    // Return default response if generation fails
    return {
      co2Offset: 0,
      waterSaved: 0,
      treesEquivalent: 0,
      summary: "Unable to generate environmental impact summary",
    }
  }
}

// Detect fake submissions
export const detectFakeSubmission = async (
  imageUrl: string,
  claimedType: string,
  claimedWeight: number,
): Promise<{
  isSuspicious: boolean
  confidence: number
  reason?: string
}> => {
  try {
    // Analyze image
    const analysis = await analyzeImage(imageUrl)

    // Check if claimed type matches detected type
    const typeMatch = analysis.type === claimedType

    // Check if confidence is high enough
    const highConfidence = analysis.confidence > 0.7

    // Determine if submission is suspicious
    const isSuspicious = !typeMatch || !highConfidence

    return {
      isSuspicious,
      confidence: analysis.confidence,
      reason: isSuspicious
        ? `Claimed type (${claimedType}) ${!typeMatch ? "does not match" : "matches"} detected type (${analysis.type}) with ${analysis.confidence.toFixed(2)} confidence.`
        : undefined,
    }
  } catch (error) {
    console.error("Fake submission detection error:", error)

    // Return default response if detection fails
    return {
      isSuspicious: true,
      confidence: 0,
      reason: "Unable to analyze submission accurately",
    }
  }
}
