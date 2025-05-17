"use client"

import { useRef, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, Float, Text } from "@react-three/drei"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCcw, BarChart2 } from "lucide-react"
import * as THREE from "three"
import { useWebGLCleanup, useLimitedAnimation } from "@/lib/three-utils"
import FPSCounter, { FPSStats } from "@/components/fps-counter"

// Main 3D visualization component
export default function RecyclingProcessVisualization() {
  const [currentStage, setCurrentStage] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [displayMode, setDisplayMode] = useState(0) // 0: none, 1: FPS, 2: FPS+Graph, 3: FPS+Graph+Counts
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Clean up WebGL context when component unmounts
  useWebGLCleanup(canvasRef)

  const stages = [
    { name: "Collection", description: "Plastic waste is collected and sorted by type" },
    { name: "Processing", description: "Plastic is cleaned, shredded, and prepared for recycling" },
    { name: "Transformation", description: "Processed plastic is melted and transformed into new raw material" },
    { name: "Manufacturing", description: "Recycled plastic is used to create new sustainable products" },
    { name: "Verification", description: "Blockchain records each step for complete traceability" },
  ]

  const nextStage = () => {
    setCurrentStage((prev) => (prev + 1) % stages.length)
  }

  const prevStage = () => {
    setCurrentStage((prev) => (prev - 1 + stages.length) % stages.length)
  }

  const toggleDisplayMode = () => {
    setDisplayMode((prev) => (prev + 1) % 4)
  }

  const showFps = displayMode > 0
  const showGraph = displayMode > 1
  const showCounts = displayMode > 2

  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-md">
        <h3 className="font-bold text-lg">{stages[currentStage].name}</h3>
        <p className="text-sm text-muted-foreground">{stages[currentStage].description}</p>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={prevStage}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1">
          {stages.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${index === currentStage ? "bg-primary" : "bg-muted"}`}
              onClick={() => setCurrentStage(index)}
            />
          ))}
        </div>
        <Button variant="outline" size="icon" onClick={nextStage}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDisplayMode}
          title={`Toggle Stats (${displayMode === 0 ? "Off" : displayMode === 1 ? "FPS" : displayMode === 2 ? "FPS+Graph" : "FPS+Graph+Counts"})`}
        >
          <BarChart2 className={`h-4 w-4 ${showFps ? "text-primary" : ""}`} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setAutoRotate(!autoRotate)} title="Toggle Auto-Rotate">
          <RotateCcw className={`h-4 w-4 ${autoRotate ? "animate-spin-slow" : ""}`} />
        </Button>
      </div>

      {showFps && <FPSCounter showGraph={showGraph} showCounts={showCounts} position="top-left" />}

      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 2, 5], fov: 50 }}
        dpr={[1, 2]} // Limit pixel ratio for better performance
      >
        <Suspense fallback={<LoadingFallback />}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

          <RecyclingScene stage={currentStage} autoRotate={autoRotate} />

          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={1.5} far={1} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
          />

          {showFps && <FPSStats showGraph={showGraph} showCounts={showCounts} />}
        </Suspense>
      </Canvas>
    </div>
  )
}

// The rest of the component remains the same...
// Loading fallback component
function LoadingFallback() {
  return (
    <Text color="white" anchorX="center" anchorY="middle" fontSize={0.5} position={[0, 0, 0]}>
      Loading 3D visualization...
    </Text>
  )
}

// Main scene component
function RecyclingScene({ stage, autoRotate }) {
  const groupRef = useRef(null)

  return (
    <group ref={groupRef}>
      {stage === 0 && <CollectionStage />}
      {stage === 1 && <ProcessingStage />}
      {stage === 2 && <TransformationStage />}
      {stage === 3 && <ManufacturingStage />}
      {stage === 4 && <VerificationStage />}
    </group>
  )
}

// Individual stage components
function CollectionStage() {
  // Create geometries and materials directly
  const boxGeometry = new THREE.BoxGeometry(1, 0.2, 1.5)
  const platformGeometry = new THREE.BoxGeometry(1.2, 0.1, 1.7)
  const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16)

  const baseMaterial = new THREE.MeshStandardMaterial({ color: "#2dd4bf" })
  const platformMaterial = new THREE.MeshStandardMaterial({ color: "#059669" })

  // Pre-create bottle materials
  const bottleMaterials = [
    new THREE.MeshStandardMaterial({ color: "#a5f3fc", transparent: true, opacity: 0.8 }),
    new THREE.MeshStandardMaterial({ color: "#bfdbfe", transparent: true, opacity: 0.8 }),
    new THREE.MeshStandardMaterial({ color: "#c4b5fd", transparent: true, opacity: 0.8 }),
  ]

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]} castShadow>
          <primitive object={boxGeometry} attach="geometry" />
          <primitive object={baseMaterial} attach="material" />
        </mesh>

        {/* Plastic bottles - limit to 5 for performance */}
        {[...Array(5)].map((_, i) => (
          <mesh
            key={i}
            position={[(i % 3) * 0.3 - 0.3, 0.3 + (i % 2) * 0.1, (i % 2) * 0.3 - 0.3]}
            rotation={[Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5]}
            castShadow
          >
            <primitive object={cylinderGeometry} attach="geometry" />
            <primitive object={bottleMaterials[i % 3]} attach="material" />
          </mesh>
        ))}

        {/* Collection bin */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <primitive object={platformGeometry} attach="geometry" />
          <primitive object={platformMaterial} attach="material" />
        </mesh>
      </Float>

      <StageLabel position={[0, 1.2, 0]} text="Collection" />
    </group>
  )
}

function ProcessingStage() {
  const gearRef = useRef(null)

  // Use limited animation for better performance
  useLimitedAnimation(() => {
    if (gearRef.current) {
      gearRef.current.rotation.z += 0.01
    }
  }, 30)

  return (
    <group>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
        {/* Conveyor belt */}
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.1, 0.8]} />
          <meshStandardMaterial color="#737373" />
        </mesh>

        {/* Plastic flakes - reduced count for performance */}
        {[...Array(12)].map((_, i) => (
          <mesh key={i} position={[(i % 4) * 0.4 - 0.8, 0 + (i % 3) * 0.05, (i % 3) * 0.2 - 0.2]} castShadow>
            <boxGeometry args={[0.1, 0.02, 0.1]} />
            <meshStandardMaterial color={["#a5f3fc", "#bfdbfe", "#c4b5fd", "#fecaca"][i % 4]} />
          </mesh>
        ))}

        {/* Processing machine */}
        <mesh position={[0.8, 0.3, 0]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#374151" />
        </mesh>

        {/* Gear */}
        <mesh ref={gearRef} position={[0.8, 0.3, 0.4]} castShadow>
          <torusGeometry args={[0.2, 0.05, 16, 8]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      <StageLabel position={[0, 1.2, 0]} text="Processing" />
    </group>
  )
}

function TransformationStage() {
  const particlesRef = useRef(null)

  // Use limited animation for better performance
  useLimitedAnimation(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.01
    }
  }, 30)

  return (
    <group>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
        {/* Melting pot */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.5, 0.6, 24]} />
          <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Molten plastic */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.2, 24]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>

        {/* Particles/steam - reduced count for performance */}
        <group ref={particlesRef} position={[0, 0.3, 0]}>
          {[...Array(8)].map((_, i) => (
            <mesh key={i} position={[Math.sin(i * 0.5) * 0.3, i * 0.05, Math.cos(i * 0.5) * 0.3]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#e5e7eb" transparent opacity={0.7 - i * 0.08} />
            </mesh>
          ))}
        </group>
      </Float>

      <StageLabel position={[0, 1.2, 0]} text="Transformation" />
    </group>
  )
}

function ManufacturingStage() {
  return (
    <group>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
        {/* Manufacturing platform */}
        <mesh position={[0, -0.3, 0]} receiveShadow>
          <boxGeometry args={[2, 0.1, 1]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>

        {/* New products */}
        <mesh position={[-0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#34d399" />
        </mesh>

        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.25, 24, 16]} />
          <meshStandardMaterial color="#60a5fa" />
        </mesh>

        <mesh position={[0.6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
          <meshStandardMaterial color="#a78bfa" />
        </mesh>
      </Float>

      <StageLabel position={[0, 1.2, 0]} text="Manufacturing" />
    </group>
  )
}

function VerificationStage() {
  const cubesRef = useRef([])

  // Use limited animation for better performance
  useLimitedAnimation((delta) => {
    cubesRef.current.forEach((cube, i) => {
      if (cube) {
        cube.position.y = Math.sin(Date.now() * 0.001 + i) * 0.1 + 0.2
        cube.rotation.y += 0.01
      }
    })
  }, 30)

  return (
    <group>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
        {/* Blockchain visualization */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} ref={(el) => (cubesRef.current[i] = el)} position={[i * 0.5 - 1, 0.2, 0]} castShadow>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#10b981" wireframe={true} emissive="#10b981" emissiveIntensity={0.5} />
          </mesh>
        ))}

        {/* Connection lines */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[i * 0.5 - 0.75, 0.2, 0]}>
            <boxGeometry args={[0.2, 0.02, 0.02]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        ))}

        {/* Base platform */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.1, 1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </Float>

      <StageLabel position={[0, 1.2, 0]} text="Blockchain Verification" />
    </group>
  )
}

function StageLabel({ position, text }) {
  const { camera } = useThree()
  const textRef = useRef(null)

  // Use limited animation for better performance
  useLimitedAnimation(() => {
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion)
    }
  }, 30)

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.3}
      color="#10b981"
      anchorX="center"
      anchorY="middle"
      font="/fonts/Inter-Bold.woff"
    >
      {text}
    </Text>
  )
}
