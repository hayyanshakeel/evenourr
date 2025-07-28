'use client';

import { useState, useEffect, useCallback } from 'react';

interface Settings {
  currency: string;
  storeName?: string;
  storeEmail?: string;
  timezone?: string;
  orderPrefix?: string;
  taxRate?: number;
  shippingRate?: number;
  freeShippingThreshold?: number;
}

// Global settings store
let globalSettings: Settings = { currency: 'USD' };
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

// Function to fetch settings from API
const fetchSettings = async (): Promise<Settings> => {
  try {
    const response = await fetch('/api/settings');
    if (response.ok) {
      const data = await response.json();
      const settings = {
        currency: data.currency || 'USD',
        storeName: data.storeName,
        storeEmail: data.storeEmail,
        timezone: data.timezone,
        orderPrefix: data.orderPrefix,
        taxRate: data.taxRate ? parseFloat(data.taxRate) : undefined,
        shippingRate: data.shippingRate ? parseFloat(data.shippingRate) : undefined,
        freeShippingThreshold: data.freeShippingThreshold ? parseFloat(data.freeShippingThreshold) : undefined,
      };
      globalSettings = settings;
      return settings;
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }
  return { currency: 'USD' };
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
    // Initial fetch if global settings is just default
    if (globalSettings.currency === 'USD' && !globalSettings.storeName) {
      refreshSettings();
    }

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
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newSettings,
        // Convert numbers to strings for storage
        taxRate: newSettings.taxRate?.toString(),
        shippingRate: newSettings.shippingRate?.toString(),
        freeShippingThreshold: newSettings.freeShippingThreshold?.toString(),
      }),
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
