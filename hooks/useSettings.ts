'use client';

import { useState, useEffect, useCallback } from 'react';

interface Settings {
  // Store Information
  currency: string;
  storeName?: string;
  storeDescription?: string;
  storeEmail?: string;
  storePhone?: string;
  
  // Business Address
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  
  // Payment Settings
  acceptCreditCards?: boolean;
  acceptPaypal?: boolean;
  acceptApplePay?: boolean;
  acceptGooglePay?: boolean;
  multiCurrencySupport?: boolean;
  
  // Notifications
  notifyNewOrders?: boolean;
  notifyLowStock?: boolean;
  notifyCustomerMessages?: boolean;
  notifyMarketingUpdates?: boolean;
  
  // Security
  twoFactorAuth?: boolean;
  loginNotifications?: boolean;
  sessionTimeout?: number;
  
  // Appearance
  theme?: string;
  sidebarAutoCollapse?: boolean;
  compactMode?: boolean;
  
  // Shipping
  domesticShippingRate?: number;
  internationalShippingRate?: number;
  freeShippingThreshold?: number;
  calculateShippingTax?: boolean;
  shippingInsurance?: boolean;
  
  // AI
  gpt5PreviewEnabled?: boolean;
}

// Global settings state
let globalSettings: Settings = {
  currency: 'USD',
};
let listeners: Set<() => void> = new Set();

// Function to notify all listeners
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Function to update global settings
export const updateGlobalSettings = (newSettings: Partial<Settings>) => {
  globalSettings = { ...globalSettings, ...newSettings };
  notifyListeners();
};

// Utility: read preferred currency from cookie (if any)
const getPreferredCurrencyFromCookie = (): string | null => {
  try {
    const match = document.cookie.match(/(?:^|; )preferred-currency=([^;]+)/);
    const captured = match && match[1] ? match[1] : null;
    return captured ? decodeURIComponent(captured) : null;
  } catch {
    return null;
  }
};

// Function to save user currency preference
export const saveUserCurrencyPreference = async (currency: string): Promise<boolean> => {
  try {
    // Save to server/cookie
    const response = await fetch('/api/currency/preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currency }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to save currency preference:', error);
    return false;
  }
};

// Function to fetch settings from API
const fetchSettings = async (): Promise<Settings> => {
  try {
    // Add timestamp to bust cache
    const response = await fetch(`/api/settings?t=${Date.now()}`);
    if (response.ok) {
      const data = await response.json();
      // Determine effective currency:
      // - If multi-currency is enabled AND user has a preferred cookie, use cookie
      // - Otherwise, use store currency from settings
      const storeCurrency = (data.currency as string) || 'USD';
      const multi = data.multiCurrencySupport === 'true';
      const cookieCurrency = multi ? getPreferredCurrencyFromCookie() : null;
      const effectiveCurrency = cookieCurrency || storeCurrency;
      const settings: Settings = {
        // Store Information
        currency: effectiveCurrency,
        storeName: data.storeName,
        storeDescription: data.storeDescription,
        storeEmail: data.storeEmail,
        storePhone: data.storePhone,
        
        // Business Address
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
        
        // Payment Settings
        acceptCreditCards: data.acceptCreditCards === 'true',
        acceptPaypal: data.acceptPaypal === 'true',
        acceptApplePay: data.acceptApplePay === 'true',
        acceptGooglePay: data.acceptGooglePay === 'true',
        multiCurrencySupport: data.multiCurrencySupport === 'true',
        
        // Notifications
        notifyNewOrders: data.notifyNewOrders === 'true',
        notifyLowStock: data.notifyLowStock === 'true',
        notifyCustomerMessages: data.notifyCustomerMessages === 'true',
        notifyMarketingUpdates: data.notifyMarketingUpdates === 'true',
        
        // Security
        twoFactorAuth: data.twoFactorAuth === 'true',
        loginNotifications: data.loginNotifications === 'true',
        sessionTimeout: data.sessionTimeout ? parseInt(data.sessionTimeout) : 30,
        
        // Appearance
        theme: data.theme || 'system',
        sidebarAutoCollapse: data.sidebarAutoCollapse === 'true',
        compactMode: data.compactMode === 'true',
        
        // Shipping
        domesticShippingRate: data.domesticShippingRate ? parseFloat(data.domesticShippingRate) : 5.99,
        internationalShippingRate: data.internationalShippingRate ? parseFloat(data.internationalShippingRate) : 15.99,
        freeShippingThreshold: data.freeShippingThreshold ? parseFloat(data.freeShippingThreshold) : 75.00,
        calculateShippingTax: data.calculateShippingTax === 'true',
        shippingInsurance: data.shippingInsurance === 'true',
        
        // AI
        gpt5PreviewEnabled: data.gpt5PreviewEnabled === 'true',
      };
      globalSettings = settings;
      return settings;
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }
  
  // Return minimal default settings
  return { 
    currency: 'USD',
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
    acceptCreditCards: false,
    acceptPaypal: false,
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
    domesticShippingRate: 0,
    internationalShippingRate: 0,
    freeShippingThreshold: 0,
    calculateShippingTax: false,
    shippingInsurance: false,
    gpt5PreviewEnabled: false,
  };
};

// Custom hook to use settings
export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(globalSettings);
  const [loading, setLoading] = useState(false);

  const refreshSettings = useCallback(async () => {
    setLoading(true);
    try {
      const newSettings = await fetchSettings();
      setSettings(newSettings);
      notifyListeners();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Always fetch settings on mount to ensure we have the latest data
    refreshSettings();

    // Subscribe to global settings changes
    const updateLocalSettings = () => {
      setSettings({ ...globalSettings });
    };

    listeners.add(updateLocalSettings);

    // Cleanup
    return () => {
      listeners.delete(updateLocalSettings);
    };
  }, [refreshSettings]);

  return {
    settings,
    loading,
    refreshSettings,
    currency: settings.currency,
  };
};

// Function to save settings (to be used in settings page)
export const saveSettings = async (newSettings: Partial<Settings>): Promise<boolean> => {
  try {
    // If currency is being changed, update user preference as well
    if (newSettings.currency) {
      await saveUserCurrencyPreference(newSettings.currency);
    }

    const processedSettings: Record<string, string> = {};
    
    // Convert all settings to strings for database storage
    Object.entries(newSettings).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'boolean') {
          processedSettings[key] = value ? 'true' : 'false';
        } else if (typeof value === 'number') {
          processedSettings[key] = value.toString();
        } else if (typeof value === 'string') {
          processedSettings[key] = value;
        }
      }
    });

    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processedSettings),
    });

    if (response.ok) {
      // Update global settings immediately
      updateGlobalSettings(newSettings);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};
