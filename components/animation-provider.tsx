"use client"

import React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"

type AnimationContextType = {
  registerAnimation: (id: string, threshold?: number) => void
  unregisterAnimation: (id: string) => void
  isVisible: (id: string) => boolean
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

  // Clean up observers on unmount
  useEffect(() => {
    return () => {
      Object.values(observersRef.current).forEach((observer) => {
        observer.disconnect()
      })
    }
  }, [])

  // Stabilize function references with useCallback
  const registerAnimation = useCallback((id: string, threshold = 0.1) => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    // Don't recreate observer if it already exists
    if (observersRef.current[id]) return

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
    requestAnimationFrame(() => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
        observersRef.current[id] = observer
      }
    })
  }, [])

  const unregisterAnimation = useCallback((id: string) => {
    if (observersRef.current[id]) {
      observersRef.current[id].disconnect()
      delete observersRef.current[id]
    }
  }, [])

  const isVisible = useCallback(
    (id: string) => {
      return visibleElements[id] || false
    },
    [visibleElements],
  )

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      registerAnimation,
      unregisterAnimation,
      isVisible,
    }),
    [registerAnimation, unregisterAnimation, isVisible],
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
  const { registerAnimation, isVisible } = useAnimation()
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
  const animationClass = visible ? animation : "opacity-0"
  const delayStyle = delay ? { animationDelay: `${delay}ms` } : {}

  return (
    <div id={id} className={`${className} ${animationClass}`} style={delayStyle}>
      {children}
    </div>
  )
}
