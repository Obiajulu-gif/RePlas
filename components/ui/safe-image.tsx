"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { ImageOff } from "lucide-react"

interface SafeImageProps extends Omit<ImageProps, "onError" | "src"> {
  src: string
  fallbackSrc?: string
}

export function SafeImage({ src, alt, fallbackSrc = "/placeholder.svg", className, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [error, setError] = useState<boolean>(false)

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    } else {
      setError(true)
    }
  }

  if (error) {
    return (
      <div
        className={cn("flex items-center justify-center bg-muted rounded-md", className)}
        style={{ width: props.width, height: props.height }}
      >
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  return <Image {...props} src={imgSrc || "/placeholder.svg"} alt={alt} className={className} onError={handleError} />
}
