import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as unknown as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }
    const url = await uploadToCloudinary(file);
    if (!url) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
    return NextResponse.json({ url });
  } catch (err) {
    console.error('Upload API error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


