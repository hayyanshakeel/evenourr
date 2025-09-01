"use client";

import { useRef, useState, useEffect } from "react";
import TopToolbar from "@/components/cms/TopToolbar";
import MainCanvas from "@/components/cms/MainCanvas";
import AddWidgetDrawer from "@/components/cms/modals/AddWidgetDrawer";

export default function CategoryDesignPage() {
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [editorLayoutItems, setEditorLayoutItems] = useState<any[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  const handleAddWidget = (item: { title: string; type: string }) => {
    let config = {};
    
    // Set default configuration based on block type
    if (item.type === 'filter') {
      config = {
        layout: 'horizontal',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        filters: [
          { id: 'all', type: 'filter', label: 'All', active: true },
          { id: 'category', type: 'filter', label: 'Category', active: false },
          { id: 'price', type: 'filter', label: 'Price', active: false }
        ],
        showSearch: true,
        showSort: true,
        showViewToggle: true,
        searchPlaceholder: 'Search products...'
      };
    } else if (item.type === 'header') {
      config = {
        placement: 'mobile',
        mobileCollapsed: false,
        left: [],
        center: [{ id: 'logo', type: 'logo', label: 'Logo' }],
        right: [
          { id: 'search', type: 'search', label: 'Search' },
          { id: 'cart', type: 'cart', label: 'Cart' }
        ],
        menuItems: []
      };
    }
    
    const newItem = {
      title: item.title,
      type: item.type,
      id: Date.now().toString(),
      config
    };
    setEditorLayoutItems([...editorLayoutItems, newItem]);
    setShowAddWidget(false);
  };

  const handleItemUpdate = (index: number, newConfig: any) => {
    const updated = [...editorLayoutItems];
    updated[index] = { ...updated[index], config: newConfig };
    setEditorLayoutItems(updated);
  };

  const handleDeleteItem = (index: number) => {
    const updated = editorLayoutItems.filter((_, i) => i !== index);
    setEditorLayoutItems(updated);
    if (activeItemIndex === index) {
      setActiveItemIndex(null);
    }
  };

  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    const updated = [...editorLayoutItems];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setEditorLayoutItems(updated);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2f3a]">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold text-white">Comerix - Category Design</div>
            <div className="text-sm text-gray-400">Build category page with blocks</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddWidget(true)}
              className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg text-sm font-medium text-white transition-colors"
            >
              + Add Block
            </button>
            <a href="/cms" className="px-4 py-2 bg-[#2a2a30] hover:bg-[#3a3a42] rounded-lg text-sm transition-colors">
              Back to CMS
            </a>
          </div>
        </div>

        {/* Top Toolbar */}
        <TopToolbar
          viewport={viewport}
          setViewport={setViewport}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex">
          <MainCanvas
            viewport={viewport}
            editorLayout={editorLayoutItems}
            currentPageType="category"
            setShowSeeAll={() => {}}
          />
        </div>
      </div>

      {/* Add Widget Panel */}
      {showAddWidget && (
        <AddWidgetDrawer
          onClose={() => setShowAddWidget(false)}
          onSelect={handleAddWidget}
          context="category"
        />
      )}

      {/* Right Panel */}
      <aside ref={asideRef} className="w-80 bg-black border-l border-[#2a2a30] flex flex-col">
        {activeItemIndex !== null && editorLayoutItems[activeItemIndex] ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-[#2a2a30]">
              <h3 className="text-sm font-medium text-white">
                {editorLayoutItems[activeItemIndex].title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Configure block settings</p>
            </div>
            <div className="p-4">
              {/* Block-specific settings would go here */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Block Title</label>
                  <input
                    type="text"
                    value={editorLayoutItems[activeItemIndex].title}
                    className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded px-3 py-2 text-sm text-white"
                    onChange={(e) => {
                      const updated = [...editorLayoutItems];
                      updated[activeItemIndex] = { ...updated[activeItemIndex], title: e.target.value };
                      setEditorLayoutItems(updated);
                    }}
                  />
                </div>

                {editorLayoutItems[activeItemIndex].type === 'text' && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Content</label>
                    <textarea
                      rows={4}
                      placeholder="Enter text content"
                      className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded px-3 py-2 text-sm text-white placeholder-gray-500"
                    />
                  </div>
                )}

                {editorLayoutItems[activeItemIndex].type === 'header' && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Header Style</label>
                      <select className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded px-3 py-2 text-sm text-white">
                        <option value="simple">Simple</option>
                        <option value="centered">Centered</option>
                        <option value="split">Split Layout</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input type="checkbox" className="w-4 h-4" />
                        Show search bar
                      </label>
                    </div>
                  </>
                )}

                {editorLayoutItems[activeItemIndex].type === 'horizontalProducts' && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Products per Row</label>
                      <select className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded px-3 py-2 text-sm text-white">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        Show product filters
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        Enable sorting options
                      </label>
                    </div>
                  </>
                )}

                {editorLayoutItems[activeItemIndex].type === 'filter' && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Layout</label>
                      <select 
                        className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded px-3 py-2 text-sm text-white"
                        value={editorLayoutItems[activeItemIndex].config?.layout || 'horizontal'}
                        onChange={(e) => {
                          const updated = [...editorLayoutItems];
                          updated[activeItemIndex] = {
                            ...updated[activeItemIndex],
                            config: { ...updated[activeItemIndex].config, layout: e.target.value }
                          };
                          setEditorLayoutItems(updated);
                        }}
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">Background</label>
                        <input 
                          type="color" 
                          value={editorLayoutItems[activeItemIndex].config?.backgroundColor || '#ffffff'}
                          onChange={(e) => {
                            const updated = [...editorLayoutItems];
                            updated[activeItemIndex] = {
                              ...updated[activeItemIndex],
                              config: { ...updated[activeItemIndex].config, backgroundColor: e.target.value }
                            };
                            setEditorLayoutItems(updated);
                          }}
                          className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded px-3 py-2 text-sm text-white h-9"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">Text Color</label>
                        <input 
                          type="color" 
                          value={editorLayoutItems[activeItemIndex].config?.textColor || '#000000'}
                          onChange={(e) => {
                            const updated = [...editorLayoutItems];
                            updated[activeItemIndex] = {
                              ...updated[activeItemIndex],
                              config: { ...updated[activeItemIndex].config, textColor: e.target.value }
                            };
                            setEditorLayoutItems(updated);
                          }}
                          className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded px-3 py-2 text-sm text-white h-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input 
                          type="checkbox" 
                          checked={editorLayoutItems[activeItemIndex].config?.showSearch || false}
                          onChange={(e) => {
                            const updated = [...editorLayoutItems];
                            updated[activeItemIndex] = {
                              ...updated[activeItemIndex],
                              config: { ...updated[activeItemIndex].config, showSearch: e.target.checked }
                            };
                            setEditorLayoutItems(updated);
                          }}
                          className="w-4 h-4" 
                        />
                        Show search bar
                      </label>
                      
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input 
                          type="checkbox" 
                          checked={editorLayoutItems[activeItemIndex].config?.showSort || false}
                          onChange={(e) => {
                            const updated = [...editorLayoutItems];
                            updated[activeItemIndex] = {
                              ...updated[activeItemIndex],
                              config: { ...updated[activeItemIndex].config, showSort: e.target.checked }
                            };
                            setEditorLayoutItems(updated);
                          }}
                          className="w-4 h-4" 
                        />
                        Show sort options
                      </label>
                      
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input 
                          type="checkbox" 
                          checked={editorLayoutItems[activeItemIndex].config?.showViewToggle || false}
                          onChange={(e) => {
                            const updated = [...editorLayoutItems];
                            updated[activeItemIndex] = {
                              ...updated[activeItemIndex],
                              config: { ...updated[activeItemIndex].config, showViewToggle: e.target.checked }
                            };
                            setEditorLayoutItems(updated);
                          }}
                          className="w-4 h-4" 
                        />
                        Show view toggle
                      </label>
                    </div>
                    
                    {editorLayoutItems[activeItemIndex].config?.showSearch && (
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">Search Placeholder</label>
                        <input
                          type="text"
                          value={editorLayoutItems[activeItemIndex].config?.searchPlaceholder || 'Search products...'}
                          onChange={(e) => {
                            const updated = [...editorLayoutItems];
                            updated[activeItemIndex] = {
                              ...updated[activeItemIndex],
                              config: { ...updated[activeItemIndex].config, searchPlaceholder: e.target.value }
                            };
                            setEditorLayoutItems(updated);
                          }}
                          className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded px-3 py-2 text-sm text-white"
                          placeholder="Search products..."
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-[#2a2a30] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <p className="text-sm">Select a block to configure</p>
              <p className="text-xs text-gray-500 mt-1">Add blocks using the + Add Block button</p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
