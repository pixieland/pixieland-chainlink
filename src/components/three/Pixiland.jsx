import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { useLocation } from "wouter"
import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Bounds, Sampler, Edges, Sky, OrbitControls, Float, Plane, MeshDistortMaterial, MeshWobbleMaterial, Sparkles, Trail, PointerLockControls, KeyboardControls, useKeyboardControls, useTexture } from "@react-three/drei"
import { CapsuleCollider, CuboidCollider, RigidBody, useRapier, Physics } from "@react-three/rapier"
import Perlin from 'perlin.js'
import { levels } from "./Level"
import { pixis } from "./Pixi"
import ImageFrame from "./PictureFrame"

Perlin.seed(Math.random())

const SPEED = 18
const COUNT = 20
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const rotation = new THREE.Vector3()
const lightgreen = new THREE.Color('lightgreen')
const grassMaterial = new THREE.MeshBasicMaterial({ color: lightgreen })
const grassGeometry = new THREE.ConeGeometry(0.05, 1.0, 2, 20, false, 0, Math.PI)

const randomIndex = (items) => Math.floor(Math.random() * items.length - 1 | 0)

export default function Game() {
    const [, setLocation] = useLocation()
    const navigate = useMemo(() => (level) => setLocation(`/game#${level}`), [setLocation])
    return (
        <KeyboardControls
            map={[
                { name: "forward", keys: ["ArrowUp", "w", "W", "8"] },
                { name: "backward", keys: ["ArrowDown", "s", "S", "2"] },
                { name: "strafe_left", keys: ["a", "A"] },
                { name: "strafe_right", keys: ["d", "D"] },
                { name: "left", keys: ["ArrowLeft", "4"] },
                { name: "right", keys: ["ArrowRight", "6"] },
                { name: "jump", keys: ["Space"] },
                { name: "shoot", keys: ["t"] },
                { name: "fly", keys: ["f"] },
            ]}>
            <Canvas shadows camera={{ fov: 45 }}>
                <Sky sunPosition={[0, 0, 1]} />
                <ambientLight intensity={0.6} />
                <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
                <Physics gravity={[0, -30, 0]} colliders={false}>
                    <Ground image={"/img/log.png"} />
                    <Gallery radius={COUNT} items={levels.slice(0, COUNT)} onSelect={navigate} />
                    <Player>
                        <Pixi />
                    </Player>
                    <Crowd items={Array(100).fill(0).map(n => pixis[randomIndex(pixis)])} />
                    <Swarm items={Array(200).fill(0).map(n => pixis[randomIndex(pixis)])} />
                </Physics>
                <PointerLockControls />
                {/* <OrbitControls /> */}
            </Canvas>
        </KeyboardControls>
    )
}

export function Ground({ image, props }) {
    const texture = useTexture(image)
    const { scene } = useThree();
    useEffect(() => {
        scene.fog = new THREE.FogExp2(0, 0.001);
    }, [scene]);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    return (
        <RigidBody {...props} type="fixed" colliders={false}>
            {/* <Grass> */}
            <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial map={texture} map-repeat={[240, 240]} color="green" />
            </mesh>
            {/* </Grass> */}
            <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
        </RigidBody>
    )
}

export function Swarm({ width = 2000, height = 2000, children, count = 50, items = Array(count).fill({}), ...props }) {
    return (
        <group {...props}>
            <mesh position={[0, 25, 0]}>
                {items.map((item, i) => {
                    const factor = Math.random() - 0.5
                    const position = item.position || [
                        factor * width,
                        1,
                        factor * width / 3
                    ]
                    //const factor = Perlin.perlin3(position[0], position[1], position[2])
                    return <Fly key={i} position={position} rotation={[0, position[0] > 0 ? Math.PI : 0, 0]} factor={factor}>
                        <Pixi {...item} />
                    </Fly>
                })}
            </mesh>
        </group>
    )
}

export function Fly({ factor = .5, children, ...props }) {
    const group = useRef()
    const mesh = useRef()
    const [start] = useState(() => Math.random() * 5000)
    const [, key] = useKeyboardControls()
    useFrame((state, delta) => {
        const { shoot } = key
        const t = Math.sin(start + state.clock.elapsedTime)
        group.current.rotation.y += Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
        mesh.current.rotation.x = Math.PI / 2 + (t * Math.PI) / 10
        mesh.current.rotation.y = (t * Math.PI) / 2
        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, t * 50, factor)
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, t * 50, factor)
        mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, t * 10, factor)
    })
    return (
        <group ref={group} {...props}>
            <scene name="Scene">
                <group ref={mesh}>
                    {children}
                </group>
            </scene>
        </group>
    )
}

