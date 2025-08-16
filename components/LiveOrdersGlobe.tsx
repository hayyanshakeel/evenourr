"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency as formatCurrencyUtil } from '@/lib/currencies';
import { RealisticGlobe, TerrainMap, FlatMap } from './LiveOrdersViews';
import * as THREE from 'three';

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

type LiveOrdersGlobeProps = {
  className?: string;
  hq?: { lat: number; lng: number };
  accent?: string; // CSS color
  viewMode?: 'globe' | 'map' | 'flatmap';
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

function useSSE(onOrder: (o: LiveOrder) => void) {
  useEffect(() => {
    const ev = new EventSource('/api/live-orders');
    const handler = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        const order: LiveOrder = {
          id: `${data.city}_${data.country}`,
          lat: data.lat,
          lng: data.lng,
          city: data.city,
          country: data.country,
          revenue: Math.round((data.revenue ?? 0) * 100),
          currency: data.currency || 'USD',
          ts: Date.now(),
        };
        onOrder(order);
      } catch {}
    };
    ev.addEventListener('message', handler);
    return () => {
      ev.removeEventListener('message', handler as any);
      ev.close();
    };
  }, [onOrder]);
}

// Scene component that renders the appropriate view based on viewMode
function Scene({ orders, setHovered, fromHQ, paused, viewMode }: { 
  orders: LiveOrder[]; 
  setHovered: (o: LiveOrder | null) => void; 
  fromHQ: THREE.Vector3; 
  paused: boolean;
  viewMode: 'globe' | 'map' | 'flatmap';
}) {
  return (
    <group position={[0, 0, 0]}>
      {(() => {
        switch (viewMode) {
          case 'globe':
            return <RealisticGlobe orders={orders} setHovered={setHovered} fromHQ={fromHQ} paused={paused} />;
          case 'map':
            return <TerrainMap orders={orders} setHovered={setHovered} fromHQ={fromHQ} paused={paused} />;
          case 'flatmap':
            return <FlatMap orders={orders} setHovered={setHovered} />;
          default:
            return <RealisticGlobe orders={orders} setHovered={setHovered} fromHQ={fromHQ} paused={paused} />;
        }
      })()}
    </group>
  );
}

export function LiveOrdersGlobe({ className, hq = { lat: 40.7128, lng: -74.0060 }, accent, viewMode = 'globe' }: LiveOrdersGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const [hovered, setHovered] = useState<LiveOrder | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const { currency } = useSettings();

  useSSE((incoming) => {
    setOrders((prev) => {
      const now = Date.now();
      const fresh = prev.filter((o) => now - o.ts < 30000);
      const idx = fresh.findIndex((o) => o.city === incoming.city && o.country === incoming.country);
      if (idx >= 0 && fresh[idx]) {
        const existing = fresh[idx];
        const updated: LiveOrder = { 
          id: existing.id,
          lat: existing.lat,
          lng: existing.lng,
          city: existing.city,
          country: existing.country,
          ts: now, 
          revenue: incoming.revenue, 
          currency: incoming.currency 
        };
        fresh[idx] = updated;
        return [...fresh];
      }
      return [...fresh, incoming].slice(-200);
    });
  });

  const fromHQ = useMemo(() => latLngToVec3(hq.lat, hq.lng), [hq.lat, hq.lng]);
  const a11yList = useMemo(() => orders.slice(-10).reverse(), [orders]);

  const cameraPosition: [number, number, number] = viewMode === 'flatmap' ? [0, 0, 3] : [0, 0, 2.8];
  const enableRotation = viewMode !== 'flatmap';

  // Ensure globe sits above everything and gets all pointer events
  const containerClasses = `${className ?? ''} fixed inset-0 z-[9999] pointer-events-auto`;

  return (
    <div
      ref={containerRef}
      className={containerClasses.trim()}
      style={{ background: 'transparent', touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none', overscrollBehavior: 'none' as any }}
      onWheelCapture={(e) => {
        // Prevent page scroll so wheel goes to OrbitControls zoom
        e.preventDefault();
      }}
      onPointerDownCapture={(e) => {
        // Avoid text selection/drag on the page while rotating
        e.preventDefault();
      }}
    >
      <Canvas 
        camera={{ position: cameraPosition, fov: 60 }} 
        frameloop={'always'}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        style={{ position: 'fixed', inset: 0 as any, width: '100vw', height: '100vh', background: 'transparent', pointerEvents: 'auto' as const }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0);
          gl.setSize(gl.domElement.clientWidth, gl.domElement.clientHeight);
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
          setIsCanvasReady(true);
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={0.9} />
        <directionalLight position={[-5, -3, -5]} intensity={0.5} />
        <Scene orders={orders} setHovered={setHovered} fromHQ={fromHQ} paused={!!hovered} viewMode={viewMode} />
        <OrbitControls 
          makeDefault
          enableZoom={true}
          zoomSpeed={0.9}
          enablePan={viewMode === 'flatmap'} 
          enableRotate={enableRotation}
          rotateSpeed={0.7}
          target={[0, 0, 0]}
          minDistance={viewMode === 'flatmap' ? 1.2 : 1.9}
          maxDistance={viewMode === 'flatmap' ? 8 : 6}
          minPolarAngle={viewMode === 'flatmap' ? Math.PI / 2 : Math.PI / 8} 
          maxPolarAngle={viewMode === 'flatmap' ? Math.PI / 2 : (7 * Math.PI) / 8}
          autoRotate={true}
          autoRotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.08}
          touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
        />
      </Canvas>

      {hovered && (
        <div className="pointer-events-none absolute inset-x-0 -mt-8 mx-auto w-max rounded-md bg-white/90 dark:bg-black/80 px-2 py-1 text-xs shadow border border-neutral-200 dark:border-neutral-800">
          {hovered.city}, {hovered.country} — {formatCurrencyUtil(hovered.revenue / 100, hovered.currency || currency)}
        </div>
      )}

      <ul className="sr-only" aria-live="polite" aria-atomic="true">
        {a11yList.map((o) => (
          <li key={`a11y_${o.id}`}>{`${o.city}, ${o.country} — ${formatCurrencyUtil(o.revenue / 100, o.currency || currency)}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default LiveOrdersGlobe;


