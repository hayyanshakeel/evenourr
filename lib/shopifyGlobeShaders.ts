// Shopify-style globe shaders inspired by their BFCM 2023 implementation
// Based on: https://shopify.engineering/how-we-built-shopifys-bfcm-2023-globe

// Simplified noise function (psrdnoise-inspired)
export const noiseFunction = `
// Simplified 2D noise function
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  const float K1 = 0.366025404; // (sqrt(3)-1)/2
  const float K2 = 0.211324865; // (3-sqrt(3))/6
  
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  
  vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash2(i + 0.0)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
  
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  
  return value;
}
`;

// Globe vertex shader
export const globeVertexShader = `
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vNoise;

uniform float uTime;

${noiseFunction}

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  
  // Calculate world position
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  
  // Add subtle noise displacement for organic feel
  vec3 pos = position;
  float noiseValue = fbm(uv * 8.0 + uTime * 0.1) * 0.02;
  pos += normal * noiseValue;
  vNoise = noiseValue;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

// Globe fragment shader with risograph aesthetic
export const globeFragmentShader = `
uniform float uTime;
uniform vec3 uWaterColor;
uniform vec3 uLandColor;
uniform vec3 uAtmosphereColor;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vNoise;

${noiseFunction}

void main() {
  vec2 uv = vUv;
  
  // Create land/water mask using noise
  float landMask = fbm(uv * 4.0 + vec2(0.0, uTime * 0.05));
  landMask = smoothstep(0.1, 0.3, landMask);
  
  // Risograph-style noise texture
  float noiseDetail = fbm(uv * 32.0) * 0.3;
  float noiseCoarse = fbm(uv * 8.0 + uTime * 0.1) * 0.7;
  float totalNoise = noiseDetail + noiseCoarse;
  
  // Base color mixing
  vec3 baseColor = mix(uWaterColor, uLandColor, landMask);
  
  // Apply risograph noise effect
  baseColor += totalNoise * 0.15;
  
  // Simple lighting
  vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
  float lighting = dot(vNormal, lightDirection) * 0.5 + 0.5;
  
  // Fresnel effect for atmosphere
  float fresnel = pow(1.0 - dot(vNormal, normalize(-vWorldPosition)), 2.0);
  vec3 atmosphereGlow = uAtmosphereColor * fresnel * 0.3;
  
  vec3 finalColor = baseColor * lighting + atmosphereGlow;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// City dots vertex shader
export const cityDotsVertexShader = `
attribute vec3 instancePosition;
attribute float instanceIntensity;
attribute float instanceTime;

uniform float uTime;
uniform float uSize;

varying float vIntensity;
varying float vLifetime;

void main() {
  vIntensity = instanceIntensity;
  vLifetime = uTime - instanceTime;
  
  // Pulse animation
  float pulse = sin(vLifetime * 4.0) * 0.3 + 0.7;
  float size = uSize * pulse * instanceIntensity;
  
  vec4 mvPosition = modelViewMatrix * vec4(instancePosition, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * (300.0 / -mvPosition.z);
}
`;

// City dots fragment shader
export const cityDotsFragmentShader = `
uniform vec3 uColor;

varying float vIntensity;
varying float vLifetime;

void main() {
  // Circular point
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  if (dist > 0.5) discard;
  
  // Soft glow
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  alpha *= vIntensity;
  
  // Fade out over time
  float fade = max(0.0, 1.0 - vLifetime / 10.0);
  alpha *= fade;
  
  vec3 color = uColor;
  gl_FragColor = vec4(color, alpha);
}
`;

// Arc vertex shader for instanced rendering
export const arcVertexShader = `
attribute vec3 instanceP0;
attribute vec3 instanceP1;
attribute vec3 instanceP2;
attribute vec3 instanceP3;
attribute float instanceStartTime;
attribute vec3 instanceColor;

uniform float uTime;
uniform mat4 uViewMatrix;

varying vec3 vColor;
varying float vAlpha;
varying vec2 vUv;

// Bézier curve evaluation
vec3 bezier(float t, vec3 p0, vec3 p1, vec3 p2, vec3 p3) {
  float u = 1.0 - t;
  return u * u * u * p0 + 3.0 * u * u * t * p1 + 3.0 * u * t * t * p2 + t * t * t * p3;
}

// Bézier tangent
vec3 bezierTangent(float t, vec3 p0, vec3 p1, vec3 p2, vec3 p3) {
  float u = 1.0 - t;
  return 3.0 * u * u * (p1 - p0) + 6.0 * u * t * (p2 - p1) + 3.0 * t * t * (p3 - p2);
}

void main() {
  vUv = uv;
  vColor = instanceColor;
  
  float age = (uTime - instanceStartTime) / 2.0; // 2 second animation
  float normalizedAge = clamp(age, 0.0, 2.0);
  
  // Calculate position along curve
  float t = uv.y;
  vec3 curvePosition = bezier(t, instanceP0, instanceP1, instanceP2, instanceP3);
  vec3 tangent = normalize(bezierTangent(t, instanceP0, instanceP1, instanceP2, instanceP3));
  
  // Billboard the mesh to always face camera
  vec3 cameraDirection = normalize((uViewMatrix * vec4(curvePosition, 1.0)).xyz);
  vec3 right = normalize(cross(tangent, cameraDirection));
  
  // Offset position for thickness
  vec3 finalPosition = curvePosition + right * (uv.x - 0.5) * 0.02;
  
  // Animation and alpha
  float trailProgress = normalizedAge;
  float trailLength = 0.3; // Length of the visible trail
  float trailStart = max(0.0, trailProgress - trailLength);
  float trailEnd = trailProgress;
  
  if (t < trailStart || t > trailEnd) {
    vAlpha = 0.0;
  } else {
    float fadeIn = smoothstep(trailStart, trailStart + 0.1, t);
    float fadeOut = 1.0 - smoothstep(trailEnd - 0.1, trailEnd, t);
    vAlpha = fadeIn * fadeOut;
  }
  
  // Fade out entire arc after animation completes
  if (normalizedAge > 1.0) {
    vAlpha *= 1.0 - (normalizedAge - 1.0);
  }
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
}
`;

// Arc fragment shader
export const arcFragmentShader = `
uniform float uTime;

varying vec3 vColor;
varying float vAlpha;
varying vec2 vUv;

${noiseFunction}

void main() {
  // Add noise for organic feel
  float noiseValue = noise(vUv * 10.0 + uTime * 2.0);
  float alpha = vAlpha * (0.8 + noiseValue * 0.2);
  
  // Gradient along the arc width
  float widthFade = 1.0 - abs(vUv.x - 0.5) * 2.0;
  alpha *= smoothstep(0.0, 0.3, widthFade);
  
  if (alpha < 0.01) discard;
  
  gl_FragColor = vec4(vColor, alpha);
}
`;

// Stars background shader
export const starsVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const starsFragmentShader = `
varying vec2 vUv;

${noiseFunction}

void main() {
  vec2 uv = vUv * 8.0; // Scale for more stars
  
  float stars = noise(uv);
  stars = pow(max(0.0, stars), 4.0); // Make stars more sparse and bright
  
  vec3 color = vec3(1.0, 0.9, 0.8) * stars * 2.0;
  gl_FragColor = vec4(color, 1.0);
}
`;
