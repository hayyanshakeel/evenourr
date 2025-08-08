"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useLocation } from "@/hooks/useLocation"
import { getAllShippingZones, canDeleteZone, getZoneRestrictionMessage } from "@/lib/geolocation"
import { getCurrencyList } from "@/lib/currencies"
import { 
  Store, 
  CreditCard, 
  Bell, 
  Shield, 
  Palette, 
  Truck, 
  Settings,
  Globe,
  Camera,
  Upload,
  Key,
  Save,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  Search,
  X,
  ChevronDown
} from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const { location, isLoading: locationLoading } = useLocation()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    currency: 'USD',
    acceptCreditCards: true,
    acceptPaypal: true,
    acceptApplePay: false,
    acceptGooglePay: false,
    multiCurrencySupport: false,
    notifyNewOrders: true,
    notifyLowStock: true,
    notifyCustomerMessages: true,
    notifyMarketingUpdates: false,
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30,
    theme: 'system',
    sidebarAutoCollapse: true,
    compactMode: false,
    domesticShippingRate: 5.99,
    internationalShippingRate: 15.99,
    freeShippingThreshold: 75.00,
    calculateShippingTax: true,
    shippingInsurance: false,
    gpt5PreviewEnabled: false,
  })

  // Shipping zone states
  const [shippingZones, setShippingZones] = useState<any[]>([])
  const [detectedZone, setDetectedZone] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<{show: boolean, zone: any}>({show: false, zone: null})
  const [deletingZone, setDeletingZone] = useState<string | null>(null)

  // Create zone modal states
  const [showCreateZoneModal, setShowCreateZoneModal] = useState(false)
  const [zoneStep, setZoneStep] = useState<'type' | 'country' | 'states' | 'rates'>('type')
  const [zoneType, setZoneType] = useState<'domestic' | 'international' | 'custom'>('domestic')
  const [zoneName, setZoneName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [shippingRate, setShippingRate] = useState(10.00)
  const [isRateFree, setIsRateFree] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Simulate loading settings - replace with actual API call
        const settings = {
          storeName: 'My Store',
          storeDescription: 'Store description',
          storeEmail: 'store@example.com',
          storePhone: '+1234567890',
          addressLine1: '123 Main St',
          addressLine2: '',
          city: 'City',
          state: 'State',
          zip: '12345',
          country: 'us',
          currency: 'USD',
          acceptCreditCards: true,
          acceptPaypal: true,
          acceptApplePay: false,
          acceptGooglePay: false,
          multiCurrencySupport: false,
          notifyNewOrders: true,
          notifyLowStock: true,
          notifyCustomerMessages: true,
          notifyMarketingUpdates: false,
          twoFactorAuth: false,
          loginNotifications: true,
          sessionTimeout: 30,
          theme: 'system',
          sidebarAutoCollapse: true,
          compactMode: false,
          domesticShippingRate: 5.99,
          internationalShippingRate: 15.99,
          freeShippingThreshold: 75.00,
          calculateShippingTax: true,
          shippingInsurance: false,
          gpt5PreviewEnabled: false,
        }
        
        setFormData(settings)
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Update detected zone when location is available
  useEffect(() => {
    if (location) {
      const zones = getAllShippingZones(location)
      const detected = zones.find(z => z.id === 'domestic') || zones[0]
      setDetectedZone(detected)
      setShippingZones(zones)
    }
  }, [location])

  const currencyOptions = getCurrencyList()

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleDeleteZone = async (zoneId: string, zoneName: string) => {
    const zone = shippingZones.find(z => z.id === zoneId)
    if (zone) {
      setShowDeleteDialog({show: true, zone})
    }
  }

  const confirmDeleteZone = async () => {
    const { zone } = showDeleteDialog
    if (!zone) return

    if (!canDeleteZone(zone.id)) {
      toast({
        title: "Cannot delete zone",
        description: getZoneRestrictionMessage(zone.id) || "This zone cannot be deleted.",
        variant: "destructive",
      })
      setShowDeleteDialog({show: false, zone: null})
      return
    }

    setDeletingZone(zone.id)
    try {
      setShippingZones(prev => prev.filter(z => z.id !== zone.id))
      toast({
        title: "Zone deleted",
        description: `${zone.name} shipping zone has been removed.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shipping zone. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingZone(null)
      setShowDeleteDialog({show: false, zone: null})
    }
  }

  const handleCreateZone = () => {
    setShowCreateZoneModal(true)
    setZoneStep('type')
    setZoneType('domestic')
    setZoneName('')
    setSelectedCountry('')
    setSelectedStates([])
    setShippingRate(10.00)
    setIsRateFree(false)
    setSearchQuery('')
  }

  // Country data with flags and states
  const countriesData: {[key: string]: {flag: string, states: string[]}} = {
    'United States': {
      flag: '🇺🇸',
      states: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
        'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
        'West Virginia', 'Wisconsin', 'Wyoming'
      ]
    },
    'Canada': {
      flag: '🇨🇦',
      states: [
        'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
        'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
        'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan',
        'Yukon'
      ]
    },
    'United Kingdom': {
      flag: '🇬🇧',
      states: ['England', 'Scotland', 'Wales', 'Northern Ireland']
    },
    'Australia': {
      flag: '🇦🇺',
      states: [
        'New South Wales', 'Victoria', 'Queensland', 'Western Australia',
        'South Australia', 'Tasmania', 'Northern Territory',
        'Australian Capital Territory'
      ]
    },
    'India': {
      flag: '🇮🇳',
      states: [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
        'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
        'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
        'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
        'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
      ]
    },
    'Germany': { flag: '🇩🇪', states: [] },
    'France': { flag: '🇫🇷', states: [] },
    'Italy': { flag: '🇮🇹', states: [] },
    'Spain': { flag: '🇪🇸', states: [] },
    'Netherlands': { flag: '🇳🇱', states: [] },
    'Brazil': { flag: '🇧🇷', states: [] },
    'Argentina': { flag: '🇦🇷', states: [] },
    'Mexico': { flag: '🇲🇽', states: [] },
    'Japan': { flag: '🇯🇵', states: [] },
    'South Korea': { flag: '🇰🇷', states: [] },
    'China': { flag: '🇨🇳', states: [] },
    'Russia': { flag: '🇷🇺', states: [] }
  }

  // Filter countries based on search
  const filteredCountries = Object.entries(countriesData).filter(([country]) =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle zone type selection
  const handleZoneTypeSelect = (type: 'domestic' | 'international' | 'custom') => {
    setZoneType(type)
    
    if (type === 'domestic' || type === 'international') {
      setZoneStep('rates')
      setZoneName(type === 'domestic' ? 'Domestic Shipping' : 'International Shipping')
    } else {
      setZoneStep('country')
    }
  }

  // Handle country selection
  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country)
    setSelectedStates([])
    
    if (countriesData[country] && countriesData[country].states.length > 0) {
      setZoneStep('states')
    } else {
      setZoneStep('rates')
    }
  }

  // Handle state selection
  const handleStateSelect = (state: string) => {
    setSelectedStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    )
  }

  // Select all states
  const handleSelectAllStates = () => {
    const countryStates = countriesData[selectedCountry]?.states || []
    setSelectedStates(countryStates)
  }

  // Clear all states
  const handleClearAllStates = () => {
    setSelectedStates([])
  }

  // Create the shipping zone
  const handleCreateShippingZone = () => {
    if (zoneType === 'custom' && (!zoneName || !selectedCountry)) {
      toast({
        title: "Missing information",
        description: "Please provide zone name and select a country.",
        variant: "destructive",
      })
      return
    }

    if (zoneType === 'custom' && countriesData[selectedCountry] && countriesData[selectedCountry].states.length > 0 && selectedStates.length === 0) {
      toast({
        title: "No states selected",
        description: "Please select at least one state for this shipping zone.",
        variant: "destructive",
      })
      return
    }

    // Create new zone
    const newZone = {
      id: `${zoneType}-${Date.now()}`,
      name: zoneName,
      type: zoneType,
      countries: zoneType === 'custom' ? [selectedCountry] : [zoneType],
      states: selectedStates,
      flag: zoneType === 'custom' ? (countriesData[selectedCountry]?.flag || '🌍') : 
            (zoneType === 'domestic' ? '🏠' : '🌍'),
      description: zoneType === 'custom' 
        ? `Custom zone for ${selectedCountry}${selectedStates.length > 0 ? ` (${selectedStates.length} states)` : ''}`
        : `${zoneType === 'domestic' ? 'Domestic' : 'International'} shipping zone`,
      rate: isRateFree ? 0 : shippingRate,
      isFree: isRateFree,
      delivery_time: zoneType === 'domestic' ? '2-5 business days' : 
                     zoneType === 'international' ? '7-14 business days' : '5-10 business days'
    }
    
    setShippingZones(prev => [...prev, newZone])
    setShowCreateZoneModal(false)
    
    toast({
      title: "Zone created",
      description: `${zoneName} has been created successfully.`,
    })
  }

  const handleSaveSection = async (sectionData: Partial<typeof formData>) => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Settings saved",
        description: "Section settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <PageHeader 
          title="Settings" 
          subtitle="Manage your store configuration and preferences"
        />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 lg:p-6 xl:p-8">
            <div className="text-center">Loading settings...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your store configuration and preferences"
        showSearch={true}
        showFilters={true}
      />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
          
          <Tabs defaultValue="shipping" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:block">General</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:block">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:block">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:block">Security</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:block">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:block">Shipping</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:block">AI</span>
              </TabsTrigger>
            </TabsList>

            {/* Shipping Settings */}
            <TabsContent value="shipping" className="space-y-6">
              <div className="grid gap-6">
                
                {/* Shipping Zones Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="h-5 w-5" />
                          Shipping Zones
                        </CardTitle>
                        <CardDescription>
                          Configure shipping rates for different regions
                        </CardDescription>
                      </div>
                      <Button onClick={handleCreateZone} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Zone
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {shippingZones.length === 0 ? (
                      <div className="text-center py-8">
                        <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No shipping zones configured
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Create your first shipping zone to start offering delivery options
                        </p>
                        <Button onClick={handleCreateZone} variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Zone
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {shippingZones.map((zone) => (
                          <div key={zone.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{zone.flag}</span>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{zone.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{zone.description}</p>
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  {zone.isFree ? 'Free shipping' : `$${zone.rate?.toFixed(2)}`} • {zone.delivery_time}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteZone(zone.id, zone.name)}
                                disabled={!canDeleteZone(zone.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>
            </TabsContent>

            {/* Placeholder tabs */}
            <TabsContent value="general">
              <div className="text-center py-8">
                <p className="text-gray-500">General settings content goes here</p>
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <div className="text-center py-8">
                <p className="text-gray-500">Payment settings content goes here</p>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="text-center py-8">
                <p className="text-gray-500">Notification settings content goes here</p>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="text-center py-8">
                <p className="text-gray-500">Security settings content goes here</p>
              </div>
            </TabsContent>

            <TabsContent value="appearance">
              <div className="text-center py-8">
                <p className="text-gray-500">Appearance settings content goes here</p>
              </div>
            </TabsContent>

            <TabsContent value="ai">
              <div className="text-center py-8">
                <p className="text-gray-500">AI settings content goes here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog.show && showDeleteDialog.zone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-red-600 dark:text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Shipping Zone
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Are you sure you want to delete the <strong>"{showDeleteDialog.zone.name}"</strong> shipping zone?
              </p>
              
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className="text-red-600 dark:text-red-400 mt-0.5">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog({show: false, zone: null})}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteZone}
                disabled={deletingZone === showDeleteDialog.zone?.id}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {deletingZone === showDeleteDialog.zone?.id ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Zone
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Zone Modal - Modern Step-by-Step UI */}
      {showCreateZoneModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create Shipping Zone
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {zoneStep === 'type' && 'Choose your zone type'}
                    {zoneStep === 'country' && 'Select a country'}
                    {zoneStep === 'states' && 'Choose states/provinces'}
                    {zoneStep === 'rates' && 'Set shipping rates'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCreateZoneModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              
              {/* Step 1: Zone Type Selection */}
              {zoneStep === 'type' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-6">Choose Zone Type</h4>
                  
                  <div className="grid gap-4">
                    {/* Domestic Shipping */}
                    <button
                      onClick={() => handleZoneTypeSelect('domestic')}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">🏠</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600">
                            Domestic Shipping
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Single rate for your home country
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            ${formData.domesticShippingRate.toFixed(2)} • Fast delivery
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* International Shipping */}
                    <button
                      onClick={() => handleZoneTypeSelect('international')}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">🌍</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600">
                            International Shipping
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Single rate for all other countries
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            ${formData.internationalShippingRate.toFixed(2)} • Global delivery
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Custom Zone */}
                    <button
                      onClick={() => handleZoneTypeSelect('custom')}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">🎯</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600">
                            Custom Zone
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Specific countries and states with custom rates
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                            Advanced configuration
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Country Selection (Custom only) */}
              {zoneStep === 'country' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">Select Country</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setZoneStep('type')}
                    >
                      ← Back
                    </Button>
                  </div>

                  {/* Zone Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="zone-name">Zone Name</Label>
                    <Input 
                      id="zone-name"
                      value={zoneName}
                      onChange={(e) => setZoneName(e.target.value)}
                      placeholder="e.g., Europe Premium Zone"
                    />
                  </div>

                  {/* Search Countries */}
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search countries..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Countries List */}
                  <div className="grid gap-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                    {filteredCountries.map(([country, data]) => (
                      <button
                        key={country}
                        onClick={() => handleCountrySelect(country)}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          selectedCountry === country
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{data.flag}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {country}
                          </span>
                          {data.states.length > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                              {data.states.length} states
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: State Selection */}
              {zoneStep === 'states' && selectedCountry && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Select States for {selectedCountry} {countriesData[selectedCountry]?.flag}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setZoneStep('country')}
                    >
                      ← Back
                    </Button>
                  </div>

                  {/* Select All/Clear All */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllStates}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllStates}
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* States List */}
                  <div className="grid gap-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                    {countriesData[selectedCountry]?.states?.map((state: string) => (
                      <button
                        key={state}
                        onClick={() => handleStateSelect(state)}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          selectedStates.includes(state)
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            selectedStates.includes(state)
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedStates.includes(state) && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {state}
                          </span>
                        </div>
                      </button>
                    )) || []}
                  </div>

                  {/* Proceed Button */}
                  {selectedStates.length > 0 && (
                    <Button
                      onClick={() => setZoneStep('rates')}
                      className="w-full"
                    >
                      Proceed to Rate Setting ({selectedStates.length} states)
                    </Button>
                  )}
                </div>
              )}

              {/* Step 4: Rate Setting */}
              {zoneStep === 'rates' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Set Shipping Rate
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setZoneStep(zoneType === 'custom' ? (countriesData[selectedCountry] && countriesData[selectedCountry].states.length > 0 ? 'states' : 'country') : 'type')}
                    >
                      ← Back
                    </Button>
                  </div>

                  {/* Zone Summary */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Zone Summary</h5>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div>Type: {zoneType === 'domestic' ? 'Domestic' : zoneType === 'international' ? 'International' : 'Custom'}</div>
                      {zoneType === 'custom' && (
                        <>
                          <div>Country: {selectedCountry} {countriesData[selectedCountry]?.flag}</div>
                          {selectedStates.length > 0 && (
                            <div>States: {selectedStates.length} selected</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Rate Type Selection */}
                  <div className="space-y-3">
                    <Label>Shipping Rate</Label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Fixed Rate */}
                      <button
                        onClick={() => setIsRateFree(false)}
                        className={`p-4 border-2 rounded-lg transition-all text-left ${
                          !isRateFree
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          Fixed Rate
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Charge a specific amount
                        </div>
                      </button>

                      {/* Free Shipping */}
                      <button
                        onClick={() => setIsRateFree(true)}
                        className={`p-4 border-2 rounded-lg transition-all text-left ${
                          isRateFree
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          Free Shipping
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          No shipping cost
                        </div>
                      </button>
                    </div>

                    {/* Rate Input */}
                    {!isRateFree && (
                      <div className="space-y-2">
                        <Label htmlFor="shipping-rate">Shipping Rate ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="shipping-rate"
                            type="number"
                            step="0.01"
                            value={shippingRate}
                            onChange={(e) => setShippingRate(parseFloat(e.target.value) || 0)}
                            className="pl-8"
                            placeholder="10.00"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {zoneStep === 'type' && 'Step 1 of 4'}
                {zoneStep === 'country' && 'Step 2 of 4'}
                {zoneStep === 'states' && 'Step 3 of 4'}
                {zoneStep === 'rates' && 'Step 4 of 4'}
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateZoneModal(false)}
                >
                  Cancel
                </Button>
                
                {zoneStep === 'rates' && (
                  <Button
                    onClick={handleCreateShippingZone}
                    disabled={
                      (zoneType === 'custom' && (!zoneName || !selectedCountry)) ||
                      (zoneType === 'custom' && countriesData[selectedCountry] && countriesData[selectedCountry].states.length > 0 && selectedStates.length === 0)
                    }
                  >
                    Create Zone
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
