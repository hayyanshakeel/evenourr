import * as THREE from 'three';

// Create realistic earth texture with continents and oceans
export function createEarthTexture(): THREE.Texture {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Ocean base
  const oceanGradient = ctx.createLinearGradient(0, 0, 0, size);
  oceanGradient.addColorStop(0, '#1e3a8a'); // Deep blue
  oceanGradient.addColorStop(0.5, '#1e40af'); // Medium blue
  oceanGradient.addColorStop(1, '#1d4ed8'); // Lighter blue
  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, size, size);

  // Simplified continent shapes
  drawContinents(ctx, size);

  // Add cloud layer
  drawClouds(ctx, size);

  // Add latitude/longitude grid
  drawGrid(ctx, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Create night lights texture
export function createNightTexture(): THREE.Texture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Black base
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Add city lights (simplified major cities)
  const cities = [
    { x: 0.74, y: 0.27, name: 'New York' },
    { x: 0.05, y: 0.32, name: 'London' },
    { x: 0.77, y: 0.35, name: 'Tokyo' },
    { x: 0.55, y: 0.42, name: 'Mumbai' },
    { x: 0.02, y: 0.45, name: 'Lagos' },
    { x: 0.85, y: 0.62, name: 'Sydney' },
    { x: 0.72, y: 0.38, name: 'Beijing' },
    { x: 0.95, y: 0.55, name: 'São Paulo' },
  ];

  ctx.fillStyle = '#ffeb3b';
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#ffeb3b';
  
  cities.forEach(city => {
    const x = city.x * size;
    const y = city.y * size;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Add smaller surrounding lights
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 8 + Math.random() * 12;
      const lightX = x + Math.cos(angle) * radius;
      const lightY = y + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.arc(lightX, lightY, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// Create bump/normal map for terrain
export function createBumpTexture(): THREE.Texture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Gray base
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Add mountain ranges and terrain variation
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      
      // Create noise-based height map
      const noise = 
        Math.sin(x * 0.01) * 0.3 +
        Math.sin(y * 0.01) * 0.3 +
        Math.sin(x * 0.02 + y * 0.02) * 0.2 +
        Math.random() * 0.2;
      
      const height = Math.max(0, Math.min(255, 128 + noise * 127));
      
      data[i] = height;     // R
      data[i + 1] = height; // G  
      data[i + 2] = height; // B
      data[i + 3] = 255;    // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function drawContinents(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = '#22c55e'; // Green for land
  
  // North America (simplified)
  ctx.beginPath();
  ctx.ellipse(size * 0.15, size * 0.25, size * 0.08, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // South America
  ctx.beginPath();
  ctx.ellipse(size * 0.22, size * 0.6, size * 0.04, size * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Europe/Africa
  ctx.beginPath();
  ctx.ellipse(size * 0.52, size * 0.3, size * 0.06, size * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.ellipse(size * 0.53, size * 0.45, size * 0.05, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Asia
  ctx.beginPath();
  ctx.ellipse(size * 0.65, size * 0.28, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Australia
  ctx.beginPath();
  ctx.ellipse(size * 0.75, size * 0.65, size * 0.04, size * 0.03, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Add some islands and details
  ctx.fillStyle = '#16a34a'; // Darker green for details
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 8 + 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawClouds(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
  
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const width = Math.random() * 80 + 40;
    const height = Math.random() * 30 + 20;
    
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.shadowBlur = 0;
}

function drawGrid(ctx: CanvasRenderingContext2D, size: number) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  
  // Longitude lines
  for (let i = 0; i <= 12; i++) {
    const x = (i / 12) * size;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  
  // Latitude lines
  for (let i = 0; i <= 6; i++) {
    const y = (i / 6) * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
}

export async function loadBrandGlobeTexture(colorHex: string): Promise<THREE.Texture> {
  // Procedural texture using canvas to avoid heavy network textures
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base fill
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, size, size);

  // Add subtle noise / graticule-like pattern to imply land/water separation (on-brand, abstract)
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#000000';
  for (let i = 0; i < 180; i += 6) {
    ctx.fillRect(0, (i / 180) * size, size, 1);
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}


