import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
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
    if (!settingsObj.currency) {
      settingsObj.currency = 'USD';
    }
    
    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ currency: 'USD' });
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
