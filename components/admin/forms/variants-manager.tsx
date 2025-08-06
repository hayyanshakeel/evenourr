'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AutoComplete } from '@/components/ui/AutoComplete';
import { getSuggestions } from '@/lib/product-suggestions';

interface ProductOption {
  name: string;
  values: string[];
}

interface ProductVariant {
  id?: number;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  inventory: number;
  combinations: Record<string, string>; // e.g., { "Size": "Small", "Color": "Red" }
}

interface VariantsManagerProps {
  options: ProductOption[];
  variants: ProductVariant[];
  basePrice: number;
  onOptionsChange: (options: ProductOption[]) => void;
  onVariantsChange: (variants: ProductVariant[]) => void;
}

export default function VariantsManager({ 
  options, 
  variants, 
  basePrice, 
  onOptionsChange, 
  onVariantsChange 
}: VariantsManagerProps) {
  const [showVariants, setShowVariants] = useState(options.length > 0);

  // Generate all possible combinations
  const generateCombinations = (): Record<string, string>[] => {
    if (options.length === 0) return [];
    
    const combinations: Record<string, string>[] = [{}];
    
    for (const option of options) {
      const newCombinations: Record<string, string>[] = [];
      for (const combination of combinations) {
        for (const value of option.values) {
          newCombinations.push({
            ...combination,
            [option.name]: value
          });
        }
      }
      combinations.splice(0, combinations.length, ...newCombinations);
    }
    
    return combinations;
  };

  // Update variants when options change
  useEffect(() => {
    if (options.length === 0) {
      onVariantsChange([]);
      return;
    }

    const combinations = generateCombinations();
    const newVariants: ProductVariant[] = combinations.map((combination, index) => {
      const title = Object.values(combination).join(' / ');
      
      // Check if variant already exists
      const existingVariant = variants.find(v => v.title === title);
      
      return existingVariant || {
        title,
        price: basePrice,
        inventory: 0,
        combinations: combination
      };
    });
    
    onVariantsChange(newVariants);
  }, [options, basePrice]);

  const addOption = () => {
    const newOption: ProductOption = {
      name: '',
      values: ['']
    };
    onOptionsChange([...options, newOption]);
  };

  const updateOption = (index: number, field: 'name', value: string) => {
    const newOptions = [...options];
    const currentOption = newOptions[index];
    if (currentOption && field === 'name') {
      newOptions[index] = { ...currentOption, name: value };
      onOptionsChange(newOptions);
    }
  };

  const addOptionValue = (optionIndex: number) => {
    const newOptions = [...options];
    if (newOptions[optionIndex]) {
      newOptions[optionIndex].values.push('');
      onOptionsChange(newOptions);
    }
  };

  const updateOptionValue = (optionIndex: number, valueIndex: number, value: string) => {
    const newOptions = [...options];
    if (newOptions[optionIndex]) {
      newOptions[optionIndex].values[valueIndex] = value;
      onOptionsChange(newOptions);
    }
  };

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    const newOptions = [...options];
    if (newOptions[optionIndex]) {
      newOptions[optionIndex].values.splice(valueIndex, 1);
      onOptionsChange(newOptions);
    }
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onOptionsChange(newOptions);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    const currentVariant = newVariants[index];
    if (currentVariant) {
      newVariants[index] = { ...currentVariant, [field]: value };
      onVariantsChange(newVariants);
    }
  };

  const bulkUpdateVariants = (field: 'price' | 'inventory', value: number) => {
    const newVariants = variants.map(variant => ({
      ...variant,
      [field]: value
    }));
    onVariantsChange(newVariants);
  };

  if (!showVariants) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Add variants if this product has multiple options, like size or color.
          </p>
          <button
            type="button"
            onClick={() => setShowVariants(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add variants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
        <button
          type="button"
          onClick={() => {
            setShowVariants(false);
            onOptionsChange([]);
            onVariantsChange([]);
          }}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Remove variants
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Options Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900">Options</h4>
            <button
              type="button"
              onClick={addOption}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add option
            </button>
          </div>
          
          {options.map((option, optionIndex) => (
            <div key={optionIndex} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <AutoComplete
                  value={option.name}
                  onChange={(value) => updateOption(optionIndex, 'name', value)}
                  suggestions={['Color', 'Size', 'Material', 'Style', 'Fit', 'Length', 'Width', 'Pattern', 'Finish']}
                  placeholder="Option name (e.g., Size, Color)"
                  className="flex-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeOption(optionIndex)}
                  className="ml-2 p-1 text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {option.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="flex items-center space-x-2">
                    <AutoComplete
                      value={value}
                      onChange={(newValue) => updateOptionValue(optionIndex, valueIndex, newValue)}
                      suggestions={getSuggestions(option.name)}
                      placeholder="Option value"
                      className="flex-1 text-xs"
                    />
                    {option.values.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOptionValue(optionIndex, valueIndex)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOptionValue(optionIndex)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  + Add another value
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Variants Section */}
        {variants.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Variants ({variants.length})</h4>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const price = prompt('Set price for all variants:');
                    if (price && !isNaN(Number(price))) {
                      bulkUpdateVariants('price', Number(price));
                    }
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Bulk edit prices
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const inventory = prompt('Set inventory for all variants:');
                    if (inventory && !isNaN(Number(inventory))) {
                      bulkUpdateVariants('inventory', Number(inventory));
                    }
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Bulk edit inventory
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variant
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {variants.map((variant, index) => (
                    <tr key={index}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {variant.title}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={variant.sku || ''}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="SKU"
                        />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={variant.inventory}
                          onChange={(e) => updateVariant(index, 'inventory', Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
