import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import type { StoreSetting } from '@prisma/client';

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany();
    
    // Convert to key-value object
    const settingsObj = settings.reduce((acc: Record<string, string>, setting: StoreSetting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
    
    // Set defaults if not found
    const defaults = {
      currency: 'INR',
      storeName: 'JSEvenour Hats',
      storeDescription: 'Premium quality hats and accessories for every occasion',
      storeEmail: 'contact@jsevenourhats.com',
      storePhone: '+1 (555) 123-4567',
      addressLine1: '123 Fashion Street',
      addressLine2: 'Suite 100',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'us',
      acceptCreditCards: 'true',
      acceptPaypal: 'true',
      acceptApplePay: 'false',
      acceptGooglePay: 'false',
      multiCurrencySupport: 'false',
      notifyNewOrders: 'true',
      notifyLowStock: 'true',
      notifyCustomerMessages: 'true',
      notifyMarketingUpdates: 'false',
      twoFactorAuth: 'false',
      loginNotifications: 'true',
      sessionTimeout: '30',
      theme: 'system',
      sidebarAutoCollapse: 'true',
      compactMode: 'false',
      domesticShippingRate: '5.99',
      internationalShippingRate: '15.99',
      freeShippingThreshold: '75.00',
      calculateShippingTax: 'true',
      shippingInsurance: 'false',
      gpt5PreviewEnabled: 'false',
    };

    // Apply defaults for missing values
    Object.entries(defaults).forEach(([key, defaultValue]) => {
      if (settingsObj[key] === undefined) {
        settingsObj[key] = defaultValue;
      }
    });

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ currency: 'USD', gpt5PreviewEnabled: 'false' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Update or create each setting
    const updates = [];
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        updates.push(
          prisma.storeSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
          })
        );
      }
    }

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
