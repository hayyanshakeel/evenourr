"use client";

import React, { useEffect, useState } from "react";
import AddWidgetDrawer from "@/components/cms/modals/AddWidgetDrawer";
import HeaderOverviewPanel from "@/components/cms/panels/HeaderOverviewPanel";
// import WidgetSettingsDrawer, { WidgetConfig } from "@/components/cms/modals/WidgetSettingsDrawer";
type WidgetConfig = any;

// Import all the icon components we'll need
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const LayersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 2,7 12,12 22,7 12,2" />
    <polyline points="2,17 12,22 22,17" />
    <polyline points="2,12 12,17 22,12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </svg>
);

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  </svg>
);

const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const HeaderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="4" rx="2" />
    <rect x="3" y="10" width="12" height="2" rx="1" />
  </svg>
);

const FooterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="16" width="18" height="4" rx="2" />
    <rect x="3" y="12" width="12" height="2" rx="1" />
  </svg>
);

const ScrollIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5,3 19,12 5,21 5,3" />
  </svg>
);

const CategoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

type RightView = 'builder' | 'search' | 'cart' | 'listBlog' | 'page' | 'header' | 'footer' | 'category';

interface RightPanelProps {
  asideRef: React.RefObject<HTMLDivElement>;
  rightView: RightView;
  setRightView: (view: RightView) => void;
  viewport?: 'mobile' | 'tablet' | 'desktop';
  onLayoutChange?: (items: Array<{ title: string; type: string; subtitle?: string; badge?: string }>) => void;
  onCategoryLayoutChange?: (layoutName: string, layoutData: any) => void;
}

