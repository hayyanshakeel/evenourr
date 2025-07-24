import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid product ID.' }, { status: 400 });
    }
    const body = await req.json();
    const updateData = { ...body };
    if (updateData.price !== undefined && updateData.price !== null) {
      const priceAsNumber = parseFloat(updateData.price);
      if (isNaN(priceAsNumber)) {
        return NextResponse.json({ message: 'Invalid price format. Price must be a number.' }, { status: 400 });
      }
      updateData.price = priceAsNumber;
    }
    const updatedProduct = await prisma.products.update({
      where: { id },
      data: updateData
    });
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Error updating product ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Something went wrong while updating the product.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id:string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid product ID.' }, { status: 400 });
    }
    const result = await prisma.products.delete({ where: { id } });
    if (!result) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting product ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Something went wrong while deleting the product.' },
      { status: 500 }
    );
  }
}
