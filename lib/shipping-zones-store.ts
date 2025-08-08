// Simple file-based shipping zones store.
// This persists data between server restarts (better than pure in-memory).
// For production, replace with proper Prisma/Turso database persistence.

import fs from 'fs';
import path from 'path';

const ZONES_FILE = path.join(process.cwd(), 'data', 'shipping-zones.json');

export interface ShippingZoneRecord {
  id: string;
  name: string;
  type: 'domestic' | 'international' | 'custom';
  countries: string[];
  states: string[];
  flag: string;
  description?: string;
  rate: number;
  isFree: boolean;
  delivery_time?: string;
  created_at: string;
}

const defaultZones: ShippingZoneRecord[] = [
  {
    id: '1',
    name: 'Domestic Shipping',
    type: 'domestic',
    countries: ['domestic'],
    states: [],
    flag: '🏠',
    description: 'Domestic shipping zone',
    rate: 5.99,
    isFree: false,
    delivery_time: '2-5 business days',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'International Shipping',
    type: 'international',
    countries: ['international'],
    states: [],
    flag: '🌍',
    description: 'International shipping zone',
    rate: 15.99,
    isFree: false,
    delivery_time: '7-14 business days',
    created_at: new Date().toISOString(),
  }
];

function ensureDataDir() {
  const dataDir = path.dirname(ZONES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadZones(): ShippingZoneRecord[] {
  try {
    ensureDataDir();
    if (fs.existsSync(ZONES_FILE)) {
      const data = fs.readFileSync(ZONES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading zones from file:', error);
  }
  
  // Return default zones if file doesn't exist or can't be read
  return [...defaultZones];
}

function saveZones(zones: ShippingZoneRecord[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(ZONES_FILE, JSON.stringify(zones, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving zones to file:', error);
  }
}

export function listZones(): ShippingZoneRecord[] {
  return loadZones();
}

export function createZone(data: Omit<ShippingZoneRecord, 'id' | 'created_at'> & { id?: string }): ShippingZoneRecord {
  const zones = loadZones();
  const zone: ShippingZoneRecord = {
    id: data.id || (Date.now().toString()),
    created_at: new Date().toISOString(),
    ...data,
  };
  zones.push(zone);
  saveZones(zones);
  return zone;
}

export function deleteZone(id: string): boolean {
  const zones = loadZones();
  const beforeLength = zones.length;
  const filteredZones = zones.filter(z => z.id !== id);
  
  if (filteredZones.length !== beforeLength) {
    saveZones(filteredZones);
    return true;
  }
  
  return false;
}
