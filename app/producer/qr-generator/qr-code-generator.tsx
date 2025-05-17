"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

interface QrCodeGeneratorProps {
  value: string
  size?: number
  level?: "L" | "M" | "Q" | "H"
}

export function QrCodeGenerator({ value, size = 200, level = "M" }: QrCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const options = {
      errorCorrectionLevel: level,
      margin: 1,
      width: size,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    }

    QRCode.toCanvas(canvasRef.current, value, options, (error) => {
      if (error) console.error("Error generating QR code:", error)
    })
  }, [value, size, level])

  return <canvas ref={canvasRef} />
}
