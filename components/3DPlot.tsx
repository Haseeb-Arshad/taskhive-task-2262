import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useTheme } from '@/hooks/useTheme';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Function3D {
  f: (x: number, y: number) => number;
  range: { x: [number, number], y: [number, number] };
  resolution?: number;
}

interface PlotData {
  points: Point3D[];
  colors?: number[];
  type?: 'scatter' | 'surface';
}

interface ThreeDPlotProps {
  data: PlotData;
  width?: number;
  height?: number;
  controls?: boolean;
}

export const ThreeDPlot: React.FC<ThreeDPlotProps> = ({ 
  data, 
  width = 600, 
  height = 400, 
  controls = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<THREE.Scene>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true
    });

    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xeeeeee);
    scene.add(gridHelper);

    // Add plot data
    addPlotData(scene, data);

    // Controls
    let controls: OrbitControls;
    if (controls) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
    }

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controls) {
        controls.update();
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (controls) {
        controls.dispose();
      }
      renderer.dispose();
    };
  }, [data, width, height, controls]);

  const addPlotData = (scene: THREE.Scene, data: PlotData) => {
    if (data.type === 'scatter') {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(data.points.length * 3);
      const colors = new Float32Array(data.points.length * 3);

      data.points.forEach((point, index) => {
        positions[index * 3] = point.x;
        positions[index * 3 + 1] = point.y;
        positions[index * 3 + 2] = point.z;

        const color = data.colors ? data.colors[index] : 0xffffff;
        colors[index * 3] = (color >> 16) & 0xff;
        colors[index * 3 + 1] = (color >> 8) & 0xff;
        colors[index * 3 + 2] = color & 0xff;
      });

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
    }

    if (data.type === 'surface') {
      // Create surface plot
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(data.points.length * 3);
      const colors = new Float32Array(data.points.length * 3);

      data.points.forEach((point, index) => {
        positions[index * 3] = point.x;
        positions[index * 3 + 1] = point.y;
        positions[index * 3 + 2] = point.z;

        const color = data.colors ? data.colors[index] : 0xffffff;
        colors[index * 3] = (color >> 16) & 0xff;
        colors[index * 3 + 1] = (color >> 8) & 0xff;
        colors[index * 3 + 2] = color & 0xff;
      });

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }
  };

  return (
    <div className="three-d-plot">
      <canvas ref={canvasRef} width={width} height={height} />
      <div className="plot-controls">
        <button onClick={() => controls && controls.reset()}>
          Reset View
        </button>
      </div>
    </div>
  );
};

// Example usage:
// const data: PlotData = {
//   points: [
//     { x: -5, y: -5, z: 0 },
//     { x: 0, y: 0, z: 5 },
//     { x: 5, y: 5, z: 0 }
//   ],
//   type: 'scatter'
// };
// 
// <ThreeDPlot data={data} />