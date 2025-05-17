"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"

interface SafeImageProps extends React.ComponentProps<typeof Image> {
  fallbackSrc?: string
}

export function SafeImage({ src, alt, fallbackSrc = "/placeholder.svg", ...props }: SafeImageProps) {
  const [error, setError] = useState(false)

  return <Image src={error ? fallbackSrc : src} alt={alt} onError={() => setError(true)} {...props} />
}
