"use client"

import type React from "react"

import type * as THREE from "three"
import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"

// Simple geometry cache
const geometryCache: Record<string, THREE.BufferGeometry> = {}

export function getCachedGeometry(key: string, createGeometry: () => THREE.BufferGeometry): THREE.BufferGeometry {
  if (!geometryCache[key]) {
    geometryCache[key] = createGeometry()
  }
  return geometryCache[key]
}

// Simple material cache
const materialCache: Record<string, THREE.Material> = {}

export function getCachedMaterial(key: string, createMaterial: () => THREE.Material): THREE.Material {
  if (!materialCache[key]) {
    materialCache[key] = createMaterial()
  }
  return materialCache[key]
}

// Dispose Three.js object and its children
export function disposeObject3D(object: THREE.Object3D): void {
  if (!object) return

  // Handle children first
  const children = [...object.children]
  for (const child of children) {
    disposeObject3D(child)
  }

  // Handle geometries and materials
  if ((object as THREE.Mesh).geometry) {
    ;(object as THREE.Mesh).geometry.dispose()
  }

  if ((object as THREE.Mesh).material) {
    const materials = Array.isArray((object as THREE.Mesh).material)
      ? (object as THREE.Mesh).material
      : [(object as THREE.Mesh).material]

    for (const material of materials) {
      for (const key in material) {
        const value = material[key]
        if (value && typeof value.dispose === "function") {
          value.dispose()
        }
      }
      material.dispose()
    }
  }

  // Remove from parent
  if (object.parent) {
    object.parent.remove(object)
  }
}

// Hook for throttled rendering
export function useThrottledRender(fps = 30) {
  const lastRenderTimeRef = useRef(0)

  return (currentTime: number) => {
    const interval = 1 / fps
    if (currentTime - lastRenderTimeRef.current >= interval) {
      lastRenderTimeRef.current = currentTime
      return true
    }
    return false
  }
}

// Hook for cleaning up WebGL context
export function useWebGLCleanup(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && canvasRef.current) {
        const context = canvasRef.current.getContext("webgl") || canvasRef.current.getContext("webgl2")
        if (context) {
          const loseContext = context.getExtension("WEBGL_lose_context")
          if (loseContext) loseContext.loseContext()
        }
      }
    }
  }, [canvasRef])
}

// Hook for limiting animations
export function useLimitedAnimation(callback: (delta: number) => void, fps = 30) {
  const lastTimeRef = useRef(0)

  useFrame((state, delta) => {
    const currentTime = state.clock.getElapsedTime()
    const interval = 1 / fps

    if (currentTime - lastTimeRef.current >= interval) {
      callback(delta)
      lastTimeRef.current = currentTime
    }
  })
}
