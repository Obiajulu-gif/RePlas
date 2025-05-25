"use client"

import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense } from "react"
import { useWebGLCleanup, useLimitedAnimation } from "@/lib/three-utils"

export default function EconomicEngine3D({ height = 300 }) {
  const canvasRef = useRef(null)

  // Clean up WebGL context when component unmounts
  useWebGLCleanup(canvasRef)

  return (
    <div style={{ height }} className="w-full">
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]} // Limit pixel ratio for better performance
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

          <EngineScene />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

function EngineScene() {
  // References for animated parts
  const outerRingRef = useRef()
  const middleRingRef = useRef()
  const innerRingRef = useRef()
  const gearsRef = useRef([])
  const tokensRef = useRef([])

  // Animate the engine parts
  useLimitedAnimation(() => {
    // Rotate rings at different speeds
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += 0.005
    }

    if (middleRingRef.current) {
      middleRingRef.current.rotation.z -= 0.01
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += 0.015
    }

    // Rotate gears
    gearsRef.current.forEach((gear, i) => {
      if (gear) {
        gear.rotation.z -= 0.02 * (i % 2 === 0 ? 1 : -1)
      }
    })

    // Move tokens
    tokensRef.current.forEach((token, i) => {
      if (token) {
        // Orbit around the center
        const angle = Date.now() * 0.001 * (0.5 + i * 0.1)
        const radius = 2 + i * 0.5
        token.position.x = Math.cos(angle) * radius
        token.position.y = Math.sin(angle) * radius
      }
    })
  }, 30)

  return (
    <group>
      {/* Base platform */}
      <mesh receiveShadow position={[0, 0, -1]}>
        <cylinderGeometry args={[5, 5, 0.2, 32]} />
        <meshStandardMaterial color="#064e3b" />
      </mesh>

      {/* Outer ring */}
      <group ref={outerRingRef}>
        <mesh castShadow>
          <torusGeometry args={[4, 0.2, 16, 100]} />
          <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Gears on outer ring */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={`outer-gear-${i}`}
            ref={(el) => (gearsRef.current[i] = el)}
            position={[Math.cos((i * Math.PI) / 3) * 4, Math.sin((i * Math.PI) / 3) * 4, 0.2]}
            castShadow
          >
            <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
            <meshStandardMaterial color="#0d9488" metalness={0.7} roughness={0.2} />

            {/* Gear teeth */}
            {[...Array(8)].map((_, j) => (
              <mesh
                key={`gear-tooth-${i}-${j}`}
                position={[Math.cos((j * Math.PI) / 4) * 0.7, Math.sin((j * Math.PI) / 4) * 0.7, 0]}
                castShadow
              >
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshStandardMaterial color="#0d9488" metalness={0.7} roughness={0.2} />
              </mesh>
            ))}
          </mesh>
        ))}
      </group>

      {/* Middle ring */}
      <group ref={middleRingRef}>
        <mesh castShadow>
          <torusGeometry args={[3, 0.15, 16, 80]} />
          <meshStandardMaterial color="#059669" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Inner ring */}
      <group ref={innerRingRef}>
        <mesh castShadow>
          <torusGeometry args={[2, 0.1, 16, 60]} />
          <meshStandardMaterial color="#047857" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Central core */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh castShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Floating tokens */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Float key={`token-${i}`} speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh ref={(el) => (tokensRef.current[i] = el)} position={[2 + i * 0.5, 0, 0.5]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
            <meshStandardMaterial
              color="#34d399"
              metalness={0.7}
              roughness={0.2}
              emissive="#34d399"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