export function Crowd({ width = 500, height = 500, children, count = 50, items = Array(count).fill({}), ...props }) {
    return (
        <group {...props}>
            <mesh position={[0, 0, 0]}>
                {items.map((item, i) => {
                    const position = item.position || [
                        (Math.random() - 0.5) * width,
                        1,
                        (Math.random() - 0.5) * height
                    ]
                    const to = [
                        (Math.random() - 0.5) * width,
                        1,
                        (Math.random() - 0.5) * height
                    ]
                    //factor = Perlin.perlin3(position[0], position[1], position[2])
                    return <Walk key={i} position={position} rotation={[0, position[0] > 0 ? Math.PI : 0, 0]} to={to} factor={.05}>
                        <Pixi {...item} />
                    </Walk>
                })}
            </mesh>
        </group>
    )
}

export function Walk({ to = [
    (Math.random() - 0.5) * 1024,
    1,
    (Math.random() - 0.5) * 768
], factor = .01, children, ...props }) {
    const group = useRef()
    const mesh = useRef()
    const [start] = useState(() => Math.random() * 5000)
    useFrame((state, delta) => {
        const t = Math.sin(start + state.clock.elapsedTime)
        mesh.current.rotation.y = (t * Math.PI) / 2
        //const p = Perlin.perlin3(mesh.current.position.x, mesh.current.position.y, mesh.current.position.z)
        rotation.set(to[0], to[1], to[2])
        if (rotation.distanceTo(mesh.current.position) > 1) {
            mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, to[0], factor)
            mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, to[2], factor)
        } else {
            mesh.current.position.x = THREE.MathUtils.lerp(to[0], mesh.current.position.x, factor)
            mesh.current.position.z = THREE.MathUtils.lerp(to[2], mesh.current.position.z, factor)
        }
    })
    return (
        <group ref={mesh} {...props} position-y={2}>
            {children}
        </group>
    )
}

const getNewPointOnVector = (p1, p2) => {
    let distAway = 200;
    let vector = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    let vl = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2));
    let vectorLength = { x: vector.x / vl, y: vector.y / vl, z: vector.z / vl };
    let v = { x: distAway * vectorLength.x, y: distAway * vectorLength.y, z: distAway * vectorLength.z };
    return { x: p2.x + v.x, y: p2.y + v.y, z: p2.z + v.z };
}

export function Follow({ factor = .01, children, ...props }) {
    const group = useRef()
    const mesh = useRef()
    const [start] = useState(() => Math.random() * 5000)
    const { camera } = useThree()
    useFrame(() => {
        group.current.lookAt(camera.position)
        const position = getNewPointOnVector(camera.position, group.current.position)
        group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position.x, factor)
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, position.y, factor)
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, position.z, factor)
    })
    return (
        <group ref={group} position-y={2} {...props}>
            <RigidBody ref={mesh} colliders={false} mass={1} type="dynamic" position={[0, 10, 0]} enabledRotations={[false, false, false]}>
                <CapsuleCollider args={[0.75, 0.5]} />
            </RigidBody>
            {children}
        </group>
    )
}

export function Pixi({ image = "/img/nft/red.png", power = 100, factor = .1, color = "hotpink", double, ...props }) {
    const texture = useTexture(image)
    return (
        <mesh {...props}>
            <Float speed={2} floatIntensity={factor}>
                <Plane args={[5, 5]}>
                    <MeshWobbleMaterial
                        attach="material"
                        factor={factor} // Strength, 0 disables the effect (default=1)
                        speed={SPEED} // Speed (default=1)
                        roughness={0}
                        map={texture}
                        transparent
                        side={THREE.DoubleSide}
                    />
                </Plane>
                {double &&
                    <Plane args={[5, 5]} rotation-y={.5}>
                        <MeshWobbleMaterial
                            attach="material"
                            factor={factor} // Strength, 0 disables the effect (default=1)
                            speed={SPEED} // Speed (default=1)
                            roughness={0}
                            map={texture}
                            transparent
                            side={THREE.DoubleSide}
                        />
                    </Plane>
                }
            </Float>
            <Sparkles count={power} scale={[5, 5, .2]} size={7} color={color} opacity={.5} />
        </mesh>
    )
}

