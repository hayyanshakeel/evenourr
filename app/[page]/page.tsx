// app/[page]/page.tsx

'use client';

// FIX: Import the 'notFound' function from Next.js
import { notFound } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// --- Type definitions and other imports remain the same ---
interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
}

interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  featuredImage: {
    url: string;
    altText: string;
  };
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

const mockProducts: Product[] = [
  { id: 'gid://shopify/Product/1', handle: 'classic-t-shirt', title: 'Classic T-Shirt', description: 'A comfortable and stylish t-shirt for everyday wear.', availableForSale: true, featuredImage: { url: 'https://placehold.co/600x600/f0f0f0/333?text=T-Shirt', altText: 'A classic white t-shirt.' }, variants: [{ id: '1a', title: 'Small', price: { amount: '25.00', currencyCode: 'USD' } }], priceRange: { minVariantPrice: { amount: '25.00', currencyCode: 'USD' } } },
  { id: 'gid://shopify/Product/2', handle: 'leather-boots', title: 'Leather Boots', description: 'Durable and fashionable leather boots.', availableForSale: true, featuredImage: { url: 'https://placehold.co/600x600/e0e0e0/333?text=Boots', altText: 'A pair of brown leather boots.' }, variants: [{ id: '2a', title: 'Size 10', price: { amount: '150.00', currencyCode: 'USD' } }], priceRange: { minVariantPrice: { amount: '150.00', currencyCode: 'USD' } } },
  { id: 'gid://shopify/Product/3', handle: 'denim-jacket', title: 'Denim Jacket', description: 'A timeless denim jacket.', availableForSale: false, featuredImage: { url: 'https://placehold.co/600x600/d0d0d0/333?text=Jacket', altText: 'A blue denim jacket.' }, variants: [{ id: '3a', title: 'Medium', price: { amount: '85.00', currencyCode: 'USD' } }], priceRange: { minVariantPrice: { amount: '85.00', currencyCode: 'USD' } } },
  { id: 'gid://shopify/Product/4', handle: 'sunglasses', title: 'Aviator Sunglasses', description: 'Stylish aviator sunglasses to protect your eyes.', availableForSale: true, featuredImage: { url: 'https://placehold.co/600x600/c0c0c0/333?text=Sunglasses', altText: 'A pair of aviator sunglasses.' }, variants: [{ id: '4a', title: 'One Size', price: { amount: '75.00', currencyCode: 'USD' } }], priceRange: { minVariantPrice: { amount: '75.00', currencyCode: 'USD' } } },
];

interface GridTileImageProps {
  product: Product;
  active: boolean;
}

const GridTileImage: React.FC<GridTileImageProps> = ({ product, active }) => {
  const imageUrl = product.featuredImage?.url || 'https://placehold.co/600x600/eee/ccc?text=No+Image';
  const imageAlt = product.featuredImage?.altText || 'Product Image';
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-lg border border-gray-200">
      <img src={imageUrl} alt={imageAlt} className={`h-full w-full object-cover transition-transform duration-300 ease-in-out ${active ? 'scale-110' : 'scale-100'}`} />
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 p-4 text-white backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:opacity-0">
        <h3 className="font-bold text-lg truncate">{product.title}</h3>
        <p className="text-sm">{product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</p>
      </div>
      {!product.availableForSale && (<div className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Sold Out</div>)}
    </div>
  );
};

interface ProductGridItemsProps {
  products: Product[];
}

const ProductGridItems: React.FC<ProductGridItemsProps> = ({ products }) => {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.handle} className="aspect-square cursor-pointer" onMouseEnter={() => setActiveProductId(product.id)} onMouseLeave={() => setActiveProductId(null)}>
          <GridTileImage product={product} active={activeProductId === product.id} />
        </div>
      ))}
    </div>
  );
};

// FIX: Change component to accept 'params' and check the route
export default function Page({ params }: { params: { page: string } }) {
  // If the URL is '/policy', this will trigger a 404 for this route,
  // allowing the correct app/policy/page.tsx to be loaded instead.
  if (params.page === 'policy') {
    notFound();
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = () => {
      setTimeout(() => {
        setProducts(mockProducts);
        setLoading(false);
      }, 500);
    };
    fetchProducts();
  }, []);

  // The rest of the component remains the same
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 text-center sm:mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Our Collection</h1>
          <p className="mt-4 text-lg text-gray-600">Find the perfect style for any occasion.</p>
        </header>
        <main>
          {loading ? (<div className="text-center text-gray-500"><p>Loading products...</p></div>) : (<ProductGridItems products={products} />)}
        </main>
      </div>
    </div>
  );
}