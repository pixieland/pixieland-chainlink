import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useTexture, Sphere, MeshWobbleMaterial } from '@react-three/drei'
import { Attractor, CapsuleCollider, CuboidCollider, RigidBody, useRapier, Physics, InstancedRigidBodies, BallCollider } from "@react-three/rapier"

export const levels = [
    "/img/bkg/download (28).jpg",
    "/img/bkg/download (29).jpg",
    "/img/bkg/download (30).jpg",
    "/img/bkg/download (31).jpg",
    "/img/bkg/download (32).jpg",
    "/img/bkg/download (33).jpg",
    "/img/bkg/download (34).jpg",
    "/img/bkg/download (35).jpg",
    "/img/bkg/download (36).jpg",
    "/img/bkg/download (37).jpg",
    "/img/bkg/download (38).jpg",
    "/img/bkg/download (39).jpg",
    "/img/bkg/download (40).jpg",
    "/img/bkg/download (41).jpg",
    "/img/bkg/download (42).jpg",
    "/img/bkg/download (43).jpg",
    "/img/bkg/download (44).jpg",
    "/img/bkg/download (45).jpg",
    "/img/bkg/download (46).jpg",
    "/img/bkg/download (47).jpg",
    "/img/bkg/download (48).jpg",
    "/img/bkg/download (49).jpg",
    "/img/bkg/download (50).jpg",
    "/img/bkg/download (51).jpg",
    "/img/bkg/download (52).jpg",
    "/img/bkg/download (53).jpg",
    "/img/bkg/download (54).jpg",
    "/img/bkg/download (55).jpg",
    "/img/bkg/download (56).jpg",
    "/img/bkg/download (57).jpg",
    "/img/bkg/download (58).jpg",
    "/img/bkg/download (59).jpg",
    "/img/bkg/download (60).jpg",
    "/img/bkg/download (61).jpg",
    "/img/bkg/download (62).jpg",
    "/img/bkg/download (63).jpg",
    "/img/bkg/download (64).jpg",
    "/img/bkg/download (65).jpg",
    "/img/bkg/download (66).jpg",
    "/img/bkg/download (67).jpg",
    "/img/bkg/download (68).jpg",
    "/img/bkg/download (69).jpg",
    "/img/bkg/download (70).jpg",
    "/img/bkg/download (71).jpg",
    "/img/bkg/download (72).jpg",
    "/img/bkg/download (73).jpg",
    "/img/bkg/download (74).jpg",
    "/img/bkg/download (75).jpg",
    "/img/bkg/download (76).jpg",
    "/img/bkg/download (77).jpg",
    "/img/bkg/download (78).jpg",
    "/img/bkg/download (79).jpg",
    "/img/bkg/download (80).jpg",
    "/img/bkg/download (81).jpg",
    "/img/bkg/download (82).jpg",
    "/img/bkg/download (83).jpg",
    "/img/bkg/download (84).jpg",
    "/img/bkg/download (85).jpg",
    "/img/bkg/download (86).jpg",
    "/img/bkg/download (87).jpg",
    "/img/bkg/download (88).jpg",
    "/img/bkg/download (89).jpg",
    "/img/bkg/download (90).jpg",
    "/img/bkg/download (91).jpg",
    "/img/bkg/download (92).jpg",
    "/img/bkg/download (93).jpg",
    "/img/bkg/download (1).jpg",
    "/img/bkg/download (2).jpg",
    "/img/bkg/download (3).jpg",
    "/img/bkg/download (9).jpg",
    "/img/bkg/download (10).jpg",
    "/img/bkg/download (11).jpg",
    "/img/bkg/download (12).jpg",
    "/img/bkg/download (13).jpg",
    "/img/bkg/download (14).jpg",
    "/img/bkg/download (15).jpg",
    "/img/bkg/download (16).jpg",
    "/img/bkg/download (17).jpg",
    "/img/bkg/download (18).jpg",
    "/img/bkg/download (19).jpg",
    "/img/bkg/download (21).jpg",
    "/img/bkg/download (22).jpg",
    "/img/bkg/download (23).jpg",
    "/img/bkg/download (24).jpg"
]

const tube_speed = 0.05

const tube_length = 5000
const tube_half = tube_length / 2

export default function Tube({ level = 1, speed = .1 }) {
    const image = useMemo(() => levels[level - 1], [level])
    return (
        <Physics gravity={[0, -30, 0]} colliders={false}>
            <ambientLight intensity={0.75} />

            <ImageFrame image={image} position={[0, 0, -990]} scale={[.01, .01, .01]} speed={.0005} />
            <Log image={image} offset={-tube_half} speed={speed} rotation={[-190, 31, 0]} />

            {/* <Ball color="red" position={[0, 20, -800]} />
            <Ball color="red" position={[0, 20, -800]} />
            <Ball color="red" position={[0, 20, -800]} /> */}
        </Physics>
    )
}

