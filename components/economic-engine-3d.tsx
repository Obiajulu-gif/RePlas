"use client"

import { useRef } from "react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense } from "react"
import { useWebGLCleanup, useLimitedAnimation } from "@/lib/three-utils"

export default function EconomicEngine3D({ height = 300 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
          <Environment preset="studio" />
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#10b981" />

          <EngineScene />

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

function EngineScene() {
  // References for animated parts
  const outerRingRef = useRef<THREE.Group>(null)
  const middleRingRef = useRef<THREE.Group>(null)
  const innerRingRef = useRef<THREE.Group>(null)
  const gearsRef = useRef<(THREE.Mesh | null)[]>([])
  const tokensRef = useRef<(THREE.Mesh | null)[]>([])

  // Animate the engine parts
  useLimitedAnimation(() => {
    const time = Date.now() * 0.0005
    // Rotate rings at different speeds
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = time * 0.5
    }

    if (middleRingRef.current) {
      middleRingRef.current.rotation.z = -time
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = time * 1.5
    }

    // Rotate gears
    gearsRef.current.forEach((gear, i) => {
      if (gear) {
        gear.rotation.z = -time * 2 * (i % 2 === 0 ? 1 : -1)
      }
    })

    // Move tokens
    tokensRef.current.forEach((token, i) => {
      if (token) {
        // Orbit around the center
        const angle = time * (1 + i * 0.2)
        const radius = 2.5 + Math.sin(time + i) * 0.2
        token.position.x = Math.cos(angle) * radius
        token.position.y = Math.sin(angle) * radius
      }
    })
  }, 60)

  return (
    <group>
      {/* Base platform */}
      <mesh receiveShadow position={[0, 0, -1]}>
        <cylinderGeometry args={[5, 5, 0.2, 64]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Outer ring */}
      <group ref={outerRingRef}>
        <mesh castShadow>
          <torusGeometry args={[4, 0.1, 16, 100]} />
          <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Gears on outer ring */}
        {[...Array(6)].map((_, i) => (
          <mesh
            key={`outer-gear-${i}`}
            ref={(el) => (gearsRef.current[i] = el)}
            position={[Math.cos((i * Math.PI) / 3) * 4, Math.sin((i * Math.PI) / 3) * 4, 0.2]}
            castShadow
          >
            <cylinderGeometry args={[0.4, 0.4, 0.15, 12]} />
            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Middle ring */}
      <group ref={middleRingRef}>
        <mesh castShadow>
          <torusGeometry args={[3, 0.08, 16, 100]} />
          <meshStandardMaterial color="#bbbbbb" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Inner ring */}
      <group ref={innerRingRef}>
        <mesh castShadow>
          <torusGeometry args={[2, 0.06, 16, 100]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Central core */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh castShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1}
            metalness={0.8}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Floating tokens */}
      {[...Array(5)].map((i) => (
        <Float key={`token-${i}`} speed={2.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh ref={(el) => (tokensRef.current[i] = el)} position={[2.5, 0, 0.5]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
            <meshStandardMaterial
              color="#34d399"
              metalness={0.9}
              roughness={0.2}
              emissive="#34d399"
              emissiveIntensity={0.8}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
