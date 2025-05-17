"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Float } from "@react-three/drei"
import { Suspense } from "react"
import * as THREE from "three"
import { useWebGLCleanup, useLimitedAnimation } from "@/lib/three-utils"

export default function RecyclingProcess3D() {
  const canvasRef = useRef(null)

  // Clean up WebGL context when component unmounts
  useWebGLCleanup(canvasRef)

  return (
    <Canvas
      ref={canvasRef}
      shadows
      camera={{ position: [0, 2, 10], fov: 45 }}
      dpr={[1, 2]} // Limit pixel ratio for better performance
    >
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

        <RecyclingScene />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  )
}

function RecyclingScene() {
  const [currentStage, setCurrentStage] = useState(0)
  const stages = ["Collection", "Sorting", "Processing", "Manufacturing"]

  // Animate through stages
  useLimitedAnimation(() => {
    setCurrentStage((prev) => (prev + 1) % stages.length)
  }, 0.5) // Change stage every 2 seconds

  return (
    <group position={[0, -2, 0]}>
      {/* Base platform */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      {/* Recycling stages */}
      <group position={[-6, 0.1, 0]}>
        <RecyclingStage position={[0, 0, 0]} title="Collection" color="#10b981" active={currentStage === 0} index={1} />
      </group>

      <group position={[-2, 0.1, 0]}>
        <RecyclingStage position={[0, 0, 0]} title="Sorting" color="#3b82f6" active={currentStage === 1} index={2} />
      </group>

      <group position={[2, 0.1, 0]}>
        <RecyclingStage position={[0, 0, 0]} title="Processing" color="#8b5cf6" active={currentStage === 2} index={3} />
      </group>

      <group position={[6, 0.1, 0]}>
        <RecyclingStage
          position={[0, 0, 0]}
          title="Manufacturing"
          color="#f59e0b"
          active={currentStage === 3}
          index={4}
        />
      </group>

      {/* Flow arrows */}
      <Arrow start={[-4.5, 0.5, 0]} end={[-3.5, 0.5, 0]} color="#10b981" />
      <Arrow start={[-0.5, 0.5, 0]} end={[0.5, 0.5, 0]} color="#3b82f6" />
      <Arrow start={[3.5, 0.5, 0]} end={[4.5, 0.5, 0]} color="#8b5cf6" />

      {/* Title */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.8}
        color="#111827"
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        RECYCLING PROCESS
      </Text>
    </group>
  )
}

function RecyclingStage({ position, title, color, active, index }) {
  const groupRef = useRef()
  const particlesRef = useRef([])
  const numParticles = 10

  // Initialize particles
  if (particlesRef.current.length === 0) {
    for (let i = 0; i < numParticles; i++) {
      particlesRef.current.push({
        position: [Math.random() * 2 - 1, Math.random() * 2 + 0.5, Math.random() * 2 - 1],
        scale: Math.random() * 0.2 + 0.1,
        speed: Math.random() * 0.02 + 0.01,
      })
    }
  }

  // Animate the stage
  useFrame(() => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.05

      // Scale up when active
      groupRef.current.scale.setScalar(active ? 1.1 : 1)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color={color} opacity={0.9} transparent />
      </mesh>

      {/* Stage number */}
      <Text
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.8}
        color="white"
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        {index}
      </Text>

      {/* Stage title */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.4}
        color="#111827"
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      {/* Particles (representing plastic items) */}
      {active &&
        particlesRef.current.map((particle, i) => (
          <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh position={particle.position} scale={particle.scale} castShadow>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.8} />
            </mesh>
          </Float>
        ))}

      {/* Machine representation */}
      <group position={[0, 0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 1, 1.5]} />
          <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Machine details */}
        <mesh position={[0, 0, 0.76]} castShadow>
          <boxGeometry args={[1, 0.3, 0.1]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        {/* Indicator light */}
        <mesh position={[0.5, 0.4, 0.76]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={active ? "#10b981" : "#6b7280"}
            emissive={active ? "#10b981" : "#6b7280"}
            emissiveIntensity={active ? 0.5 : 0.1}
          />
        </mesh>
      </group>
    </group>
  )
}

function Arrow({ start, end, color }) {
  const direction = new THREE.Vector3().subVectors(new THREE.Vector3(...end), new THREE.Vector3(...start))
  const length = direction.length()
  direction.normalize()

  const position = new THREE.Vector3(...start).add(new THREE.Vector3(...direction.toArray()).multiplyScalar(length / 2))

  const { camera } = useThree()
  const arrowRef = useRef()

  useFrame(() => {
    if (arrowRef.current) {
      // Make arrow always face the camera (billboard effect)
      arrowRef.current.lookAt(camera.position)
    }
  })

  return (
    <group position={position.toArray()} ref={arrowRef}>
      <mesh>
        <planeGeometry args={[length, 0.2]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[length / 2 - 0.1, 0, 0]}>
        <coneGeometry args={[0.2, 0.4, 32]} rotation={[0, 0, -Math.PI / 2]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}
