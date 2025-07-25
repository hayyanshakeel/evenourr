import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { productSchemas, validateInput, ValidationError } from '@/lib/security/validation';
import { v2 as cloudinary } from 'cloudinary';
import { firebaseAdminAuth } from '@/lib/firebase-admin';

// Updated to work with Prisma v6

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Middleware to verify Firebase ID token and map to local user
async function verifyFirebaseUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const idToken = authHeader?.split('Bearer ')[1];

  if (!idToken) {
    return { error: 'Unauthorized', status: 401 };
  }

  let decodedToken;
  try {
    decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
  } catch {
    return { error: 'Invalid token', status: 401 };
  }

  // Find or create user in local DB
  let user = await prisma.user.findUnique({ where: { email: decodedToken.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: decodedToken.email!,
        firstName: decodedToken.name?.split(' ')[0] || 'User',
        lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
        password: '', // Not used
        role: 'user',
        isActive: true,
        emailVerified: decodedToken.email_verified || false,
      },
    });
  }
  return { user };
}

// GET /api/admin/products - Get all products (Admin only)
export async function GET(request: NextRequest) {
  const result = await verifyFirebaseUser(request);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  const user = result.user;
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const queryData = {
      status: searchParams.get('status') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      search: searchParams.get('search') || undefined,
      categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined,
    };

    // Validate query parameters
    const validatedQuery = validateInput(productSchemas.query, queryData);

    // Build where clause
    const where: any = {};
    if (validatedQuery.status) {
      where.status = validatedQuery.status;
    }
    if (validatedQuery.search) {
      where.OR = [
        { name: { contains: validatedQuery.search } },
        { description: { contains: validatedQuery.search } },
        { slug: { contains: validatedQuery.search } },
      ];
    }
    if (validatedQuery.categoryId) {
      where.categoryId = validatedQuery.categoryId;
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true },
          },
          images: {
            select: { id: true, imageUrl: true, altText: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: validatedQuery.limit,
        skip: validatedQuery.offset,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        pages: Math.ceil(total / (validatedQuery.limit || 20)),
      },
    });

  } catch (error) {
    console.error('Products GET error:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product (Admin only)
export async function POST(request: NextRequest) {
  const result = await verifyFirebaseUser(request);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  const user = result.user;
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  try {
    // Parse form data
    const formData = await request.formData();
    // Extract and validate product data
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      price: parseFloat(formData.get('price') as string),
      inventory: parseInt(formData.get('inventory') as string) || 0,
      status: formData.get('status') as string || 'active',
      slug: formData.get('slug') as string,
      categoryId: formData.get('categoryId') ? parseInt(formData.get('categoryId') as string) : undefined,
    };
    // Validate product data
    const validatedProduct = validateInput(productSchemas.create, productData);
    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedProduct.slug },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      );
    }
    // Handle image uploads
    const imageUrls: string[] = [];
    const images = formData.getAll('images') as File[];
    for (const imageFile of images) {
      if (imageFile && imageFile.size > 0) {
        // Validate image file
        // (You may want to add more validation here)
        try {
          // Convert file to buffer
          const bytes = await imageFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          // Upload to Cloudinary
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'jsevenour',
                public_id: `${Date.now()}-${imageFile.name}`,
                transformation: [
                  { width: 1200, height: 1200, crop: 'limit' },
                  { quality: 'auto', fetch_format: 'auto' },
                ],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(buffer);
          });
          imageUrls.push((uploadResult as any).secure_url);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
          );
        }
      }
    }
    // Create product in database
    const product = await prisma.product.create({
      data: {
        ...validatedProduct,
        imageUrl: imageUrls[0] || null, // First image as main image
      },
    });
    // Create image records if any
    if (imageUrls.length > 0) {
      await prisma.productImage.createMany({
        data: imageUrls.map((url, index) => ({
          productId: product.id,
          imageUrl: url,
          altText: `${product.name} image ${index + 1}`,
          sortOrder: index,
        })),
      });
    }
    // Fetch complete product data
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: { select: { id: true, name: true } },
        images: { select: { id: true, imageUrl: true, altText: true } },
      },
    });
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: completeProduct,
    }, { status: 201 });
  } catch (error) {
    console.error('Product creation error:', error);
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Invalid product data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
