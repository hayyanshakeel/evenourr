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

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

type RightView = 'builder' | 'search' | 'cart' | 'listBlog' | 'page' | 'header' | 'footer';

interface RightPanelProps {
  asideRef: React.RefObject<HTMLDivElement>;
  rightView: RightView;
  setRightView: (view: RightView) => void;
  viewport?: 'mobile' | 'tablet' | 'desktop';
  onLayoutChange?: (items: Array<{ title: string; type: string; subtitle?: string; badge?: string }>) => void;
}

export default function RightPanel({ asideRef, rightView, setRightView, viewport = 'mobile', onLayoutChange }: RightPanelProps) {
  const [pages, setPages] = useState<Array<{ id: string; name: string; thumbnail?: string; type?: string; isAdd?: boolean }>>(() => {
    // Try to load pages from localStorage, fallback to default
    try {
      const saved = localStorage.getItem('cmsPages');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    
    return [
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
    ];
  });
  const [activePageId, setActivePageId] = useState<string>(() => {
    // Try to load active page ID from localStorage, fallback to 'home'
    try {
      const saved = localStorage.getItem('cmsActivePageId');
      return saved || 'home';
    } catch {
      return 'home';
    }
  });
  const [startIndex, setStartIndex] = useState<number>(0);
  const [showAddWidget, setShowAddWidget] = useState<boolean>(false);
  const [showPageCapture, setShowPageCapture] = useState<boolean>(false);
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
    if (typeof input === 'object') {
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
    setPageLayouts(prev => ({
      ...prev,
      [activePageId]: (prev[activePageId] || []).map((it: any) => 
        it.type === 'header' ? { 
          ...it, 
          // Persist a sanitized config (no React nodes) to the layout used by the renderer
          headerNav: sanitizeForLayout({
            ...it.headerNav,
            ...v
          })
        } : it
      )
    }));
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
      localStorage.setItem('cmsPages', JSON.stringify(pages));
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
    setShowPageCapture(true);
  };

  const createStaticPage = (pageType: string) => {
    const pageTypeNames: Record<string, string> = {
      'home': 'Home Page',
      'listBlog': 'List Blog',
      'wishlist': 'Wishlist',
      'profile': 'Profile', 
      'cart': 'Shopping Cart',
      'search': 'Search Results',
      'about': 'About Us',
      'contact': 'Contact',
      'category': 'Category Page',
      'product': 'Product Page'
    };

    const generateThumbnail = (type: string) => {
      const thumbnails: Record<string, string> = {
        'home': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23f3f4f6"/><circle cx="20" cy="20" r="8" fill="%236366f1"/><rect x="35" y="15" width="70" height="3" rx="1" fill="%23d1d5db"/></svg>',
        'listBlog': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23f9fafb"/><rect x="10" y="10" width="100" height="12" rx="2" fill="%23f59e0b"/></svg>',
        'wishlist': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23fef2f2"/><path d="M60 25c-8-12-24-12-24 0-6 15 12 25 24 30 12-5 30-15 24-30 0-12-16-12-24 0z" fill="%23ef4444"/></svg>',
        'profile': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23f0f9ff"/><circle cx="60" cy="30" r="12" fill="%233b82f6"/></svg>',
        'cart': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23f0fdf4"/><rect x="30" y="25" width="60" height="40" rx="4" fill="none" stroke="%2316a34a" stroke-width="2"/></svg>',
        'search': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23fefce8"/><circle cx="50" cy="35" r="15" fill="none" stroke="%23eab308" stroke-width="3"/><line x1="62" y1="47" x2="75" y2="60" stroke="%23eab308" stroke-width="3"/></svg>',
        'about': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23faf5ff"/><circle cx="60" cy="40" r="20" fill="%23a855f7"/><text x="60" y="48" text-anchor="middle" fill="white" font-size="16" font-family="Arial">i</text></svg>',
        'contact': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23ecfdf5"/><rect x="25" y="25" width="70" height="30" rx="4" fill="none" stroke="%2310b981" stroke-width="2"/><path d="M25 25l35 20 35-20" fill="none" stroke="%2310b981" stroke-width="2"/></svg>',
        'category': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23fff7ed"/><rect x="15" y="15" width="25" height="25" rx="3" fill="%23f97316"/><rect x="47" y="15" width="25" height="25" rx="3" fill="%23f97316"/><rect x="79" y="15" width="25" height="25" rx="3" fill="%23f97316"/><rect x="15" y="47" width="25" height="25" rx="3" fill="%23f97316"/></svg>',
        'product': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23fef7f0"/><rect x="30" y="15" width="60" height="40" rx="4" fill="%23fb923c"/><rect x="35" y="60" width="50" height="3" rx="1" fill="%23d1d5db"/><rect x="40" y="67" width="40" height="3" rx="1" fill="%23d1d5db"/></svg>'
      };
      return thumbnails[type] || thumbnails['home'];
    };

    // Remove the Add page temporarily
    const pagesWithoutAdd = pages.filter(p => !p.isAdd);
    const idx = pagesWithoutAdd.length + 1;
    const newPage = {
      id: `page-${idx}`,
      name: pageTypeNames[pageType] || `Page ${idx}`,
      type: pageType,
      thumbnail: generateThumbnail(pageType)
    };

    // Insert the new page before the Add page
    const updatedPages = [...pagesWithoutAdd, newPage, { id: 'add', name: 'Add', isAdd: true }];
    setPages(updatedPages);
    
    // Copy home layout to new page (as a starting point)
    const homeLayout = pageLayouts['home'] || [];
    setPageLayouts(prev => ({
      ...prev,
      [newPage.id]: [...homeLayout] // Create a copy of home layout
    }));
    
    setActivePageId(newPage.id);
    setShowPageCapture(false);
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
        className="flex items-center justify-between px-4 py-3 bg-black"
        style={{ 
          borderBottom: '1px solid #1f1f22', 
          position: 'sticky', 
          top: 0, 
          zIndex: 10
        }}
      >
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-gray-400">App Info</span>
          <span className="text-gray-600">›</span>
          <span className="text-white font-medium">{pages.find(p => p.id === activePageId)?.name || 'Home'}</span>
        </div>
        <button className="flex items-center gap-1 text-red-400 text-sm hover:text-red-300">
          <TrashIcon />
          Delete
        </button>
      </div>

      {/* Pages row */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-center pb-4 gap-4">
          {visibleItems.map((p) => (
            <div key={p.id} className="flex flex-col items-center">
              <div
                className="rounded-md transition-colors cursor-pointer"
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
                  if (p.isAdd) addPage(); else setActivePageId(p.id);
                }}
              >
                {p.isAdd ? (
                  <span className="text-gray-300 text-xl">+</span>
                ) : p.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnail} alt={p.name} style={{ width: 64, height: 90, objectFit: 'cover', borderRadius: 6 }} />
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-dashed" style={{ borderColor: '#3a3a42' }} />
                )}
              </div>
              <div className="text-[10px] text-white mt-1">{p.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DESIGN LAYOUT panel */}
      <div className="px-4 py-4 space-y-4">
        <DesignLayoutPanel rightView={rightView} setRightView={setRightView} />
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

      {/* Page Capture Modal */}
      {showPageCapture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black border border-[#2a2a30] rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-medium">Create New Page</h3>
              <button 
                onClick={() => setShowPageCapture(false)} 
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-6">Choose a page type to capture and create a static page based on the current layout.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'home', label: 'Home Page', icon: '🏠' },
                { key: 'listBlog', label: 'List Blog', icon: '📝' },
                { key: 'wishlist', label: 'Wishlist', icon: '❤️' },
                { key: 'profile', label: 'Profile', icon: '👤' },
                { key: 'cart', label: 'Shopping Cart', icon: '🛒' },
                { key: 'search', label: 'Search Results', icon: '🔍' },
                { key: 'about', label: 'About Us', icon: 'ℹ️' },
                { key: 'contact', label: 'Contact', icon: '📧' },
                { key: 'category', label: 'Category Page', icon: '📂' },
                { key: 'product', label: 'Product Page', icon: '📦' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => createStaticPage(key)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#2a2a30] bg-[#0f0f12] hover:bg-[#151518] hover:border-[#3a3a42] transition-colors text-white"
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs text-center">{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setShowPageCapture(false)}
                className="flex-1 px-4 py-2 rounded bg-[#2a2a30] hover:bg-[#3a3a42] text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
}

// DESIGN LAYOUT PANEL
function DesignLayoutPanel({ rightView, setRightView }: { rightView: RightView; setRightView: (v: RightView) => void }) {
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
                className={`rounded-lg p-3 text-center cursor-pointer transition-all duration-200 ${(rightView === item.view || (item.action === 'themeColors' && showThemeColors)) ? 'bg-[#1a1b1f] border border-[#2a2a30]' : 'bg-[#0f0f12] border border-[#2a2a30] hover:bg-[#151518]'}`}
                onClick={() => {
                  if (item.action === 'themeColors') {
                    setShowThemeColors(true);
                  } else if (item.view) {
                    setRightView(item.view as RightView);
                    setShowThemeColors(false);
                  }
                }}
              >
                <div className={`flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded ${(rightView === item.view || (item.action === 'themeColors' && showThemeColors)) ? 'bg-[#2563eb] text-white' : 'bg-[#1a1a1f] text-gray-300'}`}>
                  {item.icon}
                </div>
                <div className="text-xs font-medium" style={{ color: (rightView === item.view || (item.action === 'themeColors' && showThemeColors)) ? '#fff' : '#e5e7eb' }}>
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
