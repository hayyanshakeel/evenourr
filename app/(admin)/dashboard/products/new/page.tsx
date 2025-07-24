'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function NewProductPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    costPerItem: '',
    trackQuantity: true,
    quantity: '',
    sku: '',
    barcode: '',
    weight: '',
    status: 'draft',
    vendor: '',
    productType: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    url: ''
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState([
    { option: 'Size', values: ['S', 'M', 'L'] },
    { option: 'Color', values: ['Red', 'Blue'] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.toString());
      });
      
      images.forEach((image, index) => {
        data.append(`image_${index}`, image);
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add product</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title and Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Short sleeve t-shirt"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    placeholder="Describe your product in a few words..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Customers will see this description on your product page.
                  </p>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Media</h3>
              </div>
              <div className="p-6">
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="w-full">
                  <label htmlFor="images" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <PhotoIcon className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 10MB each)</p>
                      </div>
                    </div>
                  </label>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-900 mb-2">
                      Compare at price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="compareAtPrice"
                        name="compareAtPrice"
                        value={formData.compareAtPrice}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="costPerItem" className="block text-sm font-medium text-gray-900 mb-2">
                    Cost per item
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="costPerItem"
                      name="costPerItem"
                      value={formData.costPerItem}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Customers won't see this
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Inventory</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center">
                  <input
                    id="trackQuantity"
                    name="trackQuantity"
                    type="checkbox"
                    checked={formData.trackQuantity}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="trackQuantity" className="ml-2 block text-sm text-gray-900">
                    Track quantity
                  </label>
                </div>

                {formData.trackQuantity && (
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-900 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-900 mb-2">
                      SKU (Stock Keeping Unit)
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="SKU"
                    />
                  </div>

                  <div>
                    <label htmlFor="barcode" className="block text-sm font-medium text-gray-900 mb-2">
                      Barcode (ISBN, UPC, GTIN, etc.)
                    </label>
                    <input
                      type="text"
                      id="barcode"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Barcode"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Variants</h3>
                <p className="text-sm text-gray-500 mt-1">Add options like size or color if this product comes in multiple variants.</p>
              </div>
              <div className="p-6 space-y-6">
                {variants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={variant.option}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          if (newVariants[index]) {
                            newVariants[index].option = e.target.value;
                            setVariants(newVariants);
                          }
                        }}
                        className="text-sm font-medium bg-transparent border-none focus:ring-0 p-0"
                        placeholder="Option name (e.g., Size, Color)"
                      />
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newVariants = variants.filter((_, i) => i !== index);
                            setVariants(newVariants);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">Option values</label>
                      <div className="flex flex-wrap gap-2">
                        {variant.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                if (newVariants[index]?.values) {
                                  newVariants[index].values[valueIndex] = e.target.value;
                                  setVariants(newVariants);
                                }
                              }}
                              className="bg-transparent border-none focus:ring-0 p-0 text-sm"
                              placeholder="Value"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newVariants = [...variants];
                                if (newVariants[index]?.values) {
                                  newVariants[index].values = newVariants[index].values.filter((_, i) => i !== valueIndex);
                                  setVariants(newVariants);
                                }
                              }}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newVariants = [...variants];
                            if (newVariants[index]?.values) {
                              newVariants[index].values.push('');
                              setVariants(newVariants);
                            }
                          }}
                          className="inline-flex items-center px-3 py-1 border border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-gray-400"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add value
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => setVariants([...variants, { option: '', values: [''] }])}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add another option
                </button>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Shipping</h3>
              </div>
              <div className="p-6">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-900 mb-2">
                    Weight
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0.0"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      lb
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Search engine listing</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add a title and description to see how this product might appear in a search engine listing
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-900 mb-2">
                    Page title
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Page title"
                  />
                </div>

                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-900 mb-2">
                    Meta description
                  </label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    placeholder="Meta description"
                  />
                </div>

                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-900 mb-2">
                    URL handle
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      https://yourstore.com/products/
                    </span>
                    <input
                      type="text"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-r-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="product-handle"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Product Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Product status</h3>
              </div>
              <div className="p-6">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Product Organization */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Product organization</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="productType" className="block text-sm font-medium text-gray-900 mb-2">
                    Product type
                  </label>
                  <input
                    type="text"
                    id="productType"
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="T-shirt"
                  />
                </div>

                <div>
                  <label htmlFor="vendor" className="block text-sm font-medium text-gray-900 mb-2">
                    Vendor
                  </label>
                  <input
                    type="text"
                    id="vendor"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Vendor name"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-900 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="summer, cotton, casual"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Separate tags with commas
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Save Button */}
        <div className="mt-6 lg:hidden">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save product'}
          </button>
        </div>
      </form>
    </div>
  );
}