export default function RightPanel({ asideRef, rightView, setRightView, viewport = 'mobile', onLayoutChange, onCategoryLayoutChange }: RightPanelProps) {
  const [pages, setPages] = useState<Array<{ id: string; name: string; thumbnail?: string; type?: string; isAdd?: boolean }>>([
    { 
      id: 'home', 
      name: 'Home', 
      type: 'home',
      thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23f3f4f6"/><circle cx="20" cy="20" r="8" fill="%236366f1"/><rect x="35" y="15" width="70" height="3" rx="1" fill="%23d1d5db"/><rect x="35" y="22" width="50" height="3" rx="1" fill="%23d1d5db"/><rect x="15" y="35" width="90" height="35" rx="4" fill="%23e5e7eb"/></svg>' 
    },
    {
      id: 'add',
      name: 'Add',
      isAdd: true
    }
  ]);
  const [activePageId, setActivePageId] = useState<string>('home');
  
  // Helper to generate a unique page id like "page-1", "page-2", ... without collisions
  const generateUniquePageId = (existing: Array<{ id: string; isAdd?: boolean }>) => {
    const used = new Set<number>();
    for (const p of existing) {
      const m = /^page-(\d+)$/.exec(p.id);
      if (m) used.add(Number(m[1]));
    }
    let n = 1;
    while (used.has(n)) n++;
    return `page-${n}`;
  };
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after component mounts
  useEffect(() => {
    try {
      const savedPageId = localStorage.getItem('cmsActivePageId');
      const savedPages = localStorage.getItem('cmsPages');
      
      if (savedPageId) {
        setActivePageId(savedPageId);
      }
      
      if (savedPages) {
        const parsedPages = JSON.parse(savedPages);
        // Filter out any existing 'add' pages to avoid duplicates
        const pagesWithoutAdd = (parsedPages as any[]).filter((p: any) => !p.isAdd);
        // Deduplicate by id to avoid duplicate keys
        const uniqueByIdMap = new Map<string, any>();
        for (const p of pagesWithoutAdd) {
          if (p && typeof p.id === 'string' && !uniqueByIdMap.has(p.id)) {
            uniqueByIdMap.set(p.id, p);
          }
        }
        const uniquePages = Array.from(uniqueByIdMap.values());
        const pagesWithAdd = [...uniquePages, { id: 'add', name: 'Add', isAdd: true }];
        setPages(pagesWithAdd);
      }
    } catch {}
    setIsHydrated(true);
  }, []);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [showAddWidget, setShowAddWidget] = useState<boolean>(false);



  // Store layouts for pages
  const [pageLayouts, setPageLayouts] = useState<Record<string, Array<{ title: string; type: string; subtitle?: string; badge?: string }>>>({
    'home': []
  });
  const [selectedWidgetIdx, setSelectedWidgetIdx] = useState<number | null>(null);
  // Make header config nullable so we can delay rendering until hydrated
  const [headerNavConfig, setHeaderNavConfig] = useState<any | null>(null);
  // Track when localStorage has been read
  const [layoutLoaded, setLayoutLoaded] = useState(false);

  // Get current page layout
  const currentPageLayout = pageLayouts[activePageId] || [];
  
  // Set current page layout
  const setCurrentPageLayout = (items: Array<{ title: string; type: string; subtitle?: string; badge?: string }>) => {
    setPageLayouts(prev => ({
      ...prev,
      [activePageId]: items
    }));
  };

  // Define the header onChange callback at the top level to avoid conditional hooks
  const sanitizeForLayout = (input: any): any => {
    if (input == null) return input;
    if (React.isValidElement(input)) {
      // Strip React elements when persisting into layout/renderer props
      return undefined as any;
    }
    if (Array.isArray(input)) {
      return input.map(sanitizeForLayout);
    }
    if (typeof input === 'object' && input !== null) {
      const out: any = Array.isArray(input) ? [] : {};
      for (const key of Object.keys(input)) {
        const val = (input as any)[key];
        if (key === 'icon' && React.isValidElement(val)) {
          // Drop visual-only icon nodes from config propagated to renderer
          continue;
        }
        out[key] = sanitizeForLayout(val);
      }
      return out;
    }
    return input;
  };

  const handleHeaderChange = React.useCallback((v: any) => {
    console.log('HeaderOverviewPanel onChange:', v);
    setHeaderNavConfig(v);
    // Update the header item in currentPageLayout with the new config
    setPageLayouts(prev => {
      const currentLayout = prev[activePageId];
      const safeLayout = Array.isArray(currentLayout) ? currentLayout : [];
      return {
        ...prev,
        [activePageId]: safeLayout.map((it: any) => 
          it.type === 'header' ? { 
            ...it, 
            // Persist a sanitized config (no React nodes) to the layout used by the renderer
            headerNav: sanitizeForLayout({
              ...it.headerNav,
              ...v
            })
          } : it
        )
      };
    });
    // Bridge to Renderer via localStorage event to force refresh
    try {
      localStorage.setItem('cmsHeaderState', JSON.stringify(sanitizeForLayout(v)));
      window.dispatchEvent(new Event('cmsHeaderStateChanged'));
    } catch {}
  }, [activePageId]);

  // Ensure Header section opens and persists when switching to 'header' view
  useEffect(() => {
    if (rightView !== 'header' || !layoutLoaded) return;
    const existingIdx = currentPageLayout.findIndex((it) => it.type === 'header');
    if (existingIdx >= 0) {
      setSelectedWidgetIdx(existingIdx);
      const existingHeader = (currentPageLayout as any)[existingIdx];
      if (existingHeader?.headerNav) {
        setHeaderNavConfig(existingHeader.headerNav);
      } else {
        setHeaderNavConfig({});
      }
      return;
    }
    // No header found after layout has loaded — create a default one
    const defaultHeader = {
        title: 'Header',
        type: 'header',
        headerNav: {
          placement: 'both',
          mobileCollapsed: true,
          left: [{ id: 'logo-1', type: 'logo', label: 'Logo' }],
          center: [],
          right: [
            { id: 'cart-1', type: 'cart', label: 'Cart' },
            { id: 'profile-1', type: 'profile', label: 'Profile' },
          ],
          menuItems: [
            { id: 'm1', label: 'Shop', href: '/shop' },
            { id: 'm2', label: 'About', href: '/about' },
          ],
          brandText: '',
          enableAppBar: true,
          alwaysShowAppBar: true,
          backgroundColor: '#ffffff',
          elevation: 0,
          pinned: true,
        },
      } as any;
      
    setPageLayouts(prev => ({
      ...prev,
      [activePageId]: [...currentPageLayout, defaultHeader]
    }));
    setSelectedWidgetIdx(currentPageLayout.length);
    setHeaderNavConfig(defaultHeader.headerNav);
  }, [rightView, layoutLoaded, activePageId, currentPageLayout]);

  // Notify parent about layout changes (but not on initial render)
  useEffect(() => {
    if (currentPageLayout.length > 0) {
      onLayoutChange?.(currentPageLayout);
    }
  }, [currentPageLayout, onLayoutChange]);

  // Persist Page Layouts to localStorage (hydrate on mount)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cmsPageLayouts');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPageLayouts(parsed);
      }
    } catch {}
    
    // Also load header configuration and sync it after layouts are loaded
    try {
      const headerState = localStorage.getItem('cmsHeaderState');
      if (headerState) {
        const parsed = JSON.parse(headerState);
        setHeaderNavConfig(parsed);
      }
    } catch {}
    
    // Mark that we've attempted to load from storage (even if nothing was there)
    setLayoutLoaded(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cmsPageLayouts', JSON.stringify(pageLayouts));
    } catch {}
    onLayoutChange?.(currentPageLayout);
  }, [pageLayouts, currentPageLayout, onLayoutChange]);

  // Persist pages to localStorage
  useEffect(() => {
    try {
      // Only save non-add pages to prevent duplicate "add" pages on hydration
      const pagesForStorage = pages.filter(p => !p.isAdd);
      localStorage.setItem('cmsPages', JSON.stringify(pagesForStorage));
    } catch {}
  }, [pages]);

  // Persist active page ID to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cmsActivePageId', activePageId);
    } catch {}
  }, [activePageId]);

  // One-time sync: Load header config into page layout after initial load
  useEffect(() => {
    if (!layoutLoaded || !headerNavConfig) return;
    
    // Only sync once after loading from localStorage
    const currentLayout = pageLayouts[activePageId] || [];
    const headerIdx = currentLayout.findIndex(it => it.type === 'header');
    
    if (headerIdx < 0) {
      // Add header with loaded config if it doesn't exist
      const newLayout = [...currentLayout, { 
        title: 'Header', 
        type: 'header', 
        headerNav: headerNavConfig 
      }];
      setPageLayouts(prev => ({
        ...prev,
        [activePageId]: newLayout
      }));
    }
    
    // Clear the loaded header config after syncing to prevent re-runs
    // We'll rely on pageLayouts as the source of truth from now on
  }, [layoutLoaded, headerNavConfig, activePageId]);

  // Sync pageLayouts to headerNavConfig for UI (read-only sync)
  useEffect(() => {
    if (!layoutLoaded || rightView !== 'header') return;
    const idx = currentPageLayout.findIndex((it) => it.type === 'header');
    if (idx >= 0) {
      const cfg = (currentPageLayout as any)[idx]?.headerNav ?? null;
      setSelectedWidgetIdx(idx);
      // Only update if actually different to prevent unnecessary re-renders
      if (cfg && JSON.stringify(cfg) !== JSON.stringify(headerNavConfig)) {
        setHeaderNavConfig(cfg);
      }
    }
  }, [currentPageLayout, rightView, layoutLoaded]); // Removed headerNavConfig to prevent circular dependency

  const addPage = () => {
    // Create a simple blank page with just header
    const pagesWithoutAdd = pages.filter(p => !p.isAdd);
    const newId = generateUniquePageId(pagesWithoutAdd);
    const newIndex = Number(/^page-(\d+)$/.exec(newId)?.[1] || pagesWithoutAdd.length + 1);
    const newPage = {
      id: newId,
      name: 'Static Page',
      type: 'static',
      thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23f8f9fa"/><rect x="10" y="10" width="100" height="15" rx="2" fill="%236366f1"/></svg>'
    };

    // Insert the new page before the Add page, ensuring only one Add page exists
    const updatedPages = [...pagesWithoutAdd, newPage, { id: 'add', name: 'Add', isAdd: true }];
    setPages(updatedPages);
    
    // Create blank layout with just the configured header
    const currentHeaderLayout = pageLayouts['home']?.find((item: any) => item.type === 'header') || {
      title: 'Header',
      type: 'header',
      subtitle: 'Navigation bar'
    };
    
    setPageLayouts(prev => ({
      ...prev,
      [newPage.id]: [currentHeaderLayout] // Start with just the header
    }));
    
    setActivePageId(newPage.id);
    
    // Adjust startIndex to show the new page if it's beyond the current view
    const newPageIndex = updatedPages.findIndex(p => p.id === newPage.id);
    if (newPageIndex >= startIndex + 5) {
      setStartIndex(Math.max(0, newPageIndex - 4)); // Show new page at the end of the 5-page view
    }
  };
  const deletePage = () => {
    // Don't allow deleting the home page or if only home page exists
    if (activePageId === 'home') {
      alert('Cannot delete the home page');
      return;
    }
    
    const pagesWithoutAdd = pages.filter(p => !p.isAdd);
    if (pagesWithoutAdd.length <= 1) {
      alert('Cannot delete the last remaining page');
      return;
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${pages.find(p => p.id === activePageId)?.name}"?`)) {
      return;
    }

    // Remove the page from pages array
    const updatedPages = pages.filter(p => p.id !== activePageId);
    setPages(updatedPages);

    // Remove the page layout
    setPageLayouts(prev => {
      const newLayouts = { ...prev };
      delete newLayouts[activePageId];
      return newLayouts;
    });

    // Switch to home page
    setActivePageId('home');
    
    // Adjust startIndex if necessary after deletion
    const maxStartIndex = Math.max(0, updatedPages.length - 5);
    if (startIndex > maxStartIndex) {
      setStartIndex(maxStartIndex);
    }
    
    // Update localStorage
    try {
      const updatedPagesForStorage = updatedPages.filter(p => !p.isAdd);
      localStorage.setItem('cmsPages', JSON.stringify(updatedPagesForStorage));
      localStorage.setItem('cmsActivePageId', 'home');
      
      // Trigger page change event
      setTimeout(() => {
        window.dispatchEvent(new Event('cmsPageChanged'));
      }, 10);
    } catch {}
  };

  const VISIBLE = 2; // Show home page and add page
  const visibleItems = pages;

  return (
    <aside
      className="bg-black"
      style={{ 
        width: 420, 
        borderLeft: '1px solid #1f1f22', 
        height: '100vh', 
        position: 'fixed', 
        right: 0, 
        top: 0, 
        overflowY: 'auto',
        paddingBottom: 24,
        zIndex: 40
      }}
      ref={asideRef}
    >
      {/* Breadcrumb + Delete - starts from very top */}
      <div
        className="bg-black"
        style={{ 
          borderBottom: '1px solid #1f1f22', 
          position: 'sticky', 
          top: 0, 
          zIndex: 10
        }}
      >
        {/* Top row with breadcrumb, delete, and navigation arrows */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-gray-400">App Info</span>
            <span className="text-gray-600">›</span>
            <span className="text-white font-medium">{pages.find(p => p.id === activePageId)?.name || 'Home'}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Navigation arrows at top right - always visible, blue, larger */}
            {(() => {
              const nonAddPages = visibleItems.filter(p => !p.isAdd);
              const maxStartIndex = Math.max(0, nonAddPages.length - 3);
              const canPageLeft = startIndex > 0;
              const canPageRight = startIndex < maxStartIndex;
              
              console.log('Arrow Debug:', {
                nonAddPagesCount: nonAddPages.length,
                startIndex,
                maxStartIndex,
                canPageLeft,
                canPageRight
              });
              
              return (
                <div className="flex gap-2 mr-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Left arrow clicked, current startIndex:', startIndex);
                      setStartIndex(prev => {
                        const newIndex = Math.max(0, prev - 1);
                        console.log('Setting startIndex from', prev, 'to', newIndex);
                        return newIndex;
                      });
                    }}
                    className={`w-7 h-7 bg-blue-700 hover:bg-blue-800 text-white rounded flex items-center justify-center transition-colors ${!canPageLeft ? 'opacity-40 cursor-not-allowed' : ''}`}
                    title="Previous pages"
                    disabled={!canPageLeft}
                    type="button"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="10,4 6,8 10,12" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Right arrow clicked, current startIndex:', startIndex, 'maxStartIndex:', maxStartIndex);
                      setStartIndex(prev => {
                        const newIndex = Math.min(maxStartIndex, prev + 1);
                        console.log('Setting startIndex from', prev, 'to', newIndex);
                        return newIndex;
                      });
                    }}
                    className={`w-7 h-7 bg-blue-700 hover:bg-blue-800 text-white rounded flex items-center justify-center transition-colors ${!canPageRight ? 'opacity-40 cursor-not-allowed' : ''}`}
                    title="Next pages"
                    disabled={!canPageRight}
                    type="button"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6,4 10,8 6,12" />
                    </svg>
                  </button>
                </div>
              );
            })()}
            <button 
              className="flex items-center gap-1 text-red-400 text-sm hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={deletePage}
              disabled={activePageId === 'home'}
              title={activePageId === 'home' ? 'Cannot delete home page' : 'Delete current page'}
            >
              <TrashIcon />
              Delete
            </button>
          </div>
        </div>
        
        {/* Arrows are now rendered near delete, leaving old ones too */}
      </div>

      {/* Pages row */}
      <div className="px-6 pt-2">
        {/* Navigation arrows moved to sticky header row */}
        <div className="flex items-center justify-start pb-4 gap-4 relative">
          {/* Debug info removed */}
          {/* Pages display area - always show the Add page at the end */}
          <div className="flex items-center gap-4 overflow-hidden transition-all duration-300 w-full">
            {(() => {
              // Always show 4 pages + Add button if paginated
              const nonAddPages = visibleItems.filter(p => !p.isAdd);
              const addPageObj = visibleItems.find(p => p.isAdd);
              const paged = nonAddPages.slice(startIndex, startIndex + 4);
              const result = [...paged];
              if (addPageObj) result.push(addPageObj);
              
              console.log('Page Display Debug:', {
                totalNonAddPages: nonAddPages.length,
                startIndex,
                pagedPageNames: paged.map(p => p.name),
                resultPageNames: result.map(p => p.name)
              });
              
              return result.map((p) => (
                <div key={p.id} className="flex flex-col items-center relative group flex-shrink-0">
                  <div
                    className="rounded-md transition-colors cursor-pointer relative"
                    style={{
                      width: 72,
                      height: 104,
                      border: p.isAdd ? '1px dashed #3a3a42' : (activePageId === p.id ? '2px solid #2563eb' : '1px solid #2a2a30'),
                      background: '#111317',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => {
                      if (p.isAdd) {
                        addPage();
                      } else {
                        setActivePageId(p.id);
                        // Set the rightView based on the page type
                        let nextView: RightView = 'builder';
                        if (p.type === 'home') nextView = 'builder';
                        else if (p.type === 'header') nextView = 'header';
                        else if (p.type === 'footer') nextView = 'footer';
                        else if (p.type === 'category') nextView = 'category';
                        else if (p.type === 'search') nextView = 'search';
                        else if (p.type === 'cart') nextView = 'cart';
                        else if (p.type === 'listBlog') nextView = 'listBlog';
                        else if (p.type === 'page') nextView = 'page';
                        setRightView(nextView);
                        setTimeout(() => {
                          window.dispatchEvent(new Event('cmsPageChanged'));
                        }, 10);
                      }
                    }}
                  >
                    {p.isAdd ? (
                      <span className="text-gray-300 text-xl">+</span>
                    ) : p.thumbnail ? (
                      <img src={p.thumbnail} alt={p.name} style={{ width: 64, height: 90, objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-dashed" style={{ borderColor: '#3a3a42' }} />
                    )}
                    {/* Delete button on hover - only for non-home, non-add pages */}
                    {!p.isAdd && p.id !== 'home' && (
                      <button
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                            if (activePageId === p.id) {
                              setActivePageId('home');
                            }
                            const updatedPages = pages.filter(page => page.id !== p.id);
                            setPages(updatedPages);
                            setPageLayouts(prev => {
                              const newLayouts = { ...prev };
                              delete newLayouts[p.id];
                              return newLayouts;
                            });
                            const maxStartIndex = Math.max(0, updatedPages.length - 4);
                            if (startIndex > maxStartIndex) {
                              setStartIndex(maxStartIndex);
                            }
                            try {
                              const updatedPagesForStorage = updatedPages.filter(page => !page.isAdd);
                              localStorage.setItem('cmsPages', JSON.stringify(updatedPagesForStorage));
                              if (activePageId === p.id) {
                                localStorage.setItem('cmsActivePageId', 'home');
                              }
                              setTimeout(() => {
                                window.dispatchEvent(new Event('cmsPageChanged'));
                              }, 10);
                            } catch {}
                          }
                        }}
                        title={`Delete ${p.name}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] text-white mt-1">{p.name}</div>
                </div>
              ));
            })()}
          </div>


          
          {/* Debug info - remove this later */}
          <div className="absolute bottom-[-20px] left-0 text-xs text-gray-500">
            {visibleItems.length > 5 && `Pages: ${visibleItems.length}, Start: ${startIndex}, Showing: ${startIndex + 1}-${Math.min(startIndex + 5, visibleItems.length)}`}
          </div>
        </div>
      </div>

      {/* DESIGN LAYOUT panel */}
      <div className="px-4 py-4 space-y-4">
        <DesignLayoutPanel 
          rightView={rightView} 
          setRightView={setRightView} 
          pageLayouts={pageLayouts}
          setPageLayouts={setPageLayouts}
          activePageId={activePageId}
          pages={pages}
          setPages={setPages}
        />
        {rightView === 'header' && headerNavConfig !== null && (
          <div className="mt-4">
            <HeaderOverviewPanel
              value={headerNavConfig || undefined}
              onChange={handleHeaderChange}
              onAddNew={() => {}}
              onEditItem={() => {}}
              viewport={viewport}
            />
          </div>
        )}
        {rightView === 'footer' && (
          <div className="rounded-lg border border-[#2a2a30] bg-black p-4">
            <div className="text-sm font-medium text-white mb-3">FOOTER</div>
            <p className="text-xs text-gray-400 mb-4">Insert a Footer widget and open its settings.</p>
            <button
              className="text-xs text-white px-3 py-2 rounded bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors"
              onClick={() => {
                const currentLayout = pageLayouts[activePageId] || [];
                const existingIdx = currentLayout.findIndex(it => it.type === 'footer');
                if (existingIdx >= 0) {
                  setSelectedWidgetIdx(existingIdx);
                } else {
                  const next = [...currentLayout, { title: 'Footer', type: 'footer' }];
                  setPageLayouts(prev => ({
                    ...prev,
                    [activePageId]: next
                  }));
                  setSelectedWidgetIdx(next.length - 1);
                }
              }}
            >
              Add & Configure Footer
            </button>
          </div>
        )}
        
        {rightView === 'category' && (
          <CategoryLayoutPanel onLayoutChange={onCategoryLayoutChange} />
        )}

        {rightView === 'builder' && (
          <HomeLayoutPanel
          items={currentPageLayout}
          onAdd={() => setShowAddWidget(true)}
          onSelectRow={(idx) => setSelectedWidgetIdx(idx)}
          onReorder={(from, to) => {
            setPageLayouts(prev => {
              const currentLayout = prev[activePageId] || [];
              const next = currentLayout.slice();
              const removed = next.splice(from, 1);
              const moved = removed[0] as { title: string; type: string; subtitle?: string; badge?: string };
              next.splice(to, 0, moved);
              return {
                ...prev,
                [activePageId]: next
              };
            });
          }}
          onRemove={(idx) => {
            setPageLayouts(prev => {
              const currentLayout = prev[activePageId] || [];
              const filtered = currentLayout.filter((_, i) => i !== idx);
              return {
                ...prev,
                [activePageId]: filtered
              };
            });
            if (selectedWidgetIdx !== null) {
              if (idx === selectedWidgetIdx) setSelectedWidgetIdx(null);
              else if (idx < selectedWidgetIdx) setSelectedWidgetIdx(selectedWidgetIdx - 1);
            }
          }}
        />)}
      </div>

      {showAddWidget && (
        <AddWidgetDrawer
          onClose={() => setShowAddWidget(false)}
          onSelect={(item) => {
            setPageLayouts(prev => ({
              ...prev,
              [activePageId]: [...(prev[activePageId] || []), item]
            }));
            setShowAddWidget(false);
          }}
        />
      )}

    </aside>
  );
}

// DESIGN LAYOUT PANEL
function DesignLayoutPanel({ 
  rightView, 
  setRightView, 
  pageLayouts, 
  setPageLayouts, 
  activePageId,
  pages,
  setPages
}: { 
  rightView: RightView; 
  setRightView: (v: RightView) => void;
  pageLayouts: Record<string, Array<{ title: string; type: string; subtitle?: string; badge?: string }>>;
  setPageLayouts: React.Dispatch<React.SetStateAction<Record<string, Array<{ title: string; type: string; subtitle?: string; badge?: string }>>>>;
  activePageId: string;
  pages: Array<{ id: string; name: string; thumbnail?: string; type?: string; isAdd?: boolean }>;
  setPages: React.Dispatch<React.SetStateAction<Array<{ id: string; name: string; thumbnail?: string; type?: string; isAdd?: boolean }>>>;
}) {
  const [open, setOpen] = useState(true);
  const [showThemeColors, setShowThemeColors] = useState(false);
  const [designColors, setDesignColors] = useState<{ header: string; body: string; footer: string }>(() => {
    try {
      const raw = localStorage.getItem('cmsDesignColors');
      if (raw) return JSON.parse(raw);
    } catch {}
    return { header: '#ffffff', body: '#ffffff', footer: '#ffffff' };
  });

  const updateColor = (partial: Partial<{ header: string; body: string; footer: string }>) => {
    const next = { ...designColors, ...partial };
    setDesignColors(next);
    try {
      localStorage.setItem('cmsDesignColors', JSON.stringify(next));
    } catch {}
    try {
      window.dispatchEvent(new Event('cmsDesignColorsChanged'));
    } catch {}
  };
  return (
    <div className="rounded-lg border border-[#2a2a30] bg-black">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a30]">
        <div className="text-sm font-medium text-gray-200 flex items-center gap-2">
          <span>DESIGN LAYOUT</span>
          <span className="text-gray-500 text-xs">ⓘ</span>
        </div>
        <button onClick={() => setOpen(o => !o)} className="text-gray-400 hover:text-white transition-colors">{open ? '▾' : '▸'}</button>
      </div>
      {open && !showThemeColors && (
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Home', icon: <HomeIcon />, view: 'builder' as RightView },
              { name: 'Header', icon: <HeaderIcon />, view: 'header' as RightView },
              { name: 'Footer', icon: <FooterIcon />, view: 'footer' as RightView },
              { name: 'Search', icon: <SearchIcon />, view: 'search' as RightView },
              { name: 'Cart', icon: <ShoppingCartIcon />, view: 'cart' as RightView },
              { name: 'List Blog', icon: <ListIcon />, view: 'listBlog' as RightView },
              { name: 'Page', icon: <FileTextIcon />, view: 'page' as RightView },
              { name: 'Category', icon: <CategoryIcon />, view: 'category' as RightView },
              { name: 'Theme Settings', icon: <span className="w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17.5-2.5L19 12l2.5 2.5M6.5 9.5L4 12l2.5 2.5"/>
                </svg>
              </span>, action: 'themeColors' },
              { name: 'Wishlist', icon: <HeartIcon /> },
              { name: 'Profile', icon: <UserIcon /> },
              { name: 'Static', icon: <FileTextIcon /> },
              { name: 'Html', icon: <CodeIcon /> },
              { name: 'Dynamic', icon: <ZapIcon /> },
              { name: 'Tab Menu', icon: <MenuIcon /> },
              { name: 'Scrollable', icon: <ScrollIcon /> },
              { name: 'Videos', icon: <PlayIcon /> }
            ].map((item) => (
              <div
                key={item.name}
                className={`rounded-lg p-3 text-center cursor-pointer transition-all duration-200 bg-[#0f0f12] border border-[#2a2a30] hover:bg-[#151518] hover:border-[#3a3a42]`}
                onClick={() => {
                  if (item.action === 'themeColors') {
                    setShowThemeColors(true);
                  } else if (item.view) {
                    // Update the current page type based on the component selected
                    const componentType = item.view;
                    
                    // Update the page type in pages array
                    setPages(prev => prev.map(p => 
                      p.id === activePageId 
                        ? { ...p, type: componentType, name: item.name === 'Category' ? 'Category Page' : item.name }
                        : p
                    ));
                    
                    // Store page type in localStorage for MainCanvas to pick up
                    try {
                      const savedPages = localStorage.getItem('cmsPages');
                      if (savedPages) {
                        const pages = JSON.parse(savedPages);
                        const updatedPages = pages.map((p: any) => 
                          p.id === activePageId 
                            ? { ...p, type: componentType, name: item.name === 'Category' ? 'Category Page' : item.name }
                            : p
                        );
                        localStorage.setItem('cmsPages', JSON.stringify(updatedPages));
                        
                        // Trigger custom event for immediate update
                        window.dispatchEvent(new Event('cmsPageChanged'));
                      }
                    } catch {}
                    
                    // Add component to current page layout if not already present (except for special cases)
                    const currentLayout = pageLayouts[activePageId] || [];
                    const existingComponent = currentLayout.find((c: any) => c.type === componentType);
                    
                    if (!existingComponent && componentType !== 'category') {
                      // Add the new component to the current page (except for category which is handled by page type)
                      const newComponent = {
                        title: item.name,
                        type: componentType,
                        subtitle: `${item.name} component`
                      };
                      
                      setPageLayouts(prev => ({
                        ...prev,
                        [activePageId]: [...(prev[activePageId] || []), newComponent]
                      }));
                    }
                    
                    // Switch to the appropriate settings view (like the old behavior)
                    setRightView(componentType as RightView);
                    setShowThemeColors(false);
                  }
                }}
              >
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded bg-[#1a1a1f] text-gray-300">
                  {item.icon}
                </div>
                <div className="text-xs font-medium" style={{ color: '#e5e7eb' }}>
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Theme Settings Panel */}
      {open && showThemeColors && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-200">THEME SETTINGS</div>
            <button onClick={() => setShowThemeColors(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-gray-400 mb-3 font-medium">COLOR SCHEME</div>
            <label className="flex items-center justify-between text-sm text-gray-200">
              <span>Header</span>
              <input type="color" value={designColors.header} onChange={(e)=>updateColor({ header: e.target.value })} className="w-12 h-8 rounded border border-[#2a2a30] bg-transparent cursor-pointer" />
            </label>
            <label className="flex items-center justify-between text-sm text-gray-200">
              <span>Body</span>
              <input type="color" value={designColors.body} onChange={(e)=>updateColor({ body: e.target.value })} className="w-12 h-8 rounded border border-[#2a2a30] bg-transparent cursor-pointer" />
            </label>
            <label className="flex items-center justify-between text-sm text-gray-200">
              <span>Footer</span>
              <input type="color" value={designColors.footer} onChange={(e)=>updateColor({ footer: e.target.value })} className="w-12 h-8 rounded border border-[#2a2a30] bg-transparent cursor-pointer" />
            </label>
          </div>
        </div>
      )}


    </div>
  );
}

// CATEGORY LAYOUT PANEL
function CategoryLayoutPanel({ onLayoutChange }: { onLayoutChange?: (layoutName: string, layoutData: any) => void }) {
  const [layouts, setLayouts] = useState<Array<{ title: string; subtitle?: string; badge?: string }>>([
    { title: 'Header', subtitle: 'Category header' },
    { title: 'Category', subtitle: 'Category component' }
  ]);

  // Add new layout/component to the list
  const handleAddLayout = () => {
    setLayouts(prev => [
      ...prev,
      { title: `Layout ${prev.length + 1}`, subtitle: 'Custom category layout' }
    ]);
  };

  // Remove layout/component from the list
  const handleRemove = (idx: number) => {
    setLayouts(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="rounded-lg border border-[#2a2a30] bg-black">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a30]">
        <div className="text-sm font-medium text-gray-200">CATEGORY LAYOUT</div>
      </div>
      <div className="p-4">
        {/* List of layouts/components */}
        {layouts.length === 0 ? (
          <div className="text-xs text-gray-400 mb-3">No layouts yet. Click "+ ADD NEW LAYOUT" to insert your first layout.</div>
        ) : (
          layouts.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between px-3 py-2 rounded bg-[#0f0f12] border border-[#2a2a30] mb-2">
              <div>
                <div className="text-sm text-white flex items-center gap-2">
                  <span>{it.title}</span>
                  {it.badge && <span className="text-[10px] text-red-400 bg-red-400/10 px-1 py-0.5 rounded">{it.badge}</span>}
                </div>
                {it.subtitle && <div className="text-xs text-gray-400 mt-0.5">{it.subtitle}</div>}
              </div>
              <button
                className="text-red-400 hover:text-red-300 transition-colors text-sm"
                onClick={() => handleRemove(idx)}
                aria-label="remove"
              >
                Remove✕
              </button>
            </div>
          ))
        )}
        <div className="pt-2">
          <button
            className="w-full text-xs text-white px-3 py-2 rounded bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors"
            onClick={handleAddLayout}
          >
            + ADD NEW LAYOUT
          </button>
        </div>
      </div>
    </div>
  );
}

// HOME LAYOUT PANEL (static list to match UI)
function HomeLayoutPanel({ items, onAdd, onSelectRow, onReorder, onRemove }: { items: Array<{ title: string; subtitle?: string; badge?: string }>; onAdd: () => void; onSelectRow: (idx: number) => void; onReorder: (from: number, to: number) => void; onRemove: (idx: number) => void }) {
  const [open, setOpen] = useState(true);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const Row = ({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: string }) => (
    <div className="flex items-center justify-between px-3 py-2 rounded bg-[#0f0f12] border border-[#2a2a30] hover:bg-[#151518] transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 cursor-move text-sm">⋮⋮</span>
        <div>
          <div className="text-sm text-white flex items-center gap-2">
            <span>{title}</span>
            {badge && <span className="text-[10px] text-red-400 bg-red-400/10 px-1 py-0.5 rounded">{badge}</span>}
          </div>
          {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-400">
        <button title="Remove" className="text-red-400 hover:text-red-300 transition-colors text-sm" aria-label="remove">✕</button>
        <span>›</span>
      </div>
    </div>
  );

  return (
    <div className="rounded-lg border border-[#2a2a30] bg-black">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a30]">
        <div className="text-sm font-medium text-gray-200">HOME LAYOUT</div>
        <button onClick={() => setOpen(o => !o)} className="text-gray-400 hover:text-white transition-colors">{open ? '▾' : '▸'}</button>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-xs text-gray-400">No widgets yet. Click "Add New Layout" to insert your first widget.</div>
          ) : (
            items.map((it, idx) => (
              <div
                key={idx}
                className={`w-full text-left ${dragIndex === idx ? 'opacity-75' : ''}`}
                draggable
                onDragStart={(e) => { setDragIndex(idx); try { e.dataTransfer.setData('text/plain', String(idx)); e.dataTransfer.effectAllowed = 'move'; } catch {} }}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                onDrop={(e) => {
                  e.preventDefault();
                  let from = dragIndex;
                  if (from === null) {
                    let raw = '';
                    try { raw = e.dataTransfer.getData('text/plain'); } catch {}
                    if (raw) from = Number(raw);
                  }
                  if (from !== null && from !== idx) onReorder(from, idx);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
              >
                <div className="relative">
                  <div className="w-full text-left" role="button" onClick={() => onSelectRow(idx)}>
                    <Row title={it.title} subtitle={it.subtitle} badge={it.badge} />
                  </div>
                  <div
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-red-400 hover:text-red-300"
                    onClick={() => onRemove(idx)}
                    role="button"
                    aria-label="delete-row"
                  >
                    Remove
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <div className="p-4 pt-3">
        <button onClick={onAdd} className="w-full text-xs text-white px-3 py-2 rounded bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors">+ ADD NEW LAYOUT</button>
      </div>
    </div>
  );
}

// (Drawer moved to components/cms/modals/AddWidgetDrawer.tsx)
