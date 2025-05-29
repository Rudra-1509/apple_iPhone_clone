import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import gsap from "gsap";

const Loader = () => {
  const torusRef = useRef();
  const scaleRef = useRef();

  // Rotate the torus
  useFrame(() => {
    if (torusRef.current) {
      torusRef.current.rotation.y += 0.03;
      torusRef.current.rotation.x += 0.01;
    }
  });

  // GSAP pulse animation
  useEffect(() => {
    if (scaleRef.current) {
      gsap.to(scaleRef.current.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 0.6,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <group scale={0.5} position={[0, 0, 0]}>
      <mesh ref={torusRef}>
        <torusGeometry args={[1, 0.25, 16, 60]} />
        <meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={0.4} />
      </mesh>

      <mesh ref={scaleRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <Text
        position={[0, -1.5, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Loading...
      </Text>
    </group>
  );
};

export default Loader;
