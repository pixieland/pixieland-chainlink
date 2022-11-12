import * as THREE from 'three'
import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Sphere, Plane, MeshWobbleMaterial, Sparkles, Trail, Float, MeshRefractionMaterial, CubeCamera } from '@react-three/drei'
import { useEffect } from 'react'

export const pixis = [
  { image: "/img/nft/green.png", color: "green", hp: 10 },
  { image: "/img/nft/red.png", color: "red", hp: 20 },
  { image: "/img/nft/blue.png", color: "blue", hp: 10 },
  { image: "/img/nft/yellow.png", color: "yellow", hp: 20 },
  { image: "/img/nft/pink.png", color: "hotpink", hp: 50 },
  { image: "/img/nft/oracle.png", color: "orange", hp: 100 }
]

export default function Pixi({ pixi: { image, color, hp }, ...props }) {
  const pixi = useRef()
  const sails = useRef()
  const texture = useTexture(image)
  useFrame(({ mouse, viewport }, elapsedTime) => {
    pixi.current.position.x = (mouse.x * viewport.width) / 2
    pixi.current.position.y = (-viewport.height / 2) + (Math.PI * (mouse.x > viewport.width / 3 ? mouse.x : -mouse.x))
    pixi.current.position.y = (-viewport.height / 2)
    pixi.current.rotation.z = (mouse.x * Math.PI) / 2
  })

  return (
    <Float ref={pixi} speed={2} floatIntensity={1} {...props}>
      <Plane args={[5, 5]}>
        <MeshWobbleMaterial
          attach="material"
          factor={.2} // Strength, 0 disables the effect (default=1)
          speed={5} // Speed (default=1)
          roughness={0}
          map={texture}
          transparent
        />
      </Plane>
      <Sparkles count={hp * 2} scale={4} size={7} color={color} opacity={.5} />
    </Float>
  )
}
