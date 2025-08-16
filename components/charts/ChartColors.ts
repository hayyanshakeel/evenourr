"use client";

// Map brand tokens from CSS variables to concrete color strings
// Assumes shadcn/ui theme with HSL variables, e.g., --primary: 222.2 47.4% 11.2%

export type BrandPalette = {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  foreground: string;
};

function readVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!val) return fallback;
  // If value looks like H S L, wrap with hsl()
  if (/\d/.test(val)) return `hsl(${val})`;
  return val;
}

export function getBrandColors(): BrandPalette {
  return {
    primary: readVar('--primary', 'hsl(221.2 83.2% 53.3%)'),
    secondary: readVar('--secondary', 'hsl(210 40% 96.1%)'),
    accent: readVar('--accent', 'hsl(210 40% 96.1%)'),
    muted: readVar('--muted', 'hsl(210 40% 96.1%)'),
    foreground: readVar('--foreground', 'hsl(222.2 47.4% 11.2%)'),
  };
}


