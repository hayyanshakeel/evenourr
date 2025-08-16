// Utility function to get store currency for server-side components
import prisma from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

export async function getStoreCurrency(): Promise<string> {
  try {
    // Ensure currency lookup is never cached between requests
    noStore();
    const currencySetting = await prisma.storeSetting.findUnique({
      where: { key: 'currency' }
    });
    return currencySetting?.value || 'USD';
  } catch (error) {
    console.error('Error fetching store currency:', error);
    return 'USD';
  }
}

// For client-side components, they should use the useSettings hook instead
