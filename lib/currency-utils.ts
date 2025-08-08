// Utility function to get store currency for server-side components
import prisma from '@/lib/db';

export async function getStoreCurrency(): Promise<string> {
  try {
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
