import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useRef } from 'react';
import Earth from './Earth';
import Countries from './Countries';
import Cities from './Cities';
import { useStore } from '../store/useStore';

const Globe = () => {
  const controlsRef = useRef<any>(null);
  const cameraTarget = useStore((state) => state.cameraTarget);

  useFrame(({ camera }) => {
    // Fly-to animation
    if (cameraTarget && controlsRef.current) {
      camera.position.lerp(cameraTarget.position, 0.05);
      controlsRef.current.target.lerp(cameraTarget.lookAt, 0.05);
      controlsRef.current.update();

      const distance = camera.position.distanceTo(cameraTarget.position);
      if (distance < 0.01) {
        useStore.getState().setCameraTarget(null); // Animation complete
      }
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[3, 2, 3]} 
        intensity={2.5}
        castShadow 
      />
      <Stars radius={300} depth={50} count={10000} factor={7} saturation={0} fade speed={1} />
      
      <Earth />
      <Countries />
      <Cities />

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableDamping
        dampingFactor={0.05}
        minDistance={2.5}
        maxDistance={15}
        zoomSpeed={0.5}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.05} intensity={0.35} mipmapBlur />
      </EffectComposer>
    </>
  );
};

export default Globe;