
import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';

const EARTH_RADIUS = 2;

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);

  const [dayMap, nightMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
    '/textures/2k_earth_daymap.jpg',
    '/textures/2k_earth_nightmap.jpg',
    '/textures/2k_earth_specular_map.jpg',
    '/textures/2k_earth_clouds.jpg',
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    earthRef.current.rotation.y = elapsedTime * 0.05;
    cloudsRef.current.rotation.y = elapsedTime * 0.06;
  });

  return (
    <>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[EARTH_RADIUS + 0.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.3}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshPhongMaterial specularMap={specularMap} />
        <meshStandardMaterial 
            map={dayMap} 
            normalMap={nightMap} // Using night map as a pseudo-normal for city lights
            metalness={0.4} 
            roughness={0.7} 
        />
      </mesh>
    </>
  );
};

export default Earth;
