
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Globe from './components/Globe';
import InfoPanel from './components/InfoPanel';
import { useStore } from './store/useStore';

function App() {
  const isPanelOpen = useStore((state) => state.isPanelOpen);

  return (
    <div className="relative w-full h-full">
      <InfoPanel />
      <div className={`w-full h-full transition-all duration-500 ${isPanelOpen ? 'ml-0 md:ml-[400px]' : 'ml-0'}`}>
        <Suspense fallback={<div className="w-full h-full bg-black flex items-center justify-center text-white">Loading NovaSphere...</div>}>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Globe />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
