"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Float } from "@react-three/drei"
import { Suspense } from "react"
import * as THREE from "three"
import { useWebGLCleanup, useLimitedAnimation } from "@/lib/three-utils"
import FPSCounter, { FPSStats } from "@/components/fps-counter"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"

export default function BlockchainVisualization() {
  const canvasRef = useRef(null)
  const [displayMode, setDisplayMode] = useState(0) // 0: none, 1: FPS, 2: FPS+Graph, 3: FPS+Graph+Counts

  // Clean up WebGL context when component unmounts
  useWebGLCleanup(canvasRef)

  const toggleDisplayMode = () => {
    setDisplayMode((prev) => (prev + 1) % 4)
  }

  const showFps = displayMode > 0
  const showGraph = displayMode > 1
  const showCounts = displayMode > 2

  return (
    <div className="w-full h-[400px] bg-card rounded-lg overflow-hidden relative">
      <Button
        variant="outline"
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={toggleDisplayMode}
        title={`Toggle Stats (${displayMode === 0 ? "Off" : displayMode === 1 ? "FPS" : displayMode === 2 ? "FPS+Graph" : "FPS+Graph+Counts"})`}
      >
        <BarChart2 className={`h-4 w-4 ${showFps ? "text-primary" : ""}`} />
      </Button>

      {showFps && <FPSCounter showGraph={showGraph} showCounts={showCounts} position="top-left" />}

      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]} // Limit pixel ratio for better performance
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

          <BlockchainModel />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={5}
            maxDistance={20}
            autoRotate
            autoRotateSpeed={0.5}
          />

          {showFps && <FPSStats showGraph={showGraph} showCounts={showCounts} />}
        </Suspense>
      </Canvas>
    </div>
  )
}

function BlockchainModel() {
  const blocksRef = useRef([])
  const linesRef = useRef([])
  const [blocks, setBlocks] = useState([])
  const [highlightIndex, setHighlightIndex] = useState(0)

  // Create blockchain blocks
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    const newBlocks = []
    const blockCount = 10

    for (let i = 0; i < blockCount; i++) {
      // Position blocks in a spiral
      const angle = i * 0.6
      const radius = 3 + i * 0.1
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = i * 0.3 - 1.5

      newBlocks.push({
        id: i,
        position: [x, y, z],
        size: [1.2, 0.8, 0.4],
        color: i === 0 ? "#10b981" : "#64748b",
        data: {
          hash: `0x${Math.random().toString(16).substr(2, 8)}`,
          transactions: Math.floor(Math.random() * 10) + 1,
          timestamp: Date.now() - i * 60000,
        },
      })
    }

    setBlocks(newBlocks)
  }, [])

  // Use limited animation for better performance
  useLimitedAnimation(() => {
    // Update highlight index
    setHighlightIndex((prev) => (prev + 1) % blocks.length)

    // Animate blocks
    blocksRef.current.forEach((block, i) => {
      if (block) {
        // Simple floating animation
        block.position.y += Math.sin(Date.now() * 0.001 + i) * 0.001
      }
    })

    // Animate connection lines
    linesRef.current.forEach((line, i) => {
      if (line) {
        if (i === highlightIndex) {
          line.material.opacity = 0.8
          line.material.color.set("#10b981")
        } else {
          line.material.opacity = 0.3
          if (line.material.color.getHexString() !== "64748b") {
            line.material.color.set("#64748b")
          }
        }
      }
    })
  }, 15)

  // Generate particle positions
  const particlePositions = useRef(
    Array(20)
      .fill(0)
      .map(() => [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8]),
  ).current

  return (
    <group>
      {/* Blocks */}
      {blocks.map((block, i) => (
        <group key={i} position={block.position}>
          <mesh ref={(el) => (blocksRef.current[i] = el)} castShadow>
            <boxGeometry args={block.size} />
            <meshStandardMaterial
              color={i === highlightIndex ? "#10b981" : block.color}
              metalness={0.5}
              roughness={0.3}
              emissive={i === highlightIndex ? "#10b981" : "#000000"}
              emissiveIntensity={i === highlightIndex ? 0.5 : 0}
            />
          </mesh>

          {/* Block label */}
          <Text
            position={[0, 0, block.size[2] / 2 + 0.01]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={1}
          >
            {`Block ${blocks.length - i}`}
          </Text>
        </group>
      ))}

      {/* Connection lines between blocks */}
      {blocks.map((block, i) => {
        if (i < blocks.length - 1) {
          const start = new THREE.Vector3(...block.position)
          const end = new THREE.Vector3(...blocks[i + 1].position)

          // Create a line geometry between blocks
          const points = []
          points.push(start)
          points.push(end)

          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

          return (
            <line key={`line-${i}`} ref={(el) => (linesRef.current[i] = el)} geometry={lineGeometry}>
              <lineBasicMaterial
                color={i === highlightIndex ? "#10b981" : "#64748b"}
                transparent
                opacity={i === highlightIndex ? 0.8 : 0.3}
              />
            </line>
          )
        }
        return null
      })}

      {/* Floating data particles - reduced count for performance */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <group>
          {particlePositions.map((position, i) => (
            <mesh key={`particle-${i}`} position={position}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  )
}
