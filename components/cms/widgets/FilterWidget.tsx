"use client";

import { useState } from "react";
import { Search as SearchIcon, Filter, SlidersHorizontal, Grid3X3, List, SortAsc, SortDesc, X, Plus, Trash2 } from "lucide-react";

export interface FilterItem {
  id: string;
  type: 'search' | 'filter' | 'sort' | 'view' | 'custom';
  label: string;
  icon?: string;
  active?: boolean;
}

export interface FilterConfig {
  layout: 'horizontal' | 'vertical';
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  padding: number;
  filters: FilterItem[];
  showSearch: boolean;
  showSort: boolean;
  showViewToggle: boolean;
  searchPlaceholder: string;
}

export function FilterWidgetEditor({ value, onChange }: { value: FilterConfig; onChange: (v: FilterConfig) => void }) {
  const [showIconLib, setShowIconLib] = useState(false);
  const [customIconText, setCustomIconText] = useState('');
  const [selectedColor, setSelectedColor] = useState('background');

  const colors = [
    '#000000', '#ffffff', '#f3f4f6', '#1f2937', '#374151',
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  const addFilter = (type: FilterItem['type'], label: string) => {
    const newFilter: FilterItem = {
      id: `${type}-${Date.now()}`,
      type,
      label,
      active: false
    };
    const next = { ...value, filters: [...value.filters, newFilter] };
    onChange(next);
  };

  const removeFilter = (id: string) => {
    const next = { ...value, filters: value.filters.filter(f => f.id !== id) };
    onChange(next);
  };

  const updateFilter = (id: string, updates: Partial<FilterItem>) => {
    const next = {
      ...value,
      filters: value.filters.map(f => f.id === id ? { ...f, ...updates } : f)
    };
    onChange(next);
  };

  const renderIcon = (type: string, icon?: string) => {
    if (icon) return <span className="text-sm">{icon}</span>;

    switch (type) {
      case 'search':
        return <SearchIcon className="h-4 w-4" />;
      case 'filter':
        return <Filter className="h-4 w-4" />;
      case 'sort':
        return <SlidersHorizontal className="h-4 w-4" />;
      case 'view':
        return <Grid3X3 className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Layout Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Layout</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onChange({ ...value, layout: 'horizontal' })}
            className={`px-3 py-2 rounded border text-xs ${
              value.layout === 'horizontal'
                ? 'border-blue-500 bg-blue-500/20 text-white'
                : 'border-[#2a2a30] bg-black text-gray-300'
            }`}
          >
            Horizontal
          </button>
          <button
            onClick={() => onChange({ ...value, layout: 'vertical' })}
            className={`px-3 py-2 rounded border text-xs ${
              value.layout === 'vertical'
                ? 'border-blue-500 bg-blue-500/20 text-white'
                : 'border-[#2a2a30] bg-black text-gray-300'
            }`}
          >
            Vertical
          </button>
        </div>
      </div>

      {/* Color Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Colors</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setSelectedColor('background')}
            className={`px-2 py-1 rounded text-xs ${
              selectedColor === 'background'
                ? 'bg-blue-500 text-white'
                : 'bg-[#2a2a30] text-gray-300'
            }`}
          >
            Background
          </button>
          <button
            onClick={() => setSelectedColor('text')}
            className={`px-2 py-1 rounded text-xs ${
              selectedColor === 'text'
                ? 'bg-blue-500 text-white'
                : 'bg-[#2a2a30] text-gray-300'
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setSelectedColor('border')}
            className={`px-2 py-1 rounded text-xs ${
              selectedColor === 'border'
                ? 'bg-blue-500 text-white'
                : 'bg-[#2a2a30] text-gray-300'
            }`}
          >
            Border
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => {
                if (selectedColor === 'background') {
                  onChange({ ...value, backgroundColor: color });
                } else if (selectedColor === 'text') {
                  onChange({ ...value, textColor: color });
                } else if (selectedColor === 'border') {
                  onChange({ ...value, borderColor: color });
                }
              }}
              className="w-8 h-8 rounded border-2 border-[#2a2a30]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Style Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Style</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Border Radius</label>
            <input
              type="range"
              min="0"
              max="20"
              value={value.borderRadius}
              onChange={(e) => onChange({ ...value, borderRadius: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{value.borderRadius}px</div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Padding</label>
            <input
              type="range"
              min="4"
              max="24"
              value={value.padding}
              onChange={(e) => onChange({ ...value, padding: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{value.padding}px</div>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Filter Options</h3>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={value.showSearch}
              onChange={(e) => onChange({ ...value, showSearch: e.target.checked })}
              className="w-4 h-4"
            />
            Show Search Bar
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={value.showSort}
              onChange={(e) => onChange({ ...value, showSort: e.target.checked })}
              className="w-4 h-4"
            />
            Show Sort Options
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={value.showViewToggle}
              onChange={(e) => onChange({ ...value, showViewToggle: e.target.checked })}
              className="w-4 h-4"
            />
            Show View Toggle
          </label>
        </div>

        {value.showSearch && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">Search Placeholder</label>
            <input
              type="text"
              value={value.searchPlaceholder}
              onChange={(e) => onChange({ ...value, searchPlaceholder: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1a1f] border border-[#2a2a30] rounded text-sm text-white"
              placeholder="Search products..."
            />
          </div>
        )}
      </div>

      {/* Add Filters */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Add Filters</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addFilter('filter', 'All')}
            className="px-3 py-2 bg-[#2a2a30] hover:bg-[#3a3a42] rounded text-xs text-white"
          >
            + All Filter
          </button>
          <button
            onClick={() => addFilter('filter', 'Category')}
            className="px-3 py-2 bg-[#2a2a30] hover:bg-[#3a3a42] rounded text-xs text-white"
          >
            + Category
          </button>
          <button
            onClick={() => addFilter('filter', 'Price')}
            className="px-3 py-2 bg-[#2a2a30] hover:bg-[#3a3a42] rounded text-xs text-white"
          >
            + Price
          </button>
          <button
            onClick={() => addFilter('filter', 'Brand')}
            className="px-3 py-2 bg-[#2a2a30] hover:bg-[#3a3a42] rounded text-xs text-white"
          >
            + Brand
          </button>
        </div>

        <button
          onClick={() => setShowIconLib(!showIconLib)}
          className="w-full px-3 py-2 bg-[#2a2a30] hover:bg-[#3a3a42] rounded text-xs text-white"
        >
          {showIconLib ? 'Hide' : 'Show'} Icon Library
        </button>

        {showIconLib && (
          <div className="rounded border border-[#2a2a30] bg-[#0f0f12] p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <input
                value={customIconText}
                onChange={(e) => setCustomIconText(e.target.value)}
                placeholder="Custom icon/text (emoji, 1-3 chars)"
                className="flex-1 px-2 py-1 rounded bg-black border border-[#2a2a30] text-white"
              />
              <button
                onClick={() => {
                  if (!customIconText) return;
                  addFilter('custom', customIconText);
                  setCustomIconText('');
                }}
                className="px-2 py-1 rounded bg-blue-600 text-white"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Current Filters */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Current Filters ({value.filters.length})</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {value.filters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between gap-2 px-3 py-2 bg-[#1a1a1f] border border-[#2a2a30] rounded"
            >
              <div className="flex items-center gap-2">
                {renderIcon(filter.type, filter.icon)}
                <input
                  type="text"
                  value={filter.label}
                  onChange={(e) => updateFilter(filter.id, { label: e.target.value })}
                  className="bg-transparent border-none text-sm text-white focus:outline-none"
                />
              </div>
              <button
                onClick={() => removeFilter(filter.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
