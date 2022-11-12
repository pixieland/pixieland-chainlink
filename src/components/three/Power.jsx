import * as THREE from 'three'
import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshWobbleMaterial, Sparkles, Trail, Float, MeshRefractionMaterial, CubeCamera, ComputedAttribute } from '@react-three/drei'
import { useEffect } from 'react'

export default function Power({ pixi: { image, color, hp }, ...props }) {
  const target = useRef()
  const [shots, setShots] = useState([])
  const [shooting, setShooting] = useState(false)

  const startShooting = useMemo(() => () => void setShooting(true), [])
  const stopShooting = useMemo(() => () => {
    setShooting(false)
    if (shots.length > 0) {
      setShots(shots.slice(1))
    }
  }, [])

  useEffect(() => {
    window.addEventListener('touchstart', startShooting)
    window.addEventListener('touchend', stopShooting)
    window.addEventListener('mousedown', startShooting)
    window.addEventListener('mouseup', stopShooting)
    return () => {
      window.removeEventListener('touchstart', startShooting)
      window.removeEventListener('touchend', stopShooting)
      window.removeEventListener('mousedown', startShooting)
      window.removeEventListener('mouseup', stopShooting)
    }
  }, [startShooting, stopShooting])

  useFrame(({ mouse, viewport }, time) => {
    target.current.position.y = Math.min(2, mouse.y) * 5
    target.current.position.x = mouse.x * 5
    target.current.rotation.z = (mouse.x * Math.PI) / 6
    if (shooting) {
      const p = Math.random() * Math.PI / 2
      setShots([...(shots.length > hp ? shots.slice(1) : shots), {
        position: [
          target.current.position.x * viewport.width / 2 * p,
          target.current.position.y * viewport.height / 2 * p,
          0
        ],
        rotation: [0, 0, target.current.rotation.z],
        intensity: 100 / hp,
        color: color
      }])
    }
    else if (shots.length > 0) {
      setShots(shots.slice(1))
    }
  });

  return (
    <group {...props}>
      <mesh ref={target} opacity={1}>
        <meshStandardMaterial color={color} />
        <ringGeometry args={[.2, .3, hp]} />
      </mesh>
      <pointLight distance={100} intensity={shots.length / hp} color={color} />
      {shots.map((shot, i) => (
        <Beam key={i} {...shot} />
      ))}
    </group>
  );
}

function Beam({ position, rotation, intensity, color }) {
  const beam = useRef()
  useFrame(() => {
    beam.current.position.z = THREE.MathUtils.lerp(beam.current.position.z, -1500, (intensity * .01))
    beam.current.material.opacity = THREE.MathUtils.lerp(beam.current.material.opacity, 0, .01)

  })
  return (
    <mesh ref={beam} position={position} rotation={rotation} scale={[.1, .1, 10]}>
      <dodecahedronGeometry args={[16.5, 0]} />
      <MeshWobbleMaterial
        attach="material"
        factor={1}
        speed={20} // Speed (default=1)
        roughness={0}
        color={color}
        transparent
      />
    </mesh>
  );
}
