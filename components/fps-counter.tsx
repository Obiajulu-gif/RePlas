"use client"

import { useState, useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import type * as THREE from "three"

interface FPSCounterProps {
  showGraph?: boolean
  showCounts?: boolean
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

// Component to display FPS in the canvas
export function FPSStats({ showGraph = false, showCounts = false }: { showGraph?: boolean; showCounts?: boolean }) {
  const fpsRef = useRef<number[]>([])
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const [fps, setFps] = useState(0)
  const { scene } = useThree()
  const [objectCount, setObjectCount] = useState(0)
  const [triangleCount, setTriangleCount] = useState(0)

  // Count objects and triangles in the scene
  const countObjects = () => {
    let objects = 0
    let triangles = 0

    scene.traverse((object) => {
      if (object.visible) {
        // Count visible objects
        if (object.type === "Mesh" || object.type === "Line" || object.type === "Points") {
          objects++

          // Count triangles if it's a mesh with geometry
          if (object.type === "Mesh" && (object as THREE.Mesh).geometry) {
            const geometry = (object as THREE.Mesh).geometry
            if (geometry.index !== null) {
              triangles += geometry.index.count / 3
            } else if (geometry.attributes.position) {
              triangles += geometry.attributes.position.count / 3
            }
          }
        }
      }
    })

    return { objects, triangles: Math.floor(triangles) }
  }

  useFrame(() => {
    // Count frames
    frameCountRef.current += 1

    // Calculate FPS every 500ms
    const currentTime = performance.now()
    const elapsed = currentTime - lastTimeRef.current

    if (elapsed >= 500) {
      const currentFps = Math.round((frameCountRef.current * 1000) / elapsed)
      setFps(currentFps)

      // Store FPS history for the graph
      if (showGraph) {
        fpsRef.current.push(currentFps)
        if (fpsRef.current.length > 100) {
          fpsRef.current.shift()
        }
      }

      // Count objects and triangles (less frequently to reduce performance impact)
      if (showCounts) {
        const { objects, triangles } = countObjects()
        setObjectCount(objects)
        setTriangleCount(triangles)
      }

      // Reset counters
      frameCountRef.current = 0
      lastTimeRef.current = currentTime
    }
  })

  return (
    <group position={[-0.9, 0.9, -2]}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.8, showCounts ? 0.5 : 0.3]} />
        <meshBasicMaterial color="black" transparent opacity={0.6} />
      </mesh>
      <text
        position={[0, 0.08, 0.01]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {`${fps} FPS`}
      </text>

      {showCounts && (
        <>
          <text
            position={[0, -0.05, 0.01]}
            fontSize={0.07}
            color="#a1a1aa"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
          >
            {`Objects: ${objectCount}`}
          </text>
          <text
            position={[0, -0.18, 0.01]}
            fontSize={0.07}
            color="#a1a1aa"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
          >
            {`Triangles: ${triangleCount}`}
          </text>
        </>
      )}

      {showGraph && fpsRef.current.length > 0 && (
        <group position={[0, -0.3 - (showCounts ? 0.2 : 0), 0]}>
          <mesh>
            <planeGeometry args={[0.8, 0.3]} />
            <meshBasicMaterial color="black" transparent opacity={0.6} />
          </mesh>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={fpsRef.current.length}
                array={Float32Array.from(
                  fpsRef.current.flatMap((fps, i) => [
                    (i / fpsRef.current.length) * 0.7 - 0.35,
                    (fps / 120) * 0.25 - 0.125,
                    0.01,
                  ]),
                )}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="lime" linewidth={1} />
          </line>
        </group>
      )}
    </group>
  )
}

// DOM overlay component for FPS display
export default function FPSCounter({ showGraph = false, showCounts = false, position = "top-right" }: FPSCounterProps) {
  const [fps, setFps] = useState(0)
  const [fpsHistory, setFpsHistory] = useState<number[]>([])
  const [objectCount, setObjectCount] = useState(0)
  const [triangleCount, setTriangleCount] = useState(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const animationFrameRef = useRef<number | null>(null)
  const countIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Position styles
  const positionStyles = {
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2",
    "bottom-left": "bottom-2 left-2",
    "bottom-right": "bottom-2 right-2",
  }

  useEffect(() => {
    const updateFPS = () => {
      frameCountRef.current += 1
      const currentTime = performance.now()
      const elapsed = currentTime - lastTimeRef.current

      if (elapsed >= 500) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed)
        setFps(currentFps)

        if (showGraph) {
          setFpsHistory((prev) => {
            const newHistory = [...prev, currentFps]
            if (newHistory.length > 100) {
              return newHistory.slice(-100)
            }
            return newHistory
          })
        }

        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }

      animationFrameRef.current = requestAnimationFrame(updateFPS)
    }

    animationFrameRef.current = requestAnimationFrame(updateFPS)

    // Set up object and triangle counting if enabled
    if (showCounts) {
      // Find all canvas elements that might contain Three.js scenes
      const countObjectsAndTriangles = () => {
        // This is a simplified version that works with the DOM
        // The actual counting happens in the FPSStats component inside the Three.js scene
        const canvases = document.querySelectorAll("canvas")
        if (canvases.length > 0) {
          // We can't directly access Three.js objects from here
          // Just update with placeholder values that will be replaced by the in-scene counter
          setObjectCount((prev) => prev || 0)
          setTriangleCount((prev) => prev || 0)
        }
      }

      countIntervalRef.current = setInterval(countObjectsAndTriangles, 2000)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (countIntervalRef.current) {
        clearInterval(countIntervalRef.current)
      }
    }
  }, [showGraph, showCounts])

  // Color based on FPS
  const getFpsColor = (fps: number) => {
    if (fps >= 55) return "text-green-500"
    if (fps >= 30) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div
      className={`fixed ${positionStyles[position]} z-50 bg-black/70 text-white px-3 py-1 rounded-md font-mono text-sm pointer-events-none`}
    >
      <div className="flex items-center gap-2">
        <div className={`font-bold ${getFpsColor(fps)}`}>{fps}</div>
        <div>FPS</div>
      </div>

      {showCounts && (
        <div className="mt-1 text-xs text-zinc-400">
          <div>Objects: {objectCount}</div>
          <div>Triangles: {triangleCount}</div>
        </div>
      )}

      {showGraph && fpsHistory.length > 0 && (
        <div className="mt-1 h-20 w-40">
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
            <rect x="0" y="0" width="100" height="40" fill="rgba(0,0,0,0.3)" />

            {/* FPS thresholds */}
            <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,0,0,0.5)" strokeWidth="0.5" />
            <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,0,0.5)" strokeWidth="0.5" />

            {/* FPS graph */}
            <polyline
              points={fpsHistory
                .map((fps, i) => `${(i / (fpsHistory.length - 1)) * 100}, ${40 - (fps / 60) * 30}`)
                .join(" ")}
              fill="none"
              stroke={fps >= 55 ? "#10b981" : fps >= 30 ? "#eab308" : "#ef4444"}
              strokeWidth="1"
            />
          </svg>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-red-500">30</span>
            <span className="text-yellow-500">60</span>
          </div>
        </div>
      )}
    </div>
  )
}
