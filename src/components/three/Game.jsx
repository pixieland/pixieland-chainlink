import * as THREE from 'three'
import { OrbitControls, Float, MeshWobbleMaterial, useTexture, Sparkles, Plane, Bounds, Stars, Center, Text, Text3D, MeshReflectorMaterial } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Flex, Box } from '@react-three/flex';
import React, { useEffect, useRef, useMemo, useState, Suspense } from 'react';
import { useRoute, useLocation } from 'wouter'
import Pixi, { pixis } from './Pixi'
import Pixidust from './Power'
import Level, { levels } from './Level'
import ImageFrame from "./PictureFrame"

const randomIndex = (items) => Math.floor(Math.random() * items.length - 1 | 0)
const nextIndex = (items, index) => index < items.length - 1 ? index + 1 : 0

const current_level = window.location.hash ? parseInt(window.location.hash.replace('#', '')) : 0

export default function Game({ level = (current_level || randomIndex(levels)) }) {
  const [play, setPlay] = React.useState(false)
  const [pixi, setPixi] = React.useState(1)
  const player = useMemo(() => pixis[pixi], [pixi])
  if (!player) console.log('player', pixi, pixis)
  if (!levels[level]) console.log('level', level, levels)
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      gl={{ antialias: false, alpha: false }}
      mode="concurrent"
      dpr={window.devicePixelRatio}
    >
      <directionalLight intensity={1} />
      <ambientLight intensity={.7} />

      <Scoreboard level={level + 1} pixi={player} position={[0, 3.5, -2]} rotation={[0.35, 0, 0]}>
        <Sprite image={player.image} hp={player.hp} color={player.color} position={[7.9, 3.3, 0]} />
        <ImageFrame image={levels[level]} nolook scale={[.0003, .0003, 1]} position={[8.5, 3.5, -1]} rotation={[0.35, 0, 0]} />
      </Scoreboard>

      <Level level={level + 1} />

      <group>
        <Pixi pixi={player} position={[0, 2, 0]} />
        <Pixidust pixi={player} position={[0, -25, 0]} />
      </group>

      <Stars radius={500} depth={10} count={1000} factor={1} />

      {/* <OrbitControls zoomSpeed={1} /> */}

    </Canvas>
  );
}

function Sprite({ image, hp, color, ...props }) {
  const texture = useTexture(image)
  return (
    <Float speed={2} floatIntensity={1} {...props}>
      <Plane args={[1, 1]}>
        <MeshWobbleMaterial
          attach="material"
          factor={.2} // Strength, 0 disables the effect (default=1)
          speed={5} // Speed (default=1)
          roughness={0}
          map={texture}
          transparent
        />
      </Plane>
    </Float>
  )
}

const fontSize = 0.5
const lineHeight = 0.7


function Scoreboard({ level, pixi, children, ...props }) {
  const [score, setScore] = useState(0)
  useEffect(() => {
    window.setTimeout(() => {
      setScore(score + Math.round(Math.random() * 10))
    }, 1000)
  }, [score])
  return (
    <mesh {...props}>
      <Center position={[0, 3.5, -2]}>
        <Text3D
          curveSegments={32}
          bevelEnabled
          bevelSize={0.04}
          bevelThickness={0.1}
          height={1.5}
          lineHeight={0.5}
          letterSpacing={-0.06}
          size={1.5}
          font="fonts/InterBold.json">
          {"Pixieland"}
          <meshNormalMaterial />
        </Text3D>
      </Center>
      <mesh {...props}>
        <boxBufferGeometry args={[20, 3, 1]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
        <group position-y={.6}>
          <Text position={[-9, 0, 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
            {`Level:\t${level}`}
          </Text>
          <Text position={[-9, -lineHeight, 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
            {`NFT:\t${levels[level - 1].replace('img/bkg/', '').replace('.jpg', '')}`}
          </Text>
          <Text position={[-9, -(lineHeight * 2), 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
            {`Score:\t${score}`}
          </Text>
          <Text position={[5, 0, 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
            {`Pixi:\t${pixi.color}`}
          </Text>
          <Text position={[5, -lineHeight, 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
            {`Power:\t${pixi.hp}`}
          </Text>
          <Text position={[5, -(lineHeight * 2), 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
            {`NFT:\t${pixi.image.replace('img/nft/', '').replace('.png', '')}`}
          </Text>
        </group>
      </mesh>
      {children}
    </mesh>
  )
}
