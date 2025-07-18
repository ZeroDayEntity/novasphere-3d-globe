
import { create } from 'zustand';
import * as THREE from 'three';

interface Country {
  properties: {
    ADMIN: string;
    ISO_A3: string;
  };
  [key: string]: any;
}

interface StoreState {
  selectedCountry: Country | null;
  isPanelOpen: boolean;
  cameraTarget: {
    position: THREE.Vector3;
    lookAt: THREE.Vector3;
  } | null;
  setSelectedCountry: (country: Country | null) => void;
  setPanelOpen: (isOpen: boolean) => void;
  setCameraTarget: (target: { position: THREE.Vector3; lookAt: THREE.Vector3 } | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedCountry: null,
  isPanelOpen: false,
  cameraTarget: null,
  setSelectedCountry: (country) => set(state => {
    if (country) {
      return { selectedCountry: country, isPanelOpen: true };
    }
    return { selectedCountry: null, isPanelOpen: false };
  }),
  setPanelOpen: (isOpen) => set({ isPanelOpen: isOpen }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
}));
