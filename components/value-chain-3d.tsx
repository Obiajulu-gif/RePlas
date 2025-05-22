"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Text } from "@react-three/drei"
import { Suspense } from "react"
import * as THREE from "three"
import { useWebGLCleanup, useLimitedAnimation } from "@/lib/three-utils"

function ErrorFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center p-4">
        <p className="text-muted-foreground">Could not load 3D visualization</p>
        <p className="text-sm text-muted-foreground mt-2">Your browser may not support WebGL or 3D graphics</p>
      </div>
    </div>
  )
}

export default function ValueChain3D({ height = 300 }) {
  const canvasRef = useRef(null)
  const [error, setError] = useState(false)
  const [webGLSupported, setWebGLSupported] = useState(true)

  // Check for WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const isSupported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      )
      setWebGLSupported(isSupported)
    } catch (e) {
      setWebGLSupported(false)
    }
  }, [])

  // Clean up WebGL context when component unmounts
  useWebGLCleanup(canvasRef)

  if (!webGLSupported || error) {
    return <ErrorFallback />
  }

  return (
    <div style={{ height }} className="w-full">
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]} // Limit pixel ratio for better performance
        onError={() => setError(true)}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

          <ValueChainScene />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

function ValueChainScene() {
  // Define stakeholder nodes
  const stakeholders = [
    { id: "producer", name: "Producers", position: [-4, 1.5, 0], color: "#10b981" },
    { id: "collector", name: "Collectors", position: [-2, -1, 0], color: "#3b82f6" },
    { id: "recycler", name: "Recyclers", position: [0, 1.5, 0], color: "#8b5cf6" },
    { id: "manufacturer", name: "Manufacturers", position: [2, -1, 0], color: "#f59e0b" },
    { id: "consumer", name: "Consumers", position: [4, 1.5, 0], color: "#ef4444" },
  ]

  // Create connections between nodes
  const connections = [
    { from: "producer", to: "collector" },
    { from: "collector", to: "recycler" },
    { from: "recycler", to: "manufacturer" },
    { from: "manufacturer", to: "consumer" },
    { from: "consumer", to: "producer" }, // Closing the loop
  ]

  // Create a map for easy lookup
  const nodeMap = stakeholders.reduce((acc, node) => {
    acc[node.id] = node
    return acc
  }, {})

  // Animation state
  const [activeConnection, setActiveConnection] = useState(0)

  // Animate connections
  useLimitedAnimation(() => {
    setActiveConnection((prev) => (prev + 1) % connections.length)
  }, 2) // Update every 500ms

  return (
    <group>
      {/* Stakeholder nodes */}
      {stakeholders.map((node) => (
        <StakeholderNode key={node.id} {...node} />
      ))}

      {/* Connections between nodes */}
      {connections.map((connection, index) => {
        const fromNode = nodeMap[connection.from]
        const toNode = nodeMap[connection.to]

        if (!fromNode || !toNode) return null

        return (
          <Connection
            key={`${connection.from}-${connection.to}`}
            from={fromNode.position}
            to={toNode.position}
            active={index === activeConnection}
            color={fromNode.color}
          />
        )
      })}

      {/* Central platform node */}
      <mesh position={[0, 0, -1]} receiveShadow>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#064e3b" opacity={0.2} transparent />
      </mesh>

      {/* Platform text */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Plastic Platform
      </Text>
    </group>
  )
}

function StakeholderNode({ name, position, color }) {
  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>

        <Text
          position={[0, -1, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {name}
        </Text>
      </Float>
    </group>
  )
}

function Connection({ from, to, active, color }) {
  const lineRef = useRef()
  const particleRef = useRef()

  // Create a curve between points
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...from),
    new THREE.Vector3((from[0] + to[0]) / 2, (from[1] + to[1]) / 2, 2),
    new THREE.Vector3(...to),
  )

  // Create points along the curve
  const points = curve.getPoints(20)

  // Animation progress
  const [progress, setProgress] = useState(0)

  // Animate particle along the curve
  useLimitedAnimation(() => {
    if (active) {
      setProgress((prev) => {
        const newProgress = prev + 0.02
        return newProgress > 1 ? 0 : newProgress
      })
    }
  }, 30)

  // Update particle position
  useFrame(() => {
    if (particleRef.current && active) {
      const point = curve.getPointAt(progress)
      particleRef.current.position.set(point.x, point.y, point.z)
    }

    if (lineRef.current) {
      lineRef.current.material.opacity = active ? 0.8 : 0.2
    }
  })

  return (
    <group>
      {/* Line connecting nodes */}
      <line ref={lineRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
            count={points.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={color} transparent opacity={active ? 0.8 : 0.2} />
      </line>

      {/* Animated particle */}
      {active && (
        <mesh ref={particleRef} scale={0.2}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  )
}
