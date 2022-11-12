import * as THREE from "three";
import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useAspect, Html, Plane } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Flex, Box, useReflow } from "@react-three/flex";
import { Text } from "./Text";

const state = {
  top: 0
};

export default function Site({ title, items }) {
  const scrollArea = useRef();
  const onScroll = (e) => (state.top = e.target.scrollTop);
  const [pages, setPages] = useState(0);
  return (
    <>
      <Canvas
        gl={{ alpha: false }}
        camera={{ position: [0, 0, 2], zoom: 1 }}
      >
        <pointLight position={[0, 1, 4]} intensity={0.1} />
        <ambientLight intensity={0.3} />
        <spotLight
          position={[1, 1, 1]}
          penumbra={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Suspense fallback={<Html center>loading..</Html>}>
          <ScrollingPage title={title} items={items} onChangePages={setPages} />
          {/* <Cube /> Static object in background */}
        </Suspense>

        {/* <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={1024}
          />
        </EffectComposer> */}
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{ height: `${(pages ?? items.length) * 100}vh` }} />
      </div>
    </>
  );
}

function ScrollingPage({ title, items, onChangePages }) {
  const groupRef = useRef();
  const { size } = useThree();
  const [vpWidth, vpHeight] = useAspect(size.width, size.height);
  const vec = new THREE.Vector3();
  useFrame(() =>
    groupRef.current.position.lerp(vec.set(0, state.top / 100, 0), 0.1)
  );
  const handleReflow = useCallback(
    (w, h) => {
      onChangePages(h / vpHeight);
      // console.log({ h, vpHeight, pages: h / vpHeight });
    },
    [onChangePages, vpHeight]
  );

  return (
    <group ref={groupRef}>
      <BackGrid />
      {/* <BackGrid /> Moving plane in background */}

      <Flex
        flexDirection="column"
        size={[vpWidth, vpHeight, 0]}
        onReflow={handleReflow}
        position={[-vpWidth / 2, vpHeight / 2, 0]}
      >
        {/* <Reflower /> */}

        {chooseItem(items)}
        {/* {items.map((item, i) =>
          <Box
            flexDirection="column"
            alignItems="center"
            width="100%"
            height="100%"
            margin={0.05}>
            {chooseItem(items)}
          </Box>
        )} */}

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
          width="100%"
        >
          {new Array(8 * 4).fill(0).map((k, i) => (
            <Box margin={0.05} key={i}>
              <mesh position={[0.5, -0.5, 0]}>
                <planeBufferGeometry args={[1, 1]} />
                <meshStandardMaterial
                  color={["#2d4059", "#ea5455", "#decdc3", "#e5e5e5"][i % 4]}
                />
              </mesh>
            </Box>
          ))}
        </Box>
      </Flex>
    </group>
  );
}

function chooseItem(item, width = "100%", height = "100%", rotation = 0) {
  return (
    <Box margin={0.05} width={width} height={height}>
      <mesh position={[0.5, -0.5, 0]}>
        <planeBufferGeometry args={[1, 1]} />
      </mesh>
      {(
        typeof (item) === "string" ?
          <Text fontSize={0.5} letterSpacing={0.1} textAlign="center">
            {item}
          </Text>

          : Array.isArray(item) ?
            <Box margin={0.05} flexDirection="row" flexWrap="wrap" flexGrow={1}>
              {item.map((column, i) => chooseItem(column, 1 / (item.length / 2), 0.5, rotation))}
            </Box>

            : item
      )}
    </Box>
  )
}

function BackGrid() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0, 0.05);
  }, [scene]);

  return (
    <Plane
      position={[0, -1, -8]}
      rotation={[Math.PI / 2, 0, 0]}
      args={[80, 80, 128, 128]}
    >
      <meshStandardMaterial color="#0B37BD" wireframe side={THREE.DoubleSide} />
    </Plane>
  );
}


// function Reflower() {
//   const reflow = useReflow();
//   useFrame(reflow);
//   return null;
// }