export function Player({ children }) {
    const person = useRef()
    const ref = useRef()
    const [isFlying, flying] = useState(false)
    const rapier = useRapier()
    const { camera } = useThree()
    const [, get] = useKeyboardControls()
    useFrame((state) => {
        const { forward, backward, strafe_left, strafe_right, left, right, jump, fly } = get()
        const velocity = ref.current.linvel()
        const direction = camera.getWorldDirection(rotation)
        // update camera
        camera.position.set(...ref.current.translation())
        // movement
        frontVector.set(0, 0, backward - forward)
        if (Math.abs(left - right)) {
            if (!camera.current.rotation) {
                camera.current.rotation = new THREE.Euler()
            }
            camera.current.rotation.y = THREE.MathUtils.lerp(camera.current.rotation.y, (left - right) * 0.1, 0.1)
        }
        sideVector.set(strafe_left - strafe_right, 0, 0)
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(isFlying ? SPEED * 2 : SPEED).applyEuler(camera.rotation)
        ref.current.setLinvel({
            x: isFlying ? THREE.MathUtils.lerp(direction.x, velocity.x, 0.1) : direction.x,
            y: isFlying ? (Math.random() * 5) - 5 : velocity.y,
            z: isFlying ? THREE.MathUtils.lerp(direction.z, velocity.z, 0.1) : direction.z
        })
        // jumping/flying
        const world = rapier.world.raw()
        const ray = world.castRay(new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 }))
        const grounded = ray && ray.collider && Math.abs(ray.toi) <= 13.75
        if (fly) flying(!isFlying)
        if (jump && grounded) ref.current.setLinvel({ x: 0, y: 7.5, z: 0 })
        else if (jump && isFlying) ref.current.setLinvel({ x: 0, y: Math.min(15, velocity.y + 2.5), z: 0 })
        if (isFlying && grounded && direction.y < 1) flying(false)
        //if(isFlying){
        //    person.current.position.z = 1
        //    person.current.position.x = THREE.MathUtils.lerp(person.current.position.x, ref.current.translation().x, 0.1)
        //    person.current.position.y = THREE.MathUtils.lerp(person.current.position.y, ref.current.translation().y, 0.1)
        //} else {
        //    person.current.position.z = -3
        //}
    })
    return (
        <>
            <RigidBody ref={ref} colliders={false} mass={1} type="dynamic" position={[0, 10, 0]} enabledRotations={[false, false, false]}>
                <CapsuleCollider args={[0.75, 0.5]} />
                {/* <mesh ref={person} position={[-1.5, 0, -10]} scale={[.6, .6, .1]} rotation-x={Math.PI / 4}>
                    {children}
                </mesh> */}
            </RigidBody>
        </>
    )
}

export function Gallery({ items = Array(10).fill("/img/forest.png"), onSelect, radius = items.length, ...props }) {
    const frames = useMemo(() => {
        const curve = new THREE.EllipseCurve(0, 0, radius, radius)
        const points = curve.getPoints(items.length - 1)
        return points.map(({ x, y }, index) => ({
            position: [x, 3.5, y],
            rotation: [0, Math.PI / 2.5, 0],
            url: items[index]
        }))
    }, [items])
    return (
        <group {...props}>
            {frames.map((frame, i) => (
                <mesh key={i} position={frame.position} rotation={frame.rotation} scale={[.005, .005, .005]}>
                    <ImageFrame
                        image={frame.url}
                        scale={[.2, .2, .1]}
                        onClick={onSelect.bind(null, i)} />
                </mesh>
            ))}
        </group>
    )
}

const transform = ({ position, normal, sampledMesh: mesh, dummy: object }) => {
    object.scale.setScalar(Math.random() * 0.0075)
    const worldPosition = mesh.localToWorld(position)
    object.position.copy(worldPosition)
    object.lookAt(normal.clone().add(position))
    object.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5)
    object.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
    object.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
    object.updateMatrix()
    return object
}

export function Grass({ strands = 10, children, ...props }) {
    //const geomRef = useRef()
    const meshRef = useRef(null)
    const windLayer = useRef(null)
    const items = useMemo(() => new Array(strands).fill(0).map(d => ({
        offset: new THREE.Vector3(Math.random() - .5, -1, Math.random() - .5),
        scale: 1
    })), [strands])
    const [particles] = useState(items)
    const dummy = useMemo(() => new THREE.Object3D())

    useEffect(() => {
        //meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))

        particles.forEach((particle, i) => {
            const { offset, scale } = particle
            dummy.position.copy(offset.multiplyScalar(scale))
            //dummy.scale.set(scale, scale, scale)
            //dummy.rotation.set(Math.sin(Math.random()) * Math.PI, Math.sin(Math.random()) * Math.PI, Math.cos(Math.random()) * Math.PI)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [particles])

    //useFrame(() => (windLayer.current.time += 0.005))

    return (
        <group {...props}>
            <Sampler
                transform={(props) => {
                    const object = transform(props)
                    const n = Perlin.simplex3(...props.position.clone().multiplyScalar(5).toArray())
                    object.scale.setScalar(THREE.MathUtils.mapLinear(n, -1, 1, .3, 1) * 0.1)
                    return object
                }}
                instances={meshRef}>
                {children}
            </Sampler>
            <instancedMesh ref={meshRef} args={[grassGeometry, grassMaterial, strands]} />
            {/* <coneGeometry args={[0.05, 1.0, 2, 20, false, 0, Math.PI]} /> */}
            {/* <LayerMaterial side={THREE.DoubleSide} lighting="standard" envMapIntensity={1}>
                    <Depth colorA="#221600" colorB="#ade266" near={0.14} far={1.52} mapping="world" />
                    {<windLayer
                        args={[{ mode: 'multiply' }]}
                        colorA="#ffffff"
                        colorB="#acf5ce"
                        noiseScale={10}
                        noiseStrength={5}
                        length={1.2}
                        sway={0.5}
                        ref={windLayer}
                    />}
                </LayerMaterial> */}
        </group>
    )
}