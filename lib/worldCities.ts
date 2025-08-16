// Major cities and populated areas around the world
// This creates a realistic distribution of dots representing population centers

export const worldCities = [
  // North America
  { name: 'New York', lat: 40.7128, lng: -74.0060, population: 8400000 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 4000000 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298, population: 2700000 },
  { name: 'Houston', lat: 29.7604, lng: -95.3698, population: 2300000 },
  { name: 'Phoenix', lat: 33.4484, lng: -112.0740, population: 1700000 },
  { name: 'Philadelphia', lat: 39.9526, lng: -75.1652, population: 1600000 },
  { name: 'San Antonio', lat: 29.4241, lng: -98.4936, population: 1500000 },
  { name: 'San Diego', lat: 32.7157, lng: -117.1611, population: 1400000 },
  { name: 'Dallas', lat: 32.7767, lng: -96.7970, population: 1300000 },
  { name: 'San Jose', lat: 37.3382, lng: -121.8863, population: 1000000 },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832, population: 2900000 },
  { name: 'Montreal', lat: 45.5017, lng: -73.5673, population: 1700000 },
  { name: 'Vancouver', lat: 49.2827, lng: -123.1207, population: 650000 },
  { name: 'Mexico City', lat: 19.4326, lng: -99.1332, population: 9200000 },
  { name: 'Guadalajara', lat: 20.6597, lng: -103.3496, population: 1500000 },

  // South America
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, population: 12300000 },
  { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, population: 6700000 },
  { name: 'Buenos Aires', lat: -34.6118, lng: -58.3960, population: 3000000 },
  { name: 'Lima', lat: -12.0464, lng: -77.0428, population: 10000000 },
  { name: 'Bogotá', lat: 4.7110, lng: -74.0721, population: 7400000 },
  { name: 'Santiago', lat: -33.4489, lng: -70.6693, population: 6200000 },
  { name: 'Caracas', lat: 10.4806, lng: -66.9036, population: 2900000 },
  { name: 'Salvador', lat: -12.9714, lng: -38.5014, population: 2900000 },
  { name: 'Brasília', lat: -15.8267, lng: -47.9218, population: 3100000 },

  // Europe
  { name: 'London', lat: 51.5074, lng: -0.1278, population: 9000000 },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050, population: 3700000 },
  { name: 'Madrid', lat: 40.4168, lng: -3.7038, population: 6600000 },
  { name: 'Rome', lat: 41.9028, lng: 12.4964, population: 2900000 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, population: 11000000 },
  { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, population: 870000 },
  { name: 'Vienna', lat: 48.2082, lng: 16.3738, population: 1900000 },
  { name: 'Stockholm', lat: 59.3293, lng: 18.0686, population: 980000 },
  { name: 'Copenhagen', lat: 55.6761, lng: 12.5683, population: 650000 },
  { name: 'Helsinki', lat: 60.1699, lng: 24.9384, population: 660000 },
  { name: 'Oslo', lat: 59.9139, lng: 10.7522, population: 700000 },
  { name: 'Warsaw', lat: 52.2297, lng: 21.0122, population: 1800000 },
  { name: 'Prague', lat: 50.0755, lng: 14.4378, population: 1300000 },
  { name: 'Budapest', lat: 47.4979, lng: 19.0402, population: 1800000 },
  { name: 'Zurich', lat: 47.3769, lng: 8.5417, population: 430000 },
  { name: 'Munich', lat: 48.1351, lng: 11.5820, population: 1500000 },
  { name: 'Milan', lat: 45.4642, lng: 9.1900, population: 1400000 },
  { name: 'Barcelona', lat: 41.3851, lng: 2.1734, population: 1600000 },
  { name: 'Lisbon', lat: 38.7223, lng: -9.1393, population: 550000 },

  // Asia
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, population: 38000000 },
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, population: 24000000 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, population: 21000000 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, population: 20000000 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025, population: 32000000 },
  { name: 'Dhaka', lat: 23.8103, lng: 90.4125, population: 22000000 },
  { name: 'Osaka', lat: 34.6937, lng: 135.5023, population: 19000000 },
  { name: 'Karachi', lat: 24.8607, lng: 67.0011, population: 16000000 },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784, population: 15000000 },
  { name: 'Chongqing', lat: 29.4316, lng: 106.9123, population: 32000000 },
  { name: 'Manila', lat: 14.5995, lng: 120.9842, population: 13000000 },
  { name: 'Tianjin', lat: 39.3434, lng: 117.3616, population: 14000000 },
  { name: 'Guangzhou', lat: 23.1291, lng: 113.2644, population: 14000000 },
  { name: 'Shenzhen', lat: 22.5431, lng: 114.0579, population: 13000000 },
  { name: 'Lahore', lat: 31.5204, lng: 74.3587, population: 11000000 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, population: 12000000 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, population: 11000000 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, population: 10000000 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, population: 8000000 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, population: 15000000 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, population: 7000000 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311, population: 6000000 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, population: 4000000 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, population: 3500000 },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319, population: 3200000 },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882, population: 2500000 },
  { name: 'Indore', lat: 22.7196, lng: 75.8577, population: 2200000 },
  { name: 'Thane', lat: 19.2183, lng: 72.9781, population: 1900000 },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126, population: 1800000 },
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, population: 1700000 },
  { name: 'Pimpri-Chinchwad', lat: 18.6298, lng: 73.7997, population: 1700000 },
  { name: 'Patna', lat: 25.5941, lng: 85.1376, population: 1700000 },
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812, population: 1700000 },
  { name: 'Ludhiana', lat: 30.9010, lng: 75.8573, population: 1600000 },
  { name: 'Agra', lat: 27.1767, lng: 78.0081, population: 1600000 },
  { name: 'Nashik', lat: 19.9975, lng: 73.7898, population: 1500000 },
  { name: 'Faridabad', lat: 28.4089, lng: 77.3178, population: 1400000 },
  { name: 'Meerut', lat: 28.9845, lng: 77.7064, population: 1400000 },
  { name: 'Rajkot', lat: 22.3039, lng: 70.8022, population: 1400000 },
  { name: 'Kalyan-Dombivali', lat: 19.2403, lng: 73.1305, population: 1200000 },
  { name: 'Vasai-Virar', lat: 19.4912, lng: 72.8054, population: 1200000 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739, population: 1200000 },
  { name: 'Srinagar', lat: 34.0837, lng: 74.7973, population: 1200000 },
  { name: 'Aurangabad', lat: 19.8762, lng: 75.3433, population: 1200000 },
  { name: 'Dhanbad', lat: 23.7957, lng: 86.4304, population: 1200000 },
  { name: 'Amritsar', lat: 31.6340, lng: 74.8723, population: 1200000 },
  { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297, population: 1100000 },
  { name: 'Allahabad', lat: 25.4358, lng: 81.8463, population: 1100000 },
  { name: 'Ranchi', lat: 23.3441, lng: 85.3096, population: 1100000 },
  { name: 'Howrah', lat: 22.5958, lng: 88.2636, population: 1100000 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, population: 1100000 },
  { name: 'Jabalpur', lat: 23.1815, lng: 79.9864, population: 1100000 },
  { name: 'Gwalior', lat: 26.2183, lng: 78.1828, population: 1100000 },
  { name: 'Vijayawada', lat: 16.5062, lng: 80.6480, population: 1000000 },
  { name: 'Jodhpur', lat: 26.2389, lng: 73.0243, population: 1000000 },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198, population: 1000000 },
  { name: 'Raipur', lat: 21.2514, lng: 81.6296, population: 1000000 },
  { name: 'Kota', lat: 25.2138, lng: 75.8648, population: 1000000 },

  // Southeast Asia
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456, population: 10700000 },
  { name: 'Bangkok', lat: 13.7563, lng: 100.5018, population: 10500000 },
  { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, population: 9000000 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, population: 5900000 },
  { name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869, population: 8000000 },
  { name: 'Hanoi', lat: 21.0285, lng: 105.8542, population: 8000000 },
  { name: 'Yangon', lat: 16.8661, lng: 96.1951, population: 5200000 },
  { name: 'Phnom Penh', lat: 11.5449, lng: 104.8922, population: 2000000 },
  { name: 'Vientiane', lat: 17.9757, lng: 102.6331, population: 950000 },

  // Middle East
  { name: 'Tehran', lat: 35.6892, lng: 51.3890, population: 9000000 },
  { name: 'Baghdad', lat: 33.3152, lng: 44.3661, population: 7000000 },
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753, population: 7000000 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, population: 3400000 },
  { name: 'Kuwait City', lat: 29.3759, lng: 47.9774, population: 3000000 },
  { name: 'Doha', lat: 25.2854, lng: 51.5310, population: 2400000 },
  { name: 'Amman', lat: 31.9454, lng: 35.9284, population: 2000000 },
  { name: 'Damascus', lat: 33.5138, lng: 36.2765, population: 1700000 },
  { name: 'Beirut', lat: 33.8938, lng: 35.5018, population: 2200000 },
  { name: 'Jerusalem', lat: 31.7683, lng: 35.2137, population: 950000 },
  { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, population: 4300000 },

  // Africa
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, population: 20900000 },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792, population: 15000000 },
  { name: 'Kinshasa', lat: -4.4419, lng: 15.2663, population: 15000000 },
  { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, population: 5600000 },
  { name: 'Luanda', lat: -8.8390, lng: 13.2894, population: 8300000 },
  { name: 'Dar es Salaam', lat: -6.7924, lng: 39.2083, population: 6700000 },
  { name: 'Khartoum', lat: 15.5007, lng: 32.5599, population: 5300000 },
  { name: 'Alexandria', lat: 31.2001, lng: 29.9187, population: 5200000 },
  { name: 'Abidjan', lat: 5.3600, lng: -4.0083, population: 5000000 },
  { name: 'Kano', lat: 12.0022, lng: 8.5920, population: 4100000 },
  { name: 'Cape Town', lat: -33.9249, lng: 18.4241, population: 4600000 },
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219, population: 4400000 },
  { name: 'Casablanca', lat: 33.5731, lng: -7.5898, population: 3700000 },
  { name: 'Addis Ababa', lat: 9.1450, lng: 40.4897, population: 3400000 },
  { name: 'Accra', lat: 5.6037, lng: -0.1870, population: 2300000 },
  { name: 'Dakar', lat: 14.7167, lng: -17.4677, population: 3100000 },
  { name: 'Maputo', lat: -25.9692, lng: 32.5732, population: 1200000 },
  { name: 'Harare', lat: -17.8252, lng: 31.0335, population: 1500000 },
  { name: 'Lusaka', lat: -15.3875, lng: 28.3228, population: 2500000 },
  { name: 'Kampala', lat: 0.3476, lng: 32.5825, population: 1700000 },

  // Oceania
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, population: 5300000 },
  { name: 'Melbourne', lat: -37.8136, lng: 144.9631, population: 5100000 },
  { name: 'Brisbane', lat: -27.4698, lng: 153.0251, population: 2500000 },
  { name: 'Perth', lat: -31.9505, lng: 115.8605, population: 2100000 },
  { name: 'Adelaide', lat: -34.9285, lng: 138.6007, population: 1400000 },
  { name: 'Auckland', lat: -36.8485, lng: 174.7633, population: 1700000 },
  { name: 'Wellington', lat: -41.2865, lng: 174.7762, population: 420000 },
  { name: 'Christchurch', lat: -43.5321, lng: 172.6362, population: 380000 },

  // Additional major cities in China
  { name: 'Wuhan', lat: 30.5928, lng: 114.3055, population: 11000000 },
  { name: 'Chengdu', lat: 30.5728, lng: 104.0668, population: 16000000 },
  { name: 'Nanjing', lat: 32.0603, lng: 118.7969, population: 8500000 },
  { name: 'Xian', lat: 34.3416, lng: 108.9398, population: 13000000 },
  { name: 'Hangzhou', lat: 30.2741, lng: 120.1551, population: 12000000 },
  { name: 'Shenyang', lat: 41.8057, lng: 123.4315, population: 8300000 },
  { name: 'Harbin', lat: 45.8038, lng: 126.5349, population: 5900000 },
  { name: 'Jinan', lat: 36.6512, lng: 117.1201, population: 9200000 },
  { name: 'Qingdao', lat: 36.0986, lng: 120.3719, population: 10000000 },
  { name: 'Dalian', lat: 38.9140, lng: 121.6147, population: 6900000 },

  // Russia
  { name: 'Moscow', lat: 55.7558, lng: 37.6176, population: 12500000 },
  { name: 'St. Petersburg', lat: 59.9311, lng: 30.3609, population: 5400000 },
  { name: 'Novosibirsk', lat: 55.0084, lng: 82.9357, population: 1600000 },
  { name: 'Yekaterinburg', lat: 56.8431, lng: 60.6454, population: 1500000 },
  { name: 'Nizhny Novgorod', lat: 56.2965, lng: 43.9361, population: 1300000 },
  { name: 'Kazan', lat: 55.8304, lng: 49.0661, population: 1300000 },
  { name: 'Chelyabinsk', lat: 55.1644, lng: 61.4368, population: 1200000 },
  { name: 'Omsk', lat: 54.9885, lng: 73.3242, population: 1200000 },
  { name: 'Samara', lat: 53.2001, lng: 50.1500, population: 1200000 },
  { name: 'Rostov-on-Don', lat: 47.2357, lng: 39.7015, population: 1100000 },
  { name: 'Ufa', lat: 54.7388, lng: 55.9721, population: 1100000 },
  { name: 'Krasnoyarsk', lat: 56.0184, lng: 92.8672, population: 1100000 },
  { name: 'Perm', lat: 58.0105, lng: 56.2502, population: 1000000 },
  { name: 'Voronezh', lat: 51.6720, lng: 39.1843, population: 1000000 },
  { name: 'Volgograd', lat: 48.7080, lng: 44.5133, population: 1000000 }
];

