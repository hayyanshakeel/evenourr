import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await request.json();
    console.log('PATCH request body:', body);

    // Map quantity to inventory if needed
    const updateData: any = { ...body };
    if (updateData.quantity !== undefined) {
      updateData.inventory = updateData.quantity;
      delete updateData.quantity;
    }

    // Update the product with only the provided fields
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    console.log('Product updated successfully:', updatedProduct);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid product ID.' }, { status: 400 });
    }

    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const inventory = parseInt(formData.get('inventory') as string, 10) || 0;
    const status = formData.get('status') as string;
    const slug = formData.get('slug') as string;
    
    // Parse categoryId
    let categoryId: number | null = null;
    const categoryIdRaw = formData.get('categoryId');
    if (categoryIdRaw && typeof categoryIdRaw === 'string' && categoryIdRaw !== '') {
      categoryId = parseInt(categoryIdRaw, 10);
      if (isNaN(categoryId)) categoryId = null;
    }

    console.log('Update form data received:', { 
      name, 
      price, 
      inventory, 
      status,
      slug,
      categoryId
    });

    if (!name || isNaN(price)) {
      return NextResponse.json({ error: 'Name and valid price are required' }, { status: 400 });
    }

    // Handle multiple image uploads
    const imageUrls: string[] = [];
    const images = formData.getAll('images') as File[];
    
    // Get existing images from form data
    const existingImagesStr = formData.get('existingImages') as string;
    const existingImages = existingImagesStr ? JSON.parse(existingImagesStr) : [];
    
    // Add existing images first
    imageUrls.push(...existingImages);
    
    // Add new images
    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i];
      if (imageFile && imageFile.size > 0) {
        console.log(`Uploading new image ${i} to Cloudinary...`);
        const { uploadToCloudinary } = await import('@/lib/cloudinary');
        const imageUrl = await uploadToCloudinary(imageFile);
        console.log(`Cloudinary upload result for image ${i}:`, imageUrl);
        
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      }
    }

    const updateData = {
      name,
      description: description || null,
      price,
      inventory,
      status: status || 'draft',
      slug,
      imageUrl: imageUrls[0] || null, // Use first image as main image
      categoryId: categoryId ?? undefined,
    };

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({
      ...updatedProduct,
      images: imageUrls
    });
  } catch (error) {
    console.error(`Error updating product:`, error);
    return NextResponse.json(
      { message: 'Something went wrong while updating the product.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid product ID.' }, { status: 400 });
    }
    const result = await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error deleting product:`, error);
    
    // Handle Prisma "not found" error
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }
    
    return NextResponse.json(
      { message: 'Something went wrong while deleting the product.' },
      { status: 500 }
    );
  }
}