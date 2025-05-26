"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"

// Utility to clean up WebGL context when component unmounts
export function useWebGLCleanup(canvasRef: React.RefObject<HTMLCanvasElement>) {
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
export function useLimitedAnimation(callback: () => void, fps: number = 30) {
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number>(0)
  const intervalRef = useRef<number>(1000 / fps)

  useEffect(() => {
    const animate = (time: number) => {
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
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  } as T
}

// Utility to detect WebGL support
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
  } catch (e) {
    return false
  }
}

// Utility to preload fonts for Three.js
export function preloadFont(url: string): Promise<THREE.Font> {
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
export function usePerformanceMonitor(threshold: number = 30) {
  const [fps, setFps] = useState(60)
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const times = useRef<number[]>([])

  useEffect(() => {
    let frameId: number
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
export function optimizeThreeJS(scene: THREE.Scene, renderer: THREE.WebGLRenderer): () => void {
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

// Utility to create responsive Three.js canvas
export function useResponsiveThreeJS(containerRef: React.RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width, height })
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [containerRef])

  return dimensions
}

// Utility to handle Three.js texture loading with error handling
export function loadTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader()
    loader.load(
      url,
      (texture) => {
        // Set texture properties for better quality
        texture.generateMipmaps = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        resolve(texture)
      },
      undefined,
      (error) => reject(error)
    )
  })
}

// Utility to create a simple material with fallback
export function createMaterialWithFallback(
  options: {
    color?: string | number
    map?: THREE.Texture
    transparent?: boolean
    opacity?: number
  } = {}
): THREE.Material {
  try {
    return new THREE.MeshStandardMaterial({
      color: options.color || 0x00ff00,
      map: options.map,
      transparent: options.transparent || false,
      opacity: options.opacity || 1,
    })
  } catch (error) {
    console.warn('Failed to create MeshStandardMaterial, falling back to MeshBasicMaterial')
    return new THREE.MeshBasicMaterial({
      color: options.color || 0x00ff00,
      map: options.map,
      transparent: options.transparent || false,
      opacity: options.opacity || 1,
    })
  }
}

// Utility to safely dispose of Three.js objects
export function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose()
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            disposeMaterial(material)
          })
        } else {
          disposeMaterial(child.material)
        }
      }
    }
  })
}

// Helper function to dispose materials
function disposeMaterial(material: THREE.Material) {
  if (material.map) material.map.dispose()
  if ('normalMap' in material && material.normalMap) material.normalMap.dispose()
  if ('roughnessMap' in material && material.roughnessMap) material.roughnessMap.dispose()
  if ('metalnessMap' in material && material.metalnessMap) material.metalnessMap.dispose()
  if ('envMap' in material && material.envMap) material.envMap.dispose()
  material.dispose()
}

// Utility to create a simple orbit-like camera controller
export function useSimpleOrbitControls(
  camera: THREE.Camera,
  target: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
) {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cameraPosition, setCameraPosition] = useState({
    theta: 0,
    phi: Math.PI / 2,
    radius: 10
  })

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      setIsMouseDown(true)
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    const handleMouseUp = () => {
      setIsMouseDown(false)
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return

      const deltaX = event.clientX - mousePosition.x
      const deltaY = event.clientY - mousePosition.y

      setCameraPosition(prev => ({
        ...prev,
        theta: prev.theta + deltaX * 0.01,
        phi: Math.max(0.1, Math.min(Math.PI - 0.1, prev.phi + deltaY * 0.01))
      }))

      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      setCameraPosition(prev => ({
        ...prev,
        radius: Math.max(2, Math.min(50, prev.radius + event.deltaY * 0.01))
      }))
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [isMouseDown, mousePosition])

  useEffect(() => {
    const { theta, phi, radius } = cameraPosition
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    camera.position.set(x + target.x, y + target.y, z + target.z)
    camera.lookAt(target)
  }, [camera, cameraPosition, target])

  return cameraPosition
}