// Generate additional smaller cities/towns to fill out the globe
export function generateAdditionalCities(count: number = 500): Array<{name: string, lat: number, lng: number, population: number}> {
  const additionalCities = [];
  
  // Population density areas (higher chance of cities)
  const densityZones = [
    // Europe
    { centerLat: 50, centerLng: 10, radius: 15, density: 0.8 },
    // Eastern US
    { centerLat: 40, centerLng: -75, radius: 10, density: 0.7 },
    // Eastern China
    { centerLat: 35, centerLng: 115, radius: 15, density: 0.9 },
    // India
    { centerLat: 20, centerLng: 78, radius: 15, density: 0.8 },
    // Japan
    { centerLat: 36, centerLng: 138, radius: 8, density: 0.7 },
    // Java, Indonesia
    { centerLat: -7, centerLng: 110, radius: 8, density: 0.6 },
    // Nigeria
    { centerLat: 10, centerLng: 8, radius: 8, density: 0.5 },
    // Brazil Southeast
    { centerLat: -20, centerLng: -45, radius: 10, density: 0.6 },
  ];

  for (let i = 0; i < count; i++) {
    let lat, lng, population;
    
    // 60% chance to place near density zones, 40% random
    if (Math.random() < 0.6) {
      const zone = densityZones[Math.floor(Math.random() * densityZones.length)]!;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (zone?.radius ?? 10);
      
      lat = zone.centerLat + Math.sin(angle) * distance;
      lng = zone.centerLng + Math.cos(angle) * distance;
      population = Math.floor(Math.random() * 500000 + 50000) * (zone?.density ?? 0.5);
    } else {
      // Random placement, but avoid oceans
      lat = (Math.random() - 0.5) * 160; // -80 to 80 degrees
      lng = (Math.random() - 0.5) * 360; // -180 to 180 degrees
      population = Math.floor(Math.random() * 200000 + 10000);
    }
    
    // Clamp latitude
    lat = Math.max(-85, Math.min(85, lat));
    
    additionalCities.push({
      name: `City_${i}`,
      lat,
      lng,
      population
    });
  }
  
  return additionalCities;
}

export const allCities = [...worldCities, ...generateAdditionalCities(800)];
