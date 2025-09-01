"use client";

import { useEffect, useState } from "react";
import { CmsLayoutData, CmsBlockType } from '@/lib/cms/schema';
import { DevicePreview } from '@/components/cms/DevicePreview';

// Default Category Page Preview Component
function DefaultCategoryPreview() {
  return (
    <div className="h-full w-full overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
        <span className="text-xl">←</span>
        <div className="flex-1 mx-4 text-center text-lg font-medium text-gray-800">Categories</div>
        <span className="text-xl">⋮</span>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-3 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 px-4 py-3 bg-white border-b border-gray-100 overflow-x-auto">
        {['All', 'Featured', 'New', 'Sale'].map((tab, index) => (
          <div
            key={tab}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors ${
              index === 0 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 p-4 grid-cols-2">
        {/* Product 1 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <span className="text-4xl">👔</span>
          </div>
          <div className="p-3">
            <div className="text-sm font-medium text-gray-800 mb-1">T-Shirt</div>
            <div className="text-xs text-gray-500 mb-2">Basic cotton tee</div>
            <div className="text-lg font-bold text-blue-600">$29.99</div>
          </div>
        </div>

        {/* Product 2 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <span className="text-4xl">👗</span>
          </div>
          <div className="p-3">
            <div className="text-sm font-medium text-gray-800 mb-1">Dress</div>
            <div className="text-xs text-gray-500 mb-2">Summer collection</div>
            <div className="text-lg font-bold text-blue-600">$49.99</div>
          </div>
        </div>

        {/* Product 3 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <span className="text-4xl">👟</span>
          </div>
          <div className="p-3">
            <div className="text-sm font-medium text-gray-800 mb-1">Sneakers</div>
            <div className="text-xs text-gray-500 mb-2">Comfortable fit</div>
            <div className="text-lg font-bold text-blue-600">$89.99</div>
          </div>
        </div>

        {/* Product 4 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <span className="text-4xl">🎒</span>
          </div>
          <div className="p-3">
            <div className="text-sm font-medium text-gray-800 mb-1">Backpack</div>
            <div className="text-xs text-gray-500 mb-2">Travel essential</div>
            <div className="text-lg font-bold text-blue-600">$39.99</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MainCanvasProps {
  setShowSeeAll: (show: boolean) => void;
  editorLayout?: any[];
  categoryLayoutActive?: boolean;
  currentPageType?: string;
  activePageId?: string;
}

// Main Canvas Component with Device Preview
export default function MainCanvas({ 
  setShowSeeAll, 
  viewport = 'mobile', 
  editorLayout = [], 
  categoryLayoutActive = false, 
  currentPageType = 'home',
  activePageId = 'home'
}: MainCanvasProps & { viewport?: 'mobile' | 'tablet' | 'desktop' }) {
  const [dims, setDims] = useState<{ width: number; height: number }>({ width: 300, height: 650 });
  const [pageComponents, setPageComponents] = useState<any[]>([]);
  const [layoutData, setLayoutData] = useState<CmsLayoutData | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    // Always make API calls for real data
    fetch('/api/cms/layouts/home')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled) return;
        const data = json?.data as CmsLayoutData | undefined;
        if (data && Array.isArray(data.blocks) && data.blocks.length > 0) {
          setLayoutData(data);
        } else {
          setLayoutData(null);
        }
      })
      .catch(() => setLayoutData(null));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const calc = () => {
      const headerReserve = 120; // Increased to account for CMS header and toolbar
      const verticalPadding = 40; // Increased padding for better spacing
      const availableH = Math.max(400, window.innerHeight - headerReserve - verticalPadding);
      const rightPanelW = 420; // fixed right panel
      const sidePadding = 48; // Increased side padding
      const availableW = Math.max(320, window.innerWidth - rightPanelW - sidePadding);
      
      // Use available space but ensure it doesn't overflow
      let height = Math.min(availableH - 40, Math.max(500, availableH * 0.85)); // Use 85% of available height max
      let width = Math.max(360, availableW - 40);
      
      // For mobile/tablet, maintain some aspect ratio but prioritize fitting in viewport
      if (viewport === 'mobile') {
        width = Math.min(width, Math.round(height * 0.6)); // max 0.6 aspect ratio for mobile
        height = Math.min(height, 700); // Cap mobile height
      } else if (viewport === 'tablet') {
        width = Math.min(width, Math.round(height * 0.8)); // max 0.8 aspect ratio for tablet
        height = Math.min(height, 800); // Cap tablet height
      } else {
        // Desktop - ensure it fits well
        height = Math.min(height, 900); // Cap desktop height
      }

      setDims({ width, height });
    };

    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [viewport]);

  const { width, height } = dims;

  // Convert editorLayout items into CmsLayoutData so preview uses the same renderer
  const editorAsLayout: CmsLayoutData = {
    version: 1,
    blocks: (editorLayout || []).map((it: any, idx: number) => ({
      id: `${(it.type || 'block')}-${idx}`,
      type: (it.type as CmsBlockType) || 'text',
      props: { ...(it || {}) }
    }))
  };

  return (
    <div
      className="flex-1 p-6 flex flex-col"
      style={{
        backgroundColor: '#000',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px, 24px 24px',
        backgroundPosition: '0 0, 0 0',
        minHeight: '100%'
      }}
    >
      {/* Top Bar removed: viewport now in header */}

      {/* Device Preview Container - Properly Sized */}
      <div className="flex-1 flex items-center justify-center overflow-hidden" style={{ padding: '20px' }}>
        <div className="relative" style={{ width, height, maxWidth: '100%', maxHeight: '100%' }}>
          {/* Device Screen - No frame, just the content */}
          <div 
            className="rounded-lg relative overflow-hidden shadow-lg" 
            style={{ 
              width, 
              height, 
              background: '#ffffff', 
              border: '1px solid rgba(0,0,0,0.1)',
              maxHeight: '100%'
            }}
          >
            <div className="h-full w-full overflow-hidden" style={{ background: '#ffffff' }}>
              {/* Show block-based preview for all page types including category */}
              <DevicePreview
                device={viewport}
                layout={editorLayout.length ? editorLayout : pageComponents}
                selectedElement={null}
                setSelectedElement={() => {}}
                isDragging={false}
                draggedElement={null}
                setLayout={setPageComponents}
                cmsLayout={editorAsLayout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
