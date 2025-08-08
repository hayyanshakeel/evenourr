import { useState, useEffect } from 'react'
import { getUserShippingZone, getUserLocation, type ShippingZone, type LocationData } from '@/lib/geolocation'

interface UseLocationReturn {
  location: LocationData | null
  shippingZone: ShippingZone | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [shippingZone, setShippingZone] = useState<ShippingZone | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLocation = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const [locationData, zoneData] = await Promise.all([
        getUserLocation(),
        getUserShippingZone()
      ])
      
      setLocation(locationData)
      setShippingZone(zoneData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location'
      setError(errorMessage)
      console.error('Location detection error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = async () => {
    await fetchLocation()
  }

  useEffect(() => {
    fetchLocation()
  }, [])

  return {
    location,
    shippingZone,
    isLoading,
    error,
    refetch
  }
}
