import { toast } from "@/hooks/use-toast"

// Define the types of QR codes our system can handle
export enum QrCodeType {
  BATCH = "batch",
  PRODUCT = "product",
  RECYCLING_CENTER = "recycling-center",
  PROFILE = "profile",
  URL = "url",
  TEXT = "text",
  UNKNOWN = "unknown",
}

// Define the structure for QR code data
interface QrCodeData {
  type: QrCodeType
  id?: string
  url?: string
  data?: any
}

/**
 * Detects the type of QR code from the scanned text
 */
export function detectQrCodeType(text: string): QrCodeType {
  try {
    // Try to parse as JSON first
    const data = JSON.parse(text)

    // Check if it has a type field
    if (data.type) {
      switch (data.type) {
        case "batch":
          return QrCodeType.BATCH
        case "product":
          return QrCodeType.PRODUCT
        case "recycling-center":
          return QrCodeType.RECYCLING_CENTER
        case "profile":
          return QrCodeType.PROFILE
        default:
          return QrCodeType.UNKNOWN
      }
    }

    // If no type field but has other known fields
    if (data.batchId) return QrCodeType.BATCH
    if (data.productId) return QrCodeType.PRODUCT
    if (data.centerId) return QrCodeType.RECYCLING_CENTER
    if (data.profileId) return QrCodeType.PROFILE

    return QrCodeType.UNKNOWN
  } catch (e) {
    // Not JSON, check if it's a URL
    if (text.startsWith("http://") || text.startsWith("https://")) {
      // Check if it's an internal URL with known patterns
      if (text.includes("/batch/") || text.includes("/batch-tracking/")) {
        return QrCodeType.BATCH
      }
      if (text.includes("/product/") || text.includes("/marketplace/")) {
        return QrCodeType.PRODUCT
      }
      if (text.includes("/recycling-center/") || text.includes("/recycling-centers/")) {
        return QrCodeType.RECYCLING_CENTER
      }
      if (text.includes("/profile/")) {
        return QrCodeType.PROFILE
      }

      return QrCodeType.URL
    }

    // Just plain text
    return QrCodeType.TEXT
  }
}

/**
 * Parses the QR code data based on its type
 */
export function parseQrCodeData(text: string, type: QrCodeType): QrCodeData {
  try {
    switch (type) {
      case QrCodeType.BATCH: {
        try {
          // Try to parse as JSON
          const data = JSON.parse(text)
          return {
            type: QrCodeType.BATCH,
            id: data.batchId || data.id,
            data,
          }
        } catch {
          // Extract batch ID from URL
          const match = text.match(/\/batch(?:-tracking)?\/([^/?]+)/)
          return {
            type: QrCodeType.BATCH,
            id: match ? match[1] : undefined,
            url: text,
          }
        }
      }

      case QrCodeType.PRODUCT: {
        try {
          const data = JSON.parse(text)
          return {
            type: QrCodeType.PRODUCT,
            id: data.productId || data.id,
            data,
          }
        } catch {
          const match = text.match(/\/product(?:s)?\/([^/?]+)/)
          return {
            type: QrCodeType.PRODUCT,
            id: match ? match[1] : undefined,
            url: text,
          }
        }
      }

      case QrCodeType.RECYCLING_CENTER: {
        try {
          const data = JSON.parse(text)
          return {
            type: QrCodeType.RECYCLING_CENTER,
            id: data.centerId || data.id,
            data,
          }
        } catch {
          const match = text.match(/\/recycling-center(?:s)?\/([^/?]+)/)
          return {
            type: QrCodeType.RECYCLING_CENTER,
            id: match ? match[1] : undefined,
            url: text,
          }
        }
      }

      case QrCodeType.PROFILE: {
        try {
          const data = JSON.parse(text)
          return {
            type: QrCodeType.PROFILE,
            id: data.profileId || data.id,
            data,
          }
        } catch {
          const match = text.match(/\/profile\/([^/?]+)/)
          return {
            type: QrCodeType.PROFILE,
            id: match ? match[1] : undefined,
            url: text,
          }
        }
      }

      case QrCodeType.URL:
        return {
          type: QrCodeType.URL,
          url: text,
        }

      case QrCodeType.TEXT:
      default:
        return {
          type: QrCodeType.TEXT,
          data: text,
        }
    }
  } catch (error) {
    console.error("Error parsing QR code data:", error)
    return {
      type: QrCodeType.UNKNOWN,
      data: text,
    }
  }
}

/**
 * Handles the QR code data and returns appropriate action
 */
export async function handleQrCodeData(text: string): Promise<{ url?: string; data?: any }> {
  try {
    // Detect the type of QR code
    const type = detectQrCodeType(text)

    // Parse the data based on the type
    const parsedData = parseQrCodeData(text, type)

    // Handle based on type
    switch (parsedData.type) {
      case QrCodeType.BATCH:
        toast({
          title: "Batch QR Code Detected",
          description: `Navigating to batch ${parsedData.id || "details"}...`,
        })
        return {
          url: parsedData.url || `/batch-tracking/${parsedData.id}`,
        }

      case QrCodeType.PRODUCT:
        toast({
          title: "Product QR Code Detected",
          description: `Navigating to product ${parsedData.id || "details"}...`,
        })
        return {
          url: parsedData.url || `/marketplace/${parsedData.id}`,
        }

      case QrCodeType.RECYCLING_CENTER:
        toast({
          title: "Recycling Center QR Code Detected",
          description: `Navigating to recycling center ${parsedData.id || "details"}...`,
        })
        return {
          url: parsedData.url || `/recycling-centers/${parsedData.id}`,
        }

      case QrCodeType.PROFILE:
        toast({
          title: "Profile QR Code Detected",
          description: `Navigating to user profile...`,
        })
        return {
          url: parsedData.url || `/profile/${parsedData.id}`,
        }

      case QrCodeType.URL:
        // Check if it's an internal URL
        if (
          parsedData.url &&
          (parsedData.url.startsWith("/") ||
            parsedData.url.includes("localhost") ||
            parsedData.url.includes("plastic-platform"))
        ) {
          toast({
            title: "URL QR Code Detected",
            description: "Navigating to the scanned URL...",
          })
          return {
            url: parsedData.url,
          }
        } else {
          // External URL - show warning
          toast({
            title: "External URL Detected",
            description: "This QR code points to an external website. Proceed with caution.",
            variant: "destructive",
          })
          // For security, we don't automatically navigate to external URLs
          return {
            data: parsedData,
          }
        }

      case QrCodeType.TEXT:
        toast({
          title: "Text QR Code Detected",
          description: "The QR code contains text information.",
        })
        return {
          data: parsedData.data,
        }

      default:
        toast({
          title: "Unknown QR Code Format",
          description: "The scanned QR code format is not recognized.",
          variant: "destructive",
        })
        return {
          data: text,
        }
    }
  } catch (error) {
    console.error("Error handling QR code data:", error)
    toast({
      title: "Error Processing QR Code",
      description: error instanceof Error ? error.message : "Failed to process the QR code",
      variant: "destructive",
    })
    throw error
  }
}
