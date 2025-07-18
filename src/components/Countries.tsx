
import { useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import { geoCentroid } from 'd3-geo';
import { useStore } from '../store/useStore';
import countriesData from '../data/countries.geo.json';

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

const CountryMesh = ({ feature, onHover, onSelect }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setSelectedCountry, setCameraTarget } = useStore();

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(feature);
    setSelectedCountry(feature);

    const centroid = geoCentroid(feature);
    const [lng, lat] = centroid;

    const cameraPos = getVectorFromLatLng(lat, lng, 4); // Fly to a distance of 4 units
    const lookAtPos = new THREE.Vector3(0,0,0); // Look at center

    setCameraTarget({ position: cameraPos, lookAt: lookAtPos });
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    onHover(feature);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    onHover(null);
    document.body.style.cursor = 'auto';
  };

  const shapes = useMemo(() => {
    // This is a simplified geometry generation for demonstration.
    // A robust solution would use a library to triangulate the GeoJSON polygons.
    const shape = new THREE.Shape();
    const coords = feature.geometry.coordinates[0];
    shape.moveTo(coords[0][0], coords[0][1]);
    for (let i = 1; i < coords.length; i++) {
        shape.lineTo(coords[i][0], coords[i][1]);
    }
    return [shape];
  }, [feature]);

  // We are not rendering the complex shapes here, but highlighting the concept.
  // Instead, we create an invisible sphere that represents the country's clickable area.
  const centroid = geoCentroid(feature);
  const position = getVectorFromLatLng(centroid[1], centroid[0], EARTH_RADIUS + 0.02);

  return (
    <mesh
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial 
        color={isHovered ? 0xffdd00 : 0xffffff} 
        transparent 
        opacity={isHovered ? 0.5 : 0} 
      />
    </mesh>
  );
};

const Countries = () => {
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  return (
    <group>
      {countriesData.features.map((feature, i) => (
        <CountryMesh 
          key={i} 
          feature={feature} 
          onHover={setHoveredCountry}
          onSelect={setSelectedCountry}
        />
      ))}
    </group>
  );
};

export default Countries;
