"use client"

import { useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, Text, Float } from "@react-three/drei"
import { Suspense } from "react"
import { useWebGLCleanup, useLimitedAnimation } from "@/lib/three-utils"
import FPSCounter, { FPSStats } from "@/components/fps-counter"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"

export default function PlasticToken({ size = 300, autoRotate = true }) {
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
    <div style={{ width: size, height: size }} className="mx-auto relative">
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
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 2]} // Limit pixel ratio for better performance
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

          <TokenModel autoRotate={autoRotate} />

          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={1.5} far={1} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
          />

          {showFps && <FPSStats showGraph={showGraph} showCounts={showCounts} />}
        </Suspense>
      </Canvas>
    </div>
  )
}

function TokenModel({ autoRotate }) {
  const tokenRef = useRef(null)
  const symbolRef = useRef(null)

  // Use limited animation for better performance
  useLimitedAnimation(() => {
    if (tokenRef.current && !autoRotate) {
      tokenRef.current.rotation.y = Math.sin(Date.now() * 0.0003) * 0.2
    }

    if (symbolRef.current) {
      symbolRef.current.rotation.z += 0.01
    }
  }, 30)

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.4}>
      <group ref={tokenRef}>
        {/* Token base */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Token rim */}
        <mesh position={[0, 0, 0]} castShadow>
          <torusGeometry args={[1, 0.05, 16, 32]} />
          <meshStandardMaterial color="#059669" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Token symbol */}
        <group ref={symbolRef} position={[0, 0.11, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.4, 0.05, 16, 32]} />
            <meshStandardMaterial color="#ecfdf5" emissive="#10b981" emissiveIntensity={0.5} />
          </mesh>

          {/* Recycling arrows */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[Math.sin((i * Math.PI * 2) / 3) * 0.4, 0, Math.cos((i * Math.PI * 2) / 3) * 0.4]}
              rotation={[0, (i * Math.PI * 2) / 3, 0]}
              castShadow
            >
              <coneGeometry args={[0.15, 0.3, 8]} />
              <meshStandardMaterial color="#ecfdf5" emissive="#10b981" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>

        {/* RPL text */}
        <Text
          position={[0, -0.05, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#ecfdf5"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          RPL
        </Text>
      </group>
    </Float>
  )
}
