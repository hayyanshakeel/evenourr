import { NextRequest } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

export const runtime = 'nodejs';

const GEO = [
  { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { city: 'Tokyo', country: 'Japan', lat: 35.6895, lng: 139.6917 },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  { city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET(req: NextRequest) {
  noStore();
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      let active = true;
      let timeoutId: NodeJS.Timeout | null = null;
      
      function send(obj: any) {
        if (!active) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
        } catch (error) {
          console.log('SSE connection closed, stopping stream');
          cleanup();
        }
      }
      
      function cleanup() {
        active = false;
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        try {
          controller.close();
        } catch (e) {
          // Controller might already be closed
        }
      }
      
      function loop() {
        if (!active) return;
        
        const item = GEO[randomInt(0, GEO.length - 1)];
        const revenue = randomInt(1000, 30000) / 100; // $10 - $300
        send({ ...item, revenue, currency: 'USD' });
        
        if (active) {
          const next = randomInt(2000, 5000);
          timeoutId = setTimeout(loop, next);
        }
      }
      
      // Send initial comment for SSE
      try {
        controller.enqueue(encoder.encode(`: SSE connection established\n\n`));
        loop();
      } catch (error) {
        cleanup();
      }
      
      // Handle client disconnect
      req.signal.addEventListener('abort', () => {
        console.log('SSE client disconnected');
        cleanup();
      });
    },
    
    cancel() {
      console.log('SSE stream cancelled');
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}


