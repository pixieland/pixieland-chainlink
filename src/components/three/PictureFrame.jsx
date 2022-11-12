import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import { useTexture } from '@react-three/drei'

export default function PictureFrame({ image, nolook, speed = 0, ...props }) {
    const picture_frame = useTexture("/img/picture_frame.png")
    const [size, setSize] = useState(1)
    const { camera } = useThree()
    const texture = useTexture(image)
    const frame = useRef()
    useFrame(({ mouse, viewport }, elapsedTime) => {
        if (speed && size <= 1.5) {
            frame.current.scale.x = THREE.MathUtils.lerp(frame.current.scale.x, size, speed)
            frame.current.scale.y = THREE.MathUtils.lerp(frame.current.scale.y, size, speed)
            if (frame.current.scale.x > size - .01) {
                setSize(size + 1)
            }
        } else if (!nolook) {
            frame.current.lookAt(camera.position)
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

