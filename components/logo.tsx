import { cn } from "@/lib/utils"

type LogoProps = {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white" | "dark"
  className?: string
}

export function Logo({ size = "md", variant = "default", className }: LogoProps) {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const textSizeClasses = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  }

  const variantClasses = {
    default: "text-primary",
    white: "text-white",
    dark: "text-gray-900",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-full w-full", variantClasses[variant])}
        >
          {/* Recycling arrows */}
          <path
            d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 12C43.046 12 52 20.954 52 32C52 43.046 43.046 52 32 52C20.954 52 12 43.046 12 32C12 20.954 20.954 12 32 12Z"
            fill="currentColor"
            fillOpacity="0.2"
          />
          <path d="M32 16L24 24H28V36H36V24H40L32 16Z" fill="currentColor" />
          <path d="M21.856 40L16 30.928L19.072 29L24.928 38.072L23 40H21.856Z" fill="currentColor" />
          <path d="M42.144 40L48 30.928L44.928 29L39.072 38.072L41 40H42.144Z" fill="currentColor" />

          {/* Blockchain cubes */}
          <rect x="28" y="28" width="8" height="8" fill="currentColor" />
          <rect x="36" y="32" width="4" height="4" fill="currentColor" fillOpacity="0.7" />
          <rect x="24" y="32" width="4" height="4" fill="currentColor" fillOpacity="0.7" />
          <rect x="32" y="36" width="4" height="4" fill="currentColor" fillOpacity="0.7" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={cn("font-bold leading-none", textSizeClasses[size])}>RePlas</span>
        {size !== "xs" && <span className="text-xs text-muted-foreground leading-tight">Blockchain Recycling</span>}
      </div>
    </div>
  )
}