function Ball({ color, ...props }) {
    const ref = useRef()
    useFrame(({ clock }) => {
        //ref.current.position.x = Math.sin(clock.getElapsedTime()) * 50
        //ref.current.position.y = Math.sin(clock.getElapsedTime()) * 50
        ref.current.setLinvel({
            x: 0,
            y: (Math.random() * 50) - 150,
            z: 0
        })
    })
    return (
        <RigidBody ref={ref} mass={200} type="ball" restitution={10} onContactForce={(payload) => {
            console.log(`The total force generated on the ball was: ${payload.totalForce}`);
        }}>
            <BallCollider args={[10]} />
            <mesh {...props}>
                <sphereGeometry args={[20, 32, 32]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </RigidBody>
    )
}

function Valley({ image, offset, speed = .005, ...props }) {
    const tube = useRef()

    const texture = useTexture(image, () => {
        tube.current.position.z = offset
    })

    useFrame(({ mouse, viewport }, elapsedTime) => {

        //tube.current.position.z = THREE.MathUtils.lerp(tube.current.position.z, Math.abs(offset), speed * tube_speed)
        tube.current.position.z = THREE.MathUtils.lerp(tube.current.position.z, tube.current.position.z + 1000, speed * tube_speed)

        if (tube.current.position.z > tube_half) {
            tube.current.position.z = offset
        }
    })

    return (
        <RigidBody mass={1} type="hull"
            gravityScale={0}
            restitution={2}
            onIntersectionEnter={() => console.log("Goal!")}>
            <Attractor range={10} strength={5} type="newtonian" position={[5, -5, 0]} />
            <CapsuleCollider sensor args={[2500, 200]} />
            <mesh ref={tube} {...props}>
                <cylinderGeometry args={[200, 200, 4000, 10, 10, true, 10, 10]} />
                <meshPhysicalMaterial side={THREE.BackSide} roughness={10} map={texture} />
            </mesh>
        </RigidBody>
    )
}


function Log({ image, offset, speed = .005, ...props }) {
    const tube = useRef()

    const texture = useTexture(image, () => {
        tube.current.position.z = offset
    })

    useFrame(({ mouse, viewport }, elapsedTime) => {

        //tube.current.position.z = THREE.MathUtils.lerp(tube.current.position.z, Math.abs(offset), speed * tube_speed)
        tube.current.position.z = THREE.MathUtils.lerp(tube.current.position.z, tube.current.position.z + 1000, speed * tube_speed)
        tube.current.rotation.y += 0.01

        if (tube.current.position.z > tube_half) {
            tube.current.position.z = offset
        }
    })

    return (
        <mesh ref={tube} {...props}>
            <cylinderGeometry args={[200, 200, 4000, 10, 10, true, 10, 10]} />
            <meshPhysicalMaterial side={THREE.BackSide} roughness={10} map={texture} />
        </mesh>
    )
}

function ImageFrame({ image, speed = .005, ...props }) {
    const picture_frame = useTexture("/img/picture_frame.png")
    const [size, setSize] = useState(1)
    const texture = useTexture(image)
    const frame = useRef()
    useFrame(({ mouse, viewport }, elapsedTime) => {
        if (size <= 1.5) {
            frame.current.scale.x = THREE.MathUtils.lerp(frame.current.scale.x, size, speed)
            frame.current.scale.y = THREE.MathUtils.lerp(frame.current.scale.y, size, speed)
            if (frame.current.scale.x > size - .01) {
                setSize(size + 1)
            }
        }
    })
    return (

        <mesh ref={frame} {...props}>
            <group scale={[3, 5, .1]}>
                <mesh>
                    <planeGeometry args={[2000, 1400, 5, 5]} />
                    <meshStandardMaterial map={picture_frame} transparent color="gold" />
                </mesh>
                <mesh scale={[1, .7, .1]}>
                    <planeGeometry args={[1024, 1024, 1, 1]} />
                    <meshStandardMaterial map={texture} />
                </mesh>
            </group>
        </mesh>

    )
}


// function ImageFrame({ image, ...props }) {
//     const picture_frame = useTexture("img/picture_frame.png")
//     const picture = useTexture(image)
//     const { camera } = useThree()
//     const frame = useRef()
//     useFrame(() => {
//         frame.current.lookAt(camera.position)
//     })
//     return (

//         <group ref={frame} scale={[.4,.5,.1]} {...props}>
//             <mesh position={[0, 50, -10]}>
//                 <planeGeometry args={[1024, 768, 1, 1]} />
//                 {/* <meshStandardMaterial map={picture} /> */}
//                 <MeshWobbleMaterial
//                     attach="material"
//                     factor={.03} // Strength, 0 disables the effect (default=1)
//                     speed={2} // Speed (default=1)
//                     roughness={0}
//                     map={picture}
//                 />
//             </mesh>
//             <mesh position={[0, 0, 0]}>
//                 <planeGeometry args={[2000, 1400, 5, 5]} />
//                 {/* <meshStandardMaterial color="Goldenrod" side={THREE.DoubleSide} /> */}
//                 <meshStandardMaterial map={picture_frame} transparent />
//             </mesh>
//         </group>

//     )
// }


const COUNT = 1000;

const Scene = () => {
    const instancedApi = useRef(null);

    useEffect(() => {
        console.log(instancedApi.current);
        // You can access individual instanced by their index
        instancedApi.current.at(40).applyImpulse({ x: 0, y: 10, z: 0 });

        // Or update all instances as if they were in an array
        instancedApi.current.forEach((api) => {
            api.applyImpulse({ x: 0, y: 10, z: 0 });
        });
    }, []);

    // We can set the initial positions, and rotations, and scales, of
    // the instances by providing an array equal to the instance count
    const positions = Array.from({ length: COUNT }, (_, index) => [index, 0, 0]);

    const rotations = Array.from({ length: COUNT }, (_, index) => [
        Math.random(),
        Math.random(),
        Math.random()
    ]);

    const scales = Array.from({ length: COUNT }, (_, index) => [
        Math.random(),
        Math.random(),
        Math.random()
    ]);

    return (
        <InstancedRigidBodies
            ref={instancedApi}
            positions={positions}
            rotations={rotations}
            scales={scales}
            colliders="ball"
        >
            <instancedMesh args={[undefined, undefined, COUNT]}>
                <sphereGeometry args={[0.2]} />
                <meshPhysicalMaterial color="blue" />

                <CuboidCollider args={[0.1, 0.2, 0.1]} />
            </instancedMesh>
        </InstancedRigidBodies>
    );
};