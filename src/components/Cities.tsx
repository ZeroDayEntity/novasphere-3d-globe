
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import citiesData from '../data/cities.json';

const EARTH_RADIUS = 2;

// Function to convert lat/lon to a 3D vector
const getVectorFromLatLng = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const CityPoint = ({ position }: { position: THREE.Vector3 }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
  
    useFrame(({ clock }) => {
      // Pulsating effect
      const scale = Math.sin(clock.getElapsedTime() * 2 + position.x) * 0.3 + 0.7;
      if (meshRef.current) {
        meshRef.current.scale.set(scale, scale, scale);
      }
    });
  
    return (
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial color="#ffff00" toneMapped={false} />
      </mesh>
    );
  };
  

const Cities = () => {
  const cityPositions = useMemo(() => {
    return citiesData.map(city => getVectorFromLatLng(city.lat, city.lng, EARTH_RADIUS + 0.02));
  }, []);

  return (
    <group>
      {cityPositions.map((pos, i) => (
        <CityPoint key={i} position={pos} />
      ))}
    </group>
  );
};

export default Cities;
