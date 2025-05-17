"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react"

type AnimationContextType = {
  registerAnimation: (id: string, threshold?: number) => void
  unregisterAnimation: (id: string) => void
  isVisible: (id: string) => boolean
  isPaused: boolean
  togglePause: () => void
}

const AnimationContext = createContext<AnimationContextType | null>(null)

export const useAnimation = () => {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider")
  }
  return context
}

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use refs instead of state for observers to prevent re-renders
  const observersRef = useRef<Record<string, IntersectionObserver>>({})
  const [visibleElements, setVisibleElements] = useState<Record<string, boolean>>({})
  const [isPaused, setIsPaused] = useState(false)
  const registrationStatusRef = useRef<Map<string, boolean>>(new Map())

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      const handleChange = (e: MediaQueryListEvent) => {
        setIsPaused(e.matches)
      }

      if (mediaQuery.matches) {
        setIsPaused(true)
      }

      // Use addEventListener with fallback for older browsers
      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
      } else {
        // @ts-ignore - For older browsers
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    } catch (error) {
      console.error("Error setting up reduced motion listener:", error)
    }
  }, [])

  // Clean up observers on unmount
  useEffect(() => {
    return () => {
      try {
        Object.values(observersRef.current).forEach((observer) => {
          observer.disconnect()
        })
      } catch (error) {
        console.error("Error cleaning up observers:", error)
      }
    }
  }, [])

  // Stabilize function references with useCallback
  const registerAnimation = useCallback((id: string, threshold = 0.1) => {
    try {
      // Only run in browser environment
      if (typeof window === "undefined") return

      // Don't recreate observer if it already exists
      if (registrationStatusRef.current.get(id)) return
      registrationStatusRef.current.set(id, true)

      // Create a new observer for this element
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleElements((prev) => ({ ...prev, [id]: true }))
              // Once the element is visible, we can stop observing it
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold },
      )

      // Use requestAnimationFrame to ensure DOM is ready
      const frame = requestAnimationFrame(() => {
        const element = document.getElementById(id)
        if (element) {
          observer.observe(element)
          observersRef.current[id] = observer
        }
      })

      return () => cancelAnimationFrame(frame)
    } catch (error) {
      console.error("Error registering animation:", error)
    }
  }, [])

  const unregisterAnimation = useCallback((id: string) => {
    try {
      if (observersRef.current[id]) {
        observersRef.current[id].disconnect()
        delete observersRef.current[id]
      }
      registrationStatusRef.current.delete(id)
    } catch (error) {
      console.error("Error unregistering animation:", error)
    }
  }, [])

  const isVisible = useCallback(
    (id: string) => {
      return visibleElements[id] || false
    },
    [visibleElements],
  )

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      registerAnimation,
      unregisterAnimation,
      isVisible,
      isPaused,
      togglePause,
    }),
    [registerAnimation, unregisterAnimation, isVisible, isPaused, togglePause],
  )

  return <AnimationContext.Provider value={contextValue}>{children}</AnimationContext.Provider>
}

export const AnimatedElement: React.FC<{
  id: string
  children: React.ReactNode
  className?: string
  threshold?: number
  animation?: string
  delay?: number
}> = ({ id, children, className = "", threshold = 0.1, animation = "fade-in-up", delay = 0 }) => {
  const { registerAnimation, isVisible, isPaused } = useAnimation()
  const [mounted, setMounted] = useState(false)
  const registeredRef = useRef(false)

  useEffect(() => {
    setMounted(true)

    // Only register once to prevent infinite loops
    if (!registeredRef.current) {
      registerAnimation(id, threshold)
      registeredRef.current = true
    }

    // No cleanup needed as we're not returning anything
  }, [id, threshold, registerAnimation])

  if (!mounted) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    )
  }

  const visible = isVisible(id)
  const animationClass = visible && !isPaused ? animation : "opacity-100"
  const delayStyle = delay && !isPaused ? { animationDelay: `${delay}ms` } : {}

  return (
    <div id={id} className={`${className} ${animationClass}`} style={delayStyle}>
      {children}
    </div>
  )
}
