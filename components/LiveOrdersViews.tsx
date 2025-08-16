"use client";

import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createEarthTexture, createNightTexture, createBumpTexture } from '@/lib/globeTextures';

type LiveOrder = {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  revenue: number; // in cents
  currency: string; // ISO code
  ts: number; // ms
};

const RADIUS = 1.8;

function latLngToVec3(lat: number, lng: number, radius = RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Enhanced Globe with realistic Earth texture
function RealisticGlobe({ orders, setHovered, fromHQ, paused }: { orders: LiveOrder[]; setHovered: (o: LiveOrder | null) => void; fromHQ: THREE.Vector3; paused: boolean }) {
  const rotationRef = useRef<THREE.Group>(null);
  const [earthTexture] = useState(() => createEarthTexture());
  const [nightTexture] = useState(() => createNightTexture());
  const [bumpTexture] = useState(() => createBumpTexture());

  useFrame(() => {
    if (!rotationRef.current || paused) return;
    rotationRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={rotationRef} scale={[1, 1, 1]} position={[0, 0, 0]}>
      {/* Main Earth */}
      <mesh>
        <sphereGeometry args={[RADIUS, 128, 128]} />
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.05}
          specular={new THREE.Color(0x4444aa)}
          shininess={100}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.02}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial
          color={0x88ccff}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Night side city lights */}
      <mesh>
        <sphereGeometry args={[RADIUS + 0.001, 128, 128]} />
        <meshBasicMaterial
          map={nightTexture}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Live orders */}
      {orders.map((order) => {
        const to = latLngToVec3(order.lat, order.lng);
        return (
          <group key={order.id}>
            <Arc from={fromHQ} to={to} color="#60a5fa" />
            <Marker order={order} accent="#3b82f6" onHover={setHovered} />
          </group>
        );
      })}
    </group>
  );
}

