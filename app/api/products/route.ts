import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const limitNum = limit && !isNaN(Number(limit)) ? Number(limit) : 100;
    const offsetNum = offset && !isNaN(Number(offset)) ? Number(offset) : 0;

    let allProducts;
    if (status && ['draft', 'active', 'archived'].includes(status)) {
      allProducts = await prisma.product.findMany({
        where: { status },
        take: limitNum,
        skip: offsetNum
      });
    } else {
      allProducts = await prisma.product.findMany({
        take: limitNum,
        skip: offsetNum
      });
    }
    return NextResponse.json(allProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract all form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const compareAtPrice = formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice') as string) : null;
    const costPerItem = formData.get('costPerItem') ? parseFloat(formData.get('costPerItem') as string) : null;
    const trackQuantity = formData.get('trackQuantity') === 'true';
    const quantity = formData.get('quantity') ? parseInt(formData.get('quantity') as string, 10) : 0;
    const sku = formData.get('sku') as string;
    const barcode = formData.get('barcode') as string;
    const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : null;
    const status = formData.get('status') as string;
    const vendor = formData.get('vendor') as string;
    const productType = formData.get('productType') as string;
    const tags = formData.get('tags') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const url = formData.get('url') as string;

    console.log('Form data received:', { 
      title, 
      price, 
      quantity, 
      status,
      trackQuantity,
      vendor,
      productType,
      tags
    });

    if (!title || isNaN(price)) {
      return NextResponse.json({ error: 'Title and valid price are required' }, { status: 400 });
    }

    // Handle multiple image uploads
    const imageUrls: string[] = [];
    let imageIndex = 0;
    
    while (true) {
      const imageFile = formData.get(`image_${imageIndex}`) as File;
      if (!imageFile || imageFile.size === 0) break;
      
      console.log(`Uploading image ${imageIndex} to Cloudinary...`);
      const imageUrl = await uploadToCloudinary(imageFile);
      console.log(`Cloudinary upload result for image ${imageIndex}:`, imageUrl);
      
      if (imageUrl) {
        imageUrls.push(imageUrl);
      }
      imageIndex++;
    }

    // Generate slug from title
    const slug = (url || title).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    console.log('Creating product with data:', {
      name: title,
      description,
      price,
      inventory: quantity,
      status: status || 'draft',
      slug,
      imageUrl: imageUrls[0] || null, // Use first image as main image
      vendor,
      productType,
      tags,
      sku,
      barcode,
      weight,
      compareAtPrice,
      costPerItem,
      seoTitle,
      seoDescription,
      trackQuantity
    });

    const newProduct = await prisma.product.create({
      data: {
        name: title,
        description: description || null,
        price,
        inventory: trackQuantity ? quantity : 0,
        status: status || 'draft',
        slug,
        imageUrl: imageUrls[0] || null,
        // Note: Add these fields to your Prisma schema if you want to store them
        // vendor,
        // productType,
        // tags,
        // sku,
        // barcode,
        // weight,
        // compareAtPrice,
        // costPerItem,
        // seoTitle,
        // seoDescription,
        // trackQuantity
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}