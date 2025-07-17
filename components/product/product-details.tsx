interface ProductDetailsProps {
  product: {
    title: string;
    description: string;
    featuredImage?: {
      url: string;
    };
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="max-w-3xl mx-auto p-6 border rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      {product.featuredImage?.url && (
        <img
          src={product.featuredImage.url}
          alt={product.title}
          className="mb-4 rounded-md w-full"
        />
      )}

      <p className="text-gray-700">{product.description}</p>
    </div>
  );
}