// 3D Terrain Map View
function TerrainMap({ orders, setHovered, fromHQ, paused }: { orders: LiveOrder[]; setHovered: (o: LiveOrder | null) => void; fromHQ: THREE.Vector3; paused: boolean }) {
  const rotationRef = useRef<THREE.Group>(null);
  const [heightTexture] = useState(() => createBumpTexture());

  useFrame(() => {
    if (!rotationRef.current || paused) return;
    rotationRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={rotationRef} scale={[1, 1, 1]} position={[0, 0, 0]}>
      {/* Terrain sphere with displacement */}
      <mesh>
        <sphereGeometry args={[RADIUS, 256, 256]} />
        <meshLambertMaterial
          color={0x8B7355}
          displacementMap={heightTexture}
          displacementScale={0.1}
        />
      </mesh>

      {/* Water level */}
      <mesh>
        <sphereGeometry args={[RADIUS - 0.02, 64, 64]} />
        <meshPhongMaterial
          color={0x006994}
          transparent
          opacity={0.8}
          shininess={100}
        />
      </mesh>

      {/* Live orders */}
      {orders.map((order) => {
        const to = latLngToVec3(order.lat, order.lng, RADIUS + 0.1);
        return (
          <group key={order.id}>
            <Arc from={fromHQ} to={to} color="#10b981" />
            <Marker order={order} accent="#059669" onHover={setHovered} />
          </group>
        );
      })}
    </group>
  );
}

// Flat Map View (2D projection on a plane)
function FlatMap({ orders, setHovered }: { orders: LiveOrder[]; setHovered: (o: LiveOrder | null) => void }) {
  const [worldTexture] = useState(() => {
    // Create a flat world map texture
    const size = 2048;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Ocean background
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(0, 0, size, size);

    // Continents (simplified Mercator-like projection)
    ctx.fillStyle = '#22c55e';
    
    // North America
    ctx.fillRect(size * 0.1, size * 0.2, size * 0.15, size * 0.25);
    
    // South America  
    ctx.fillRect(size * 0.18, size * 0.5, size * 0.08, size * 0.3);
    
    // Europe/Africa
    ctx.fillRect(size * 0.45, size * 0.15, size * 0.1, size * 0.15);
    ctx.fillRect(size * 0.45, size * 0.35, size * 0.12, size * 0.25);
    
    // Asia
    ctx.fillRect(size * 0.6, size * 0.1, size * 0.25, size * 0.2);
    
    // Australia
    ctx.fillRect(size * 0.75, size * 0.6, size * 0.08, size * 0.05);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    
    // Vertical lines (longitude)
    for (let i = 0; i <= 12; i++) {
      const x = (i / 12) * size;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    
    // Horizontal lines (latitude)
    for (let i = 0; i <= 6; i++) {
      const y = (i / 6) * size;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  // Convert lat/lng to flat map coordinates
  const convertToFlatCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 4 - 2; // -2 to 2
    const y = ((90 - lat) / 180) * 2 - 1;  // -1 to 1
    return new THREE.Vector3(x, y, 0.01);
  };

  return (
    <group>
      {/* Flat world map */}
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[4, 2]} />
        <meshBasicMaterial map={worldTexture} />
      </mesh>

      {/* Live orders on flat map */}
      {orders.map((order) => {
        const pos = convertToFlatCoords(order.lat, order.lng);
        return (
          <FlatMarker
            key={order.id}
            order={order}
            position={pos}
            onHover={setHovered}
          />
        );
      })}
    </group>
  );
}

// Marker component for 3D views
function Marker({ order, accent, onHover }: { order: LiveOrder; accent: string; onHover: (order: LiveOrder | null, e?: THREE.Event) => void }) {
  const group = useRef<THREE.Group>(null);
  const pos = useMemo(() => latLngToVec3(order.lat, order.lng, RADIUS + 0.02), [order.lat, order.lng]);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const pulse = 1 + 0.3 * Math.sin(t * 4);
    const scale = hovered ? 1.5 : pulse;
    group.current.scale.setScalar(scale);
  });

  const onPointerOver = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(true);
    onHover(order, e);
  }, [order, onHover]);

  const onPointerOut = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(false);
    onHover(null);
  }, [onHover]);

  return (
    <group ref={group} position={pos} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <mesh>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
      {hovered && (
        <Html distanceFactor={8} className="pointer-events-none">
          <div className="rounded-md bg-white/95 dark:bg-black/90 px-3 py-2 text-xs shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="font-semibold">{order.city}, {order.country}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Marker component for flat map
function FlatMarker({ order, position, onHover }: { order: LiveOrder; position: THREE.Vector3; onHover: (order: LiveOrder | null) => void }) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const pulse = 1 + 0.4 * Math.sin(t * 3);
    const scale = hovered ? 2 : pulse;
    group.current.scale.setScalar(scale);
  });

  const onPointerOver = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(true);
    onHover(order);
  }, [order, onHover]);

  const onPointerOut = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(false);
    onHover(null);
  }, [onHover]);

  return (
    <group ref={group} position={position} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <mesh>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0.8}
        />
      </mesh>
      {hovered && (
        <Html className="pointer-events-none">
          <div className="rounded-md bg-white/95 dark:bg-black/90 px-3 py-2 text-xs shadow-lg border border-neutral-200 dark:border-neutral-700 transform -translate-x-1/2 -translate-y-full mb-2">
            <div className="font-semibold">{order.city}, {order.country}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Arc component for connecting lines
function Arc({ from, to, color }: { from: THREE.Vector3; to: THREE.Vector3; color: string }) {
  const points = useMemo(() => {
    const v0 = from.clone().normalize();
    const v1 = to.clone().normalize();
    const angle = v0.angleTo(v1);
    const segments = 48;
    const pts: THREE.Vector3[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const sinTotal = Math.sin(angle);
      const a = Math.sin((1 - t) * angle) / sinTotal;
      const b = Math.sin(t * angle) / sinTotal;
      const v = new THREE.Vector3()
        .addVectors(v0.clone().multiplyScalar(a), v1.clone().multiplyScalar(b))
        .normalize()
        .multiplyScalar(RADIUS * 1.01 + Math.sin(Math.PI * t) * 0.15);
      pts.push(v);
    }
    return pts;
  }, [from, to]);

  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const [progress, setProgress] = useState(0);
  const start = useRef<number>(performance.now());

  useFrame(() => {
    const elapsed = (performance.now() - start.current) / 1000;
    const p = Math.min(1, elapsed);
    setProgress(p);
  });

  const drawCount = Math.max(2, Math.floor(points.length * progress));

  useEffect(() => {
    geom.setDrawRange(0, drawCount);
  }, [drawCount, geom]);

  return (
    <primitive object={new THREE.Line(geom, new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6
    }))} />
  );
}

export { RealisticGlobe, TerrainMap, FlatMap };
