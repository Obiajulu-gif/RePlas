"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"

// Utility to clean up WebGL context when component unmounts
export function useWebGLCleanup(canvasRef) {
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const gl = canvas.getContext("webgl") || canvas.getContext("webgl2")
        if (gl) {
          const loseContext = gl.getExtension("WEBGL_lose_context")
          if (loseContext) loseContext.loseContext()
        }
      }
    }
  }, [canvasRef])
}

// Utility to limit animation frame rate for better performance
export function useLimitedAnimation(callback, fps = 30) {
  const requestRef = useRef(null)
  const previousTimeRef = useRef(0)
  const intervalRef = useRef(1000 / fps)

  useEffect(() => {
    const animate = (time) => {
      if (time - previousTimeRef.current > intervalRef.current) {
        callback()
        previousTimeRef.current = time
      }
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [callback, fps])
}

// Utility to create a debounced function
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Utility to detect WebGL support
export function isWebGLSupported() {
  try {
    const canvas = document.createElement("canvas")
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
  } catch (e) {
    return false
  }
}

// Utility to preload fonts for Three.js
export function preloadFont(url) {
  return new Promise((resolve, reject) => {
    const loader = new FontLoader()
    loader.load(
      url,
      (font) => resolve(font),
      undefined,
      (error) => reject(error),
    )
  })
}

// Utility to monitor performance
export function usePerformanceMonitor(threshold = 30) {
  const [fps, setFps] = useState(60)
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const times = useRef([])

  useEffect(() => {
    let frameId
    let prevTime = performance.now()

    const loop = () => {
      const time = performance.now()
      frameId = requestAnimationFrame(loop)

      const currentFps = 1000 / (time - prevTime)
      times.current.push(currentFps)
      if (times.current.length > 30) {
        times.current.shift()
      }

      const averageFps = times.current.reduce((a, b) => a + b, 0) / times.current.length
      setFps(Math.round(averageFps))
      setIsLowPerformance(averageFps < threshold)

      prevTime = time
    }

    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [threshold])

  return { fps, isLowPerformance }
}

// Utility to optimize Three.js performance
export function optimizeThreeJS(scene, renderer) {
  // Set renderer pixel ratio with a maximum of 2
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Traverse scene and optimize objects
  scene.traverse((object) => {
    // Disable frustum culling for small scenes
    if (object.isMesh) {
      object.frustumCulled = false
    }
  })

  return () => {
    // Cleanup function
    scene.traverse((object) => {
      if (object.isMesh) {
        if (object.geometry) {
          object.geometry.dispose()
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      }
    })
  }
}
