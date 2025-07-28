import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyFirebaseUser } from '@/lib/firebase-verify';

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

export async function POST(request: NextRequest) {
  try {
    // Temporarily removed authentication for testing
    // TODO: Re-enable authentication later

    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const inventory = parseInt(formData.get('inventory') as string, 10) || 0;
    const status = formData.get('status') as string;
    const slug = formData.get('slug') as string;

    console.log('Form data received:', { 
      name, 
      price, 
      inventory, 
      status,
      slug
    });

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }
    
    if (isNaN(price)) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }

    // Handle multiple image uploads
    const imageUrls: string[] = [];
    const images = formData.getAll('images') as File[];
    
    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i];
      if (imageFile && imageFile.size > 0) {
        console.log(`Uploading image ${i} to Cloudinary...`);
        const imageUrl = await uploadToCloudinary(imageFile);
        console.log(`Cloudinary upload result for image ${i}:`, imageUrl);
        
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      }
    }


    // Parse categoryId as integer if present
    let categoryId: number | null = null;
    const categoryIdRaw = formData.get('categoryId');
    if (categoryIdRaw && typeof categoryIdRaw === 'string' && categoryIdRaw !== '') {
      categoryId = parseInt(categoryIdRaw, 10);
      if (isNaN(categoryId)) categoryId = null;
    }

    console.log('Creating product with data:', {
      name,
      description,
      price,
      inventory,
      status: status || 'draft',
      slug,
      imageUrl: imageUrls[0] || null, // Use first image as main image
      imageUrls,
      categoryId
    });


    // Create product with categoryId if present
    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        inventory,
        status: status || 'draft',
        slug,
        imageUrl: imageUrls[0] || null, // Use first image as main image
        categoryId: categoryId ?? undefined,
      }
    });

    // For now, we'll store all image URLs in a simple way
    // Later we can enhance this to use the ProductImage model when types are updated
    console.log('Product created with images:', imageUrls);

    return NextResponse.json({
      ...newProduct,
      images: imageUrls
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}