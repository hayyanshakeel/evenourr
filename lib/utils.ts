import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base URL configuration
export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Environment validation
export function validateEnvironmentVariables() {
  const requiredServerVars = [
    'TURSO_DATABASE_URL',
    'TURSO_AUTH_TOKEN'
  ];

  const requiredClientVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];

  const missing: string[] = [];

  // Check server variables
  for (const variable of requiredServerVars) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  }

  // Check client variables
  for (const variable of requiredClientVars) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// URL creation helper
export function createUrl(pathname: string, params: URLSearchParams | string = '') {
  const paramsString = params.toString();
  const queryString = paramsString.length ? `?${paramsString}` : '';
  
  return `${pathname}${queryString}`;
}
