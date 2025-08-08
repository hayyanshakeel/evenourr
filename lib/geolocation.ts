export interface LocationData {
  country: string
  countryCode: string
  region: string
  city: string
  timezone: string
  currency: string
  ip: string
}

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  flag: string
  description: string
  rates: {
    standard: number
    express?: number
    delivery_time: string
  }
}

// Predefined shipping zones with country codes
export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'international',
    name: 'International',
    countries: ['CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'GR', 'PL', 'CZ'],
    flag: '🌍',
    description: 'Ships to Canada, United Kingdom, Australia, Germany, France, and 15 other countries',
    rates: {
      standard: 15.99,
      express: 29.99,
      delivery_time: '7-14 business days'
    }
  },
  {
    id: 'asia',
    name: 'Asia Pacific',
    countries: ['JP', 'KR', 'SG', 'HK', 'TH', 'MY', 'ID', 'PH', 'VN', 'TW', 'IN', 'CN', 'NZ', 'BD', 'LK', 'PK'],
    flag: '🌏',
    description: 'Ships to Japan, South Korea, Singapore, Hong Kong, Thailand, India, and 10 other countries',
    rates: {
      standard: 24.99,
      delivery_time: '10-21 business days'
    }
  }
]

// Country flag mapping
const COUNTRY_FLAGS: Record<string, string> = {
  'US': '🇺🇸',
  'IN': '🇮🇳',
  'CA': '🇨🇦',
  'GB': '🇬🇧',
  'AU': '🇦🇺',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'JP': '🇯🇵',
  'KR': '🇰🇷',
  'SG': '🇸🇬',
  'CN': '🇨🇳',
  'BR': '🇧🇷',
  'MX': '🇲🇽',
  'IT': '🇮🇹',
  'ES': '🇪🇸',
  'NL': '🇳🇱',
  'SE': '🇸🇪',
  'NO': '🇳🇴',
  'DK': '🇩🇰',
  'FI': '🇫🇮'
}

/**
 * Create domestic zone based on detected country
 */
export function createDomesticZone(countryCode: string, countryName: string): ShippingZone {
  const flag = COUNTRY_FLAGS[countryCode] || '🏳️'
  
  return {
    id: 'domestic',
    name: `Domestic (${countryName})`,
    countries: [countryCode],
    flag: flag,
    description: `Ships to ${countryName}`,
    rates: {
      standard: 5.99,
      express: 12.99,
      delivery_time: '2-5 business days'
    }
  }
}

/**
 * Get all shipping zones including dynamic domestic zone
 */
export function getAllShippingZones(location?: LocationData | null): ShippingZone[] {
  const zones = [...SHIPPING_ZONES]
  
  if (location) {
    // Create domestic zone based on detected location
    const domesticZone = createDomesticZone(location.countryCode, location.country)
    zones.unshift(domesticZone) // Add at beginning
  } else {
    // Default domestic zone (US)
    const defaultDomestic = createDomesticZone('US', 'United States')
    zones.unshift(defaultDomestic)
  }
  
  // Add some example custom zones that can be deleted
  const customZones: ShippingZone[] = [
    {
      id: 'custom-premium',
      name: 'Premium Express',
      countries: ['US', 'CA', 'GB', 'AU'],
      flag: '⚡',
      description: 'Premium express shipping for major English-speaking countries',
      rates: {
        standard: 29.99,
        delivery_time: '1-2 business days'
      }
    },
    {
      id: 'custom-economy',
      name: 'Economy Zone',
      countries: ['MX', 'BR', 'AR'],
      flag: '🚛',
      description: 'Affordable shipping for Latin America',
      rates: {
        standard: 8.99,
        delivery_time: '15-25 business days'
      }
    }
  ]
  
  // Add custom zones to the list
  zones.push(...customZones)
  
  return zones
}

/**
 * Get user's location based on IP address (country-focused like Shopify)
 */
export async function getUserLocation(): Promise<LocationData | null> {
  try {
    // Use our server-side API route instead of direct external calls
    const response = await fetch('/api/location')
    
    if (!response.ok) {
      throw new Error('Failed to fetch location from server')
    }
    
    const data = await response.json()
    return data as LocationData
  } catch (error) {
    console.error('Error fetching location from server:', error)
    
    // Return fallback location
    return {
      country: 'United States',
      countryCode: 'US',
      region: '',
      city: '',
      timezone: 'America/New_York',
      currency: 'USD',
      ip: '127.0.0.1'
    }
  }
}

/**
 * Determine shipping zone based on country code
 */
export function getShippingZoneByCountry(countryCode: string, location?: LocationData | null): ShippingZone {
  // Check if it's the user's home country (domestic)
  if (location && location.countryCode === countryCode) {
    return createDomesticZone(countryCode, location.country)
  }
  
  // Check predefined zones
  const zone = SHIPPING_ZONES.find(zone => 
    zone.countries.includes(countryCode.toUpperCase())
  )
  
  // Default to international zone if country not found
  return zone || SHIPPING_ZONES[0]!
}

/**
 * Get user's shipping zone based on IP geolocation
 */
export async function getUserShippingZone(): Promise<ShippingZone> {
  try {
    const location = await getUserLocation()
    
    if (!location) {
      // Default to US domestic zone if location detection fails
      return createDomesticZone('US', 'United States')
    }
    
    // Create domestic zone for detected country
    return createDomesticZone(location.countryCode, location.country)
  } catch (error) {
    console.error('Error determining user shipping zone:', error)
    // Default to US domestic zone
    return createDomesticZone('US', 'United States')
  }
}

/**
 * Format shipping rate for display
 */
export function formatShippingRate(rate: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(rate)
}

/**
 * Get estimated delivery date
 */
export function getEstimatedDelivery(businessDays: number): string {
  const today = new Date()
  let deliveryDate = new Date(today)
  let addedDays = 0
  
  while (addedDays < businessDays) {
    deliveryDate.setDate(deliveryDate.getDate() + 1)
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
      addedDays++
    }
  }
  
  return deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Check if a shipping zone can be deleted
 */
export function canDeleteZone(zoneId: string): boolean {
  // All zones can now be deleted - no restrictions
  return true
}

/**
 * Get zone restrictions message
 */
export function getZoneRestrictionMessage(zoneId: string): string | null {
  // No restrictions - all zones can be deleted
  return null
}
