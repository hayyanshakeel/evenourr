// lib/shiprocket/actions.ts

'use server';

// Simple in-memory cache for the auth token
let authToken = {
  token: '',
  expiresAt: 0
};

// 1. Function to get a valid authentication token
async function getShiprocketToken() {
  if (authToken.token && authToken.expiresAt > Date.now()) {
    return authToken.token;
  }
  const authUrl = 'https://apiv2.shiprocket.in/v1/external/auth/login';
  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_API_EMAIL,
        password: process.env.SHIPROCKET_API_PASSWORD
      })
    });
    if (!response.ok) {
      throw new Error('Failed to authenticate with Shiprocket');
    }
    const data = await response.json();
    authToken = {
      token: data.token,
      expiresAt: Date.now() + 10 * 24 * 60 * 60 * 1000
    };
    return authToken.token;
  } catch (error) {
    console.error('Shiprocket Authentication Error:', error);
    throw new Error('Could not get Shiprocket auth token.');
  }
}

// 2. Server Action to get the Estimated Delivery Date (EDD)
export async function getEstimatedDeliveryDate(
  deliveryPincode: string
): Promise<{ success: boolean; message: string; date: string }> {
  if (!/^\d{6}$/.test(deliveryPincode)) {
    return { success: false, message: 'Please enter a valid 6-digit pincode.', date: '' };
  }
  try {
    const token = await getShiprocketToken();
    const pickupPincode = process.env.SHIPROCKET_PICKUP_POSTCODE;
    const weight = '0.5';
    const serviceabilityUrl = new URL('https://apiv2.shiprocket.in/v1/external/courier/serviceability/');
    serviceabilityUrl.searchParams.append('pickup_postcode', pickupPincode!);
    serviceabilityUrl.searchParams.append('delivery_postcode', deliveryPincode);
    serviceabilityUrl.searchParams.append('weight', weight);
    serviceabilityUrl.searchParams.append('cod', '0');

    const response = await fetch(serviceabilityUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch serviceability');
    }
    const data = await response.json();

    if (data.status !== 200 || !data.data.available_courier_companies?.length) {
      return { success: false, message: 'Sorry, we do not ship to this pincode.', date: '' };
    }

    const earliestCourier = data.data.available_courier_companies.reduce((earliest: any, current: any) => {
      if (!current.etd) return earliest;
      const earliestDate = earliest.etd ? new Date(earliest.etd) : null;
      const currentDate = new Date(current.etd);
      return !earliestDate || currentDate < earliestDate ? current : earliest;
    }, {});

    if (!earliestCourier.etd) {
      return { success: false, message: 'Could not determine delivery date.', date: '' };
    }
    
    // FIX: Directly parse the date string (e.g., "Jul 23, 2025")
    // This format is well-supported by the JavaScript Date constructor.
    const reliableDate = new Date(earliestCourier.etd);
    
    // Check if the created date is valid before formatting
    if (!isNaN(reliableDate.getTime())) {
      const deliveryDate = reliableDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      return { success: true, message: 'Estimated delivery by', date: deliveryDate };
    }
    
    // Fallback if the date format is ever something else unexpected
    return { success: false, message: 'Could not parse delivery date.', date: '' };

  } catch (error) {
    console.error('Shiprocket EDD Error:', error);
    return { success: false, message: 'Could not check delivery date.', date: '' };
  }
}