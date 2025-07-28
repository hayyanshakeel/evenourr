'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function NewCollectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    handle: '',
    image: null as File | null,
    metaTitle: '',
    metaDescription: '',
    published: true,
    collectType: 'manual' as 'manual' | 'automated',
    conditions: [] as any[]
  });

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      handle: prev.handle || value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('handle', formData.handle);
      formDataToSubmit.append('metaTitle', formData.metaTitle);
      formDataToSubmit.append('metaDescription', formData.metaDescription);
      formDataToSubmit.append('published', formData.published.toString());
      formDataToSubmit.append('collectType', formData.collectType);
      
      if (formData.image) {
        formDataToSubmit.append('image', formData.image);
      }

      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          handle: formData.handle,
          description: formData.description,
          imageUrl: formData.image ? URL.createObjectURL(formData.image) : null,
          published: formData.published,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create collection');
      }

      const result = await response.json();
      console.log('Collection created:', result);
      
      router.push('/hatsadmin/dashboard/collections');
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create collection</h1>
          <p className="text-sm text-gray-500 mt-1">Collections help you organize your products and make it easier for customers to find them.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => router.push('/hatsadmin/dashboard/collections')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="collection-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create collection'}
          </button>
        </div>
      </div>

      <form id="collection-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Summer Collection"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe this collection..."
                  />
                </div>
              </div>
            </div>

            {/* Collection Type */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Collection type</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    id="manual"
                    type="radio"
                    value="manual"
                    checked={formData.collectType === 'manual'}
                    onChange={(e) => setFormData(prev => ({ ...prev, collectType: e.target.value as 'manual' }))}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="manual" className="block text-sm font-medium text-gray-900">
                      Manual
                    </label>
                    <p className="text-sm text-gray-500">Add products to this collection one by one.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <input
                    id="automated"
                    type="radio"
                    value="automated"
                    checked={formData.collectType === 'automated'}
                    onChange={(e) => setFormData(prev => ({ ...prev, collectType: e.target.value as 'automated' }))}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="automated" className="block text-sm font-medium text-gray-900">
                      Automated
                    </label>
                    <p className="text-sm text-gray-500">Products that match the conditions you set will automatically be added to this collection.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Search engine listing preview</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Page title
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={formData.title || 'Collection title'}
                  />
                </div>
                
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta description
                  </label>
                  <textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write a description..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>
                
                <div>
                  <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-1">
                    URL handle
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /collections/
                    </span>
                    <input
                      type="text"
                      id="handle"
                      value={formData.handle}
                      onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collection Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Collection image</h3>
              
              {formData.image ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Collection"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Upload image
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Visibility</h3>
              <div className="flex items-center">
                <input
                  id="published"
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="published" className="ml-2 text-sm text-gray-700">
                  Published
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This collection will be visible on your online store.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
