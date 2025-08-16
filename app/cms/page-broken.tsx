"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { useCms } from "@/hooks/useCms";
import { createBlock } from "@/lib/cms/blocks";
import { DEFAULT_LAYOUT } from "@/lib/cms/schema";
import { CmsBlockType } from "@/lib/cms/schema";

// Component imports
import TopToolbar from "@/components/cms/TopToolbar";
import LeftSidebar from "@/components/cms/LeftSidebar";
import MainCanvas from "@/components/cms/MainCanvas";
import RightPanel from "@/components/cms/RightPanel";

// Minimal inline icons
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const CloudIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.5 19a4.5 4.5 0 0 0 0-9 5.5 5.5 0 0 0-10.5 2A4 4 0 0 0 7 19Z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// Device viewport icons
const MobileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const TabletIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="3" width="16" height="18" rx="2" ry="2"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const DesktopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="12" rx="2" ry="2"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
    <line x1="12" y1="16" x2="12" y2="20"/>
  </svg>
);

// Additional icons for right panel
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const LayersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 2,7 12,12 22,7 12,2"/>
    <polyline points="2,17 12,22 22,17"/>
    <polyline points="2,12 12,17 22,12"/>
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8Z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16,18 22,12 16,6"/>
    <polyline points="8,6 2,12 8,18"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5,3 19,12 5,21 5,3"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const ScrollIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21,15 16,10 5,21"/>
  </svg>
);

const LayoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
);

const GripVerticalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="12" r="1"/>
    <circle cx="9" cy="5" r="1"/>
    <circle cx="9" cy="19" r="1"/>
    <circle cx="15" cy="12" r="1"/>
    <circle cx="15" cy="5" r="1"/>
    <circle cx="15" cy="19" r="1"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
);

const QuadGridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="6" height="6"/>
    <rect x="14" y="4" width="6" height="6"/>
    <rect x="4" y="14" width="6" height="6"/>
    <rect x="14" y="14" width="6" height="6"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 4v16m8-8H4"/>
  </svg>
);

export default function CmsEditor() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [pageComponents, setPageComponents] = useState<any[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [version, setVersion] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const { authenticatedFetch, isAuthenticated } = useAuthenticatedFetch();
  
  // Initialize CMS hooks
  const cms = useCms(DEFAULT_LAYOUT);
  
  const [pages, setPages] = useState<Array<{ id: string; name: string; url: string }>>([
    { id: 'home', name: 'Home', url: '/' },
  ]);
  const pagesScrollRef = useRef<HTMLDivElement | null>(null);
  const asideRef = useRef<HTMLDivElement | null>(null);
  const [isAddLayoutOpen, setIsAddLayoutOpen] = useState(false);
  const [homeLayoutItems, setHomeLayoutItems] = useState<Array<{ key: string; name: string; tag?: string; type: string }>>([
    { key: 'header-search', name: 'Header Search', type: 'headerSearch' },
    { key: 'banner-1', name: 'Banner Image', tag: 'STATIC', type: 'banner' },
    { key: 'category', name: 'Category', tag: 'IMAGE, ENABLE WRAP', type: 'category' },
    { key: 'horizontal-products', name: 'Horizontal Products', tag: 'FRESH ARRIVALS', type: 'horizontalProducts' },
    { key: 'banner-2', name: 'Banner Image', tag: 'DEFAULT', type: 'banner' },
    { key: 'vertical-layout', name: 'Vertical Layout', tag: 'PINNED TO BOTTOM', type: 'layout' },
  ]);
  // Right panel routing
  const [rightView, setRightView] = useState<'builder' | 'category' | 'search' | 'cart' | 'listBlog' | 'page'>('builder');
  const [categoryState, setCategoryState] = useState({
    layout: 'card' as 'card' | 'sideMenu' | 'column' | 'topMenu' | 'animation' | 'grid' | 'sideCate' | 'group' | 'multiLevel' | 'fancyScroll',
    showSearch: true,
    parallax: false,
    largeCount: false,
    showTabMenu: true,
    defaultTab: true,
    tabImage: false,
    tabIcon: false,
    tabName: '' as string,
  });
  const [isCatListOpen, setIsCatListOpen] = useState(true);
  const [isCatSettingsOpen, setIsCatSettingsOpen] = useState(true);
  const [categoryItems, setCategoryItems] = useState<Array<{ id: string; name: string; enabled: boolean }>>([]);

  // Cart/List Blog/Page states
  const [cartState, setCartState] = useState<{ style: 'Normal' | 'Minimal'; checkoutButtonPosition: 'Top Right' | 'Bottom Right' | 'Top Left' | 'Bottom Left' }>({ style: 'Normal', checkoutButtonPosition: 'Top Right' });
  const [listBlogState, setListBlogState] = useState<{ style: 'Staggered' | 'Grid' }>({ style: 'Staggered' });
  const [pageCode, setPageCode] = useState<{ markup: string; css: string; script: string }>({ markup: '', css: '', script: '' });

  // Scroll right panel to top when switching views
  useEffect(() => {
    if (asideRef.current) {
      asideRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [rightView]);

  function toggleCatEnabled(id: string) {
    setCategoryItems(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  }

  function onCatDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.dataTransfer.setData('text/plain', String(index));
  }

  // Load categories from admin API when Category view opens
  useEffect(() => {
    async function loadCategories() {
      if (rightView !== 'category') return;
      try {
        const res = await authenticatedFetch('/api/admin/categories');
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data?.data || data?.categories || []);
        const mapped = list.map((c: any) => ({ id: String(c.id ?? c.slug ?? c.name), name: c.name ?? c.title ?? 'Category', enabled: true }));
        setCategoryItems(mapped);
      } catch (_) {
        // ignore
      }
    }
    loadCategories();
  }, [rightView, authenticatedFetch]);
  function onCatDragOver(e: React.DragEvent<HTMLDivElement>) { e.preventDefault(); }
  function onCatDrop(e: React.DragEvent<HTMLDivElement>, targetIndex: number) {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (Number.isNaN(sourceIndex) || sourceIndex === targetIndex) return;
    setCategoryItems(prev => {
      const next = [...prev];
      const moved = next.splice(sourceIndex, 1)[0];
      if (!moved) return prev;
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }

  const layoutOptions: Array<{ type: string; name: string; badge?: 'New!'; }> = [
    { type: 'animatedStack', name: 'Animated Stack', badge: 'New!' },
    { type: 'background', name: 'Background' },
    { type: 'banner', name: 'Banner Image' },
    { type: 'blogs', name: 'Blogs' },
    { type: 'button', name: 'Button' },
    { type: 'category', name: 'Category' },
    { type: 'divider', name: 'Divider' },
    { type: 'headerSearch', name: 'Header Search', badge: 'New!' },
    { type: 'headerView', name: 'Header View', badge: 'New!' },
    { type: 'horizontalProducts', name: 'Horizontal Products' },
    { type: 'instagramStory', name: 'Instagram Story' },
    { type: 'listCard', name: 'List Card', badge: 'New!' },
    { type: 'logo', name: 'Logo' },
    { type: 'menuList', name: 'Menu List', badge: 'New!' },
    { type: 'spacer', name: 'Spacer' },
    { type: 'story', name: 'Story' },
    { type: 'testimonial', name: 'Testimonial' },
    { type: 'testimonialSlider', name: 'Testimonial Slider' },
    { type: 'text', name: 'Text' },
    { type: 'webEmbed', name: 'Web Embed' },
  ];

  function getLayoutIcon(type: string) {
    switch (type) {
      case 'headerSearch': return <SearchIcon />;
      case 'banner': return <ImageIcon />;
      case 'category': return <LayersIcon />;
      case 'horizontalProducts': return <ShoppingCartIcon />;
      case 'logo': return <LayoutIcon />;
      case 'divider': return <LayoutIcon />;
      case 'button': return <MenuIcon />;
      case 'menuList': return <ListIcon />;
      case 'listCard': return <ListIcon />;
      case 'testimonial': return <UserIcon />;
      case 'testimonialSlider': return <UserIcon />;
      case 'text': return <FileTextIcon />;
      case 'webEmbed': return <CodeIcon />;
      case 'instagramStory': return <PlayIcon />;
      case 'animatedStack': return <ZapIcon />;
      case 'background': return <ImageIcon />;
      case 'blogs': return <ListIcon />;
      case 'headerView': return <LayoutIcon />;
      case 'story': return <PlayIcon />;
      case 'spacer': return <LayoutIcon />;
      default: return <LayoutIcon />;
    }
  }

  // Simple cart blocking - only block cart methods
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Override cart methods to do nothing
      (window as any).openCart = () => console.log('Cart blocked in CMS');
      (window as any).closeCart = () => console.log('Cart blocked in CMS');
      (window as any).toggleCart = () => console.log('Cart blocked in CMS');
      (window as any).showCart = () => console.log('Cart blocked in CMS');
      (window as any).hideCart = () => console.log('Cart blocked in CMS');
      (window as any).addToCart = () => console.log('Cart blocked in CMS');
    }
  }, []);

  // Widgets sidebar removed per request

  const removeComponent = (componentId: string) => {
    setPageComponents(prev => prev.filter(c => c.id !== componentId));
    setSelectedComponent(null);
  };

  // Load real version from CMS layout API
  useEffect(() => {
    let isMounted = true;
    async function loadVersion() {
      try {
        const slugParam = searchParams?.get('slug') || searchParams?.get('url') || undefined;
        if (!isAuthenticated) return; // wait for auth
        let res: Response;
        if (slugParam) {
          res = await authenticatedFetch(`/api/admin/cms/layouts?slug=${encodeURIComponent(slugParam)}`);
          const data = await res.json();
          const item = data?.item || null;
          if (isMounted && item?.data?.version) setVersion(item.data.version);
        } else {
          res = await authenticatedFetch(`/api/admin/cms/layouts`);
          const data = await res.json();
          const first = Array.isArray(data?.items) ? data.items[0] : null;
          if (isMounted && first?.data?.version) setVersion(first.data.version);
        }
      } catch (_err) {
        // keep default if fails
      }
    }
    loadVersion();
    return () => { isMounted = false; };
  }, [authenticatedFetch, isAuthenticated, searchParams]);

  const deviceSizes = {
    mobile: { w: 375, h: 812 },
    tablet: { w: 768, h: 1024 },
    desktop: { w: 1200, h: 800 }
  };

  function scrollPages(direction: 'left' | 'right') {
    const container = pagesScrollRef.current;
    if (!container) return;
    const cardWidth = 74; // approx content width
    const gap = 12;
    const step = (cardWidth + gap) * 5; // show 5 at a time
    container.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  }

  function onDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.dataTransfer.setData('text/plain', String(index));
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>, targetIndex: number) {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData('text/plain');
    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (Number.isNaN(sourceIndex)) return;
    if (sourceIndex === targetIndex) return;
    setPages(prev => {
      const next = [...prev];
      const removed = next.splice(sourceIndex, 1)[0];
      if (!removed) return prev;
      next.splice(targetIndex, 0, removed);
      return next;
    });
  }

  function addPage() {
    const name = typeof window !== 'undefined' ? window.prompt('Page name (e.g., About Us)') : null;
    if (!name) return;
    const url = typeof window !== 'undefined' ? window.prompt('Page URL (e.g., /about)') : null;
    if (!url) return;
    setPages(prev => [...prev, { id: `${Date.now()}`, name, url }]);
    // After adding, nudge scroll to end to reveal new card
    requestAnimationFrame(() => scrollPages('right'));
  }

  // Drag and drop for HOME LAYOUT list
  function onHomeDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.dataTransfer.setData('text/plain', String(index));
  }

  function onHomeDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function onHomeDrop(e: React.DragEvent<HTMLDivElement>, targetIndex: number) {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData('text/plain');
    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (Number.isNaN(sourceIndex)) return;
    if (sourceIndex === targetIndex) return;
    
    // Update CMS layout order
    cms.moveBlock(sourceIndex, targetIndex);
    
    // Update visual list order
    setHomeLayoutItems(prev => {
      const next = [...prev];
      const removed = next.splice(sourceIndex, 1)[0];
      if (!removed) return prev;
      next.splice(targetIndex, 0, removed);
      return next;
    });
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Top Toolbar - FluxBuilder Style */}
      <header
        className="flex items-center justify-between px-4 py-2 bg-gray-800"
        style={{ 
          borderBottom: '1px solid #374151', 
          height: '56px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 50,
          marginRight: 420,
          paddingRight: 0
        }}
      >
        {/* Left group: primary actions only (Save, Publish) */}
        <div className="flex items-center gap-2">
            <button 
              className="btn btn-primary text-sm" 
              style={{ paddingLeft: 20, paddingRight: 20 }}
              onClick={async () => {
                try {
                  const slug = searchParams?.get('slug') || searchParams?.get('url') || 'home';
                  await cms.saveLayout(slug, `Layout - ${slug}`, device);
                  console.log('Layout saved successfully');
                } catch (error) {
                  console.error('Failed to save:', error);
                }
              }}
              disabled={cms.saving}
            >
              {cms.saving ? 'Saving...' : 'Save'}
            </button>
            <button 
              className="btn btn-secondary text-sm flex items-center gap-2" 
              style={{ paddingLeft: 20, paddingRight: 20 }}
              onClick={async () => {
                try {
                  const slug = searchParams?.get('slug') || searchParams?.get('url') || 'home';
                  await cms.publishLayout(slug, `Layout - ${slug}`, device);
                  console.log('Layout published successfully');
                } catch (error) {
                  console.error('Failed to publish:', error);
                }
              }}
              disabled={cms.publishing}
            >
              <CloudIcon />
              <span>{cms.publishing ? 'Publishing...' : 'Publish'}</span>
            </button>
          </div>

        {/* Right group: Version (compact) + Device selector at far right (with slight inset from separator) */}
        <div className="flex items-center gap-2" style={{ marginRight: 12 }}>
          <button
            aria-label="Version menu"
            className="flex items-center gap-1 px-3 py-1 rounded border bg-gray-700 border-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white text-xs"
          >
            <span>{`V${version ?? 1}`}</span>
            <ChevronDownIcon />
          </button>
          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded ${device === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
              title="Mobile"
            >
              <MobileIcon />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded ${device === 'tablet' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
              title="Tablet"
            >
              <TabletIcon />
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded ${device === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
              title="Desktop"
            >
              <DesktopIcon />
            </button>
          </div>
        </div>

        {/* No spacer: device selector hugs the header's right edge (header has margin-right: 420 to clear the right panel) */}
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Far Left Navigation - FluxBuilder main sidebar */}
        <aside className="bg-gray-900" style={{ width: 240, borderRight: '1px solid #2a2f3a' }}>
          <div className="flex flex-col h-full overflow-auto">
            {/* Header / Brand */}
            <div className="p-4" style={{ borderBottom: '1px solid #2a2f3a' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded bg-white flex items-center justify-center">
                  <span className="text-black font-bold">S</span>
                </div>
                <div className="text-xs text-gray-300">
                  <a href="#" className="text-blue-500" style={{ textDecoration: 'none' }}>www.evenour.in</a>
                </div>
              </div>
              <div className="text-xs text-gray-400 mb-2">2 out of 4 tasks</div>
              <div style={{ height: 6, background: '#1f2530', borderRadius: 9999 }}>
                <div style={{ width: '50%', height: 6, background: '#2563eb', borderRadius: 9999 }} />
              </div>
            </div>

            {/* Menu Groups */}
            <div className="p-3">
              <div className="text-xs uppercase text-gray-400 mb-2">Design</div>
              <nav className="space-y-2">
                <a className="block p-3 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700">Templates</a>
                <a className="block p-3 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700">AppBar</a>
                <a className="block p-3 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700">TabBar</a>
                <a className="block p-3 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700">Side Menu</a>
                <a className="block p-3 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700">Layouts</a>
              </nav>
            </div>

            <div className="p-3">
              <div className="text-xs uppercase text-gray-400 mb-2">Features</div>
              <nav className="space-y-2">
                <a className="block p-3 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700">Features</a>
                <a className="block p-3 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700">Build</a>
                <a className="block p-3 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700">Chat</a>
                <a className="block p-3 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700">Back</a>
              </nav>
            </div>

            {/* Footer / Account */}
            <div className="mt-auto" style={{ borderTop: '1px solid #2a2f3a' }}>
              <div className="p-4 text-xs text-gray-400">
                <div className="mb-3">evenour.in@gmail.com</div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700">
                  <span>✔</span>
                  <span>My Subscription</span>
                </div>
              </div>
              <div className="p-4 text-[10px] text-gray-500">FluxBuilder 2.2.0</div>
            </div>
          </div>
        </aside>

        {/* Side Builder Panel moved to the right */}

        {/* Center Canvas (adjusted for fixed right panel) */}
        <main className="flex-1 flex flex-col bg-gray-900" style={{ marginRight: 420 }}>

          {/* Main Canvas */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-900">
            <div
              className="bg-white rounded-lg shadow-2xl overflow-hidden"
              style={{
                width: deviceSizes[device].w,
                height: deviceSizes[device].h,
                maxHeight: 'calc(100vh - 200px)',
              }}
            >
              {cms.layout.blocks.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center p-8">
                  <div>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📱</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Start Building</h3>
                    <p className="text-gray-600 mb-4">Add your first component to get started</p>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={() => setIsAddLayoutOpen(true)}
                    >
                      Add Component
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <div className="p-4">
                    {cms.layout.blocks.map((block, index) => (
                      <div 
                        key={block.id}
                        className={`mb-4 ${selectedComponent === block.id ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setSelectedComponent(block.id)}
                      >
                        {(() => {
                          const props = block.props as any;
                          switch (block.type) {
                            case "hero":
                              return (
                                <div className="relative rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-8 text-center">
                                  <h1 className="text-3xl font-bold mb-4">{props.title || "Hero Title"}</h1>
                                  {props.subtitle && <p className="text-lg text-gray-600 mb-6">{props.subtitle}</p>}
                                  {props.cta && <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">{props.cta}</button>}
                                </div>
                              );
                            case "headerSearch":
                              return (
                                <div className="bg-white border-b border-gray-200 p-4">
                                  <div className="flex items-center justify-between">
                                    {props.showLogo && <div className="font-bold text-lg">Store</div>}
                                    <div className="flex-1 max-w-md mx-4">
                                      <input 
                                        placeholder={props.placeholder || "Search..."}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                      />
                                    </div>
                                    <div className="flex space-x-2">
                                      <button className="p-2 text-gray-600">👤</button>
                                      <button className="p-2 text-gray-600">🛒</button>
                                    </div>
                                  </div>
                                </div>
                              );
                            case "products":
                              return (
                                <div className="p-4">
                                  {props.title && <h2 className="text-2xl font-bold mb-4 text-center">{props.title}</h2>}
                                  <div className="grid grid-cols-2 gap-4">
                                    {Array.from({ length: Math.min(4, props.limit || 4) }).map((_, i) => (
                                      <div key={i} className="border border-gray-200 rounded-lg p-3">
                                        <div className="aspect-square bg-gray-100 rounded mb-2" />
                                        <h3 className="font-medium text-sm">Product {i + 1}</h3>
                                        {props.showPrice && <p className="text-blue-600 font-bold">$29.99</p>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            case "banner":
                              return (
                                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg m-4 flex items-center justify-center text-white">
                                  <div className="text-center">
                                    {props.title && <h3 className="text-2xl font-bold mb-2">{props.title}</h3>}
                                    {props.subtitle && <p className="text-lg">{props.subtitle}</p>}
                                  </div>
                                </div>
                              );
                            case "category":
                              return (
                                <div className="p-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    {['Electronics', 'Clothing', 'Home', 'Sports'].map((cat, i) => (
                                      <div key={i} className="text-center">
                                        {props.showImages && <div className="aspect-square bg-gray-100 rounded-full mb-2" />}
                                        <span className="font-medium">{cat}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            case "text":
                              return (
                                <div className="p-4">
                                  <div dangerouslySetInnerHTML={{ __html: props.content || "Text content here..." }} />
                                </div>
                              );
                            case "spacer":
                              const spacerHeight = { small: 16, medium: 32, large: 64 }[props.height as 'small' | 'medium' | 'large' || 'medium'];
                              return <div style={{ height: spacerHeight }} />;
                            case "divider":
                              return <hr className="my-4 border-gray-300" />;
                            default:
                              return (
                                <div className="p-4 bg-gray-100 border border-gray-300 rounded">
                                  <span className="text-gray-500">Component: {block.type}</span>
                                </div>
                              );
                          }
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Builder Panel - Full Height */}
        <div
          className="bg-gray-900"
          style={{ 
            width: 420, 
            borderLeft: '1px solid #2a2f3a', 
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
            className="flex items-center justify-between px-4 py-3 bg-gray-900"
            style={{ 
              borderBottom: '1px solid #2a2f3a', 
              position: 'sticky', 
              top: 0, 
              zIndex: 10
            }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-gray-400">App Info</span>
              <span className="text-gray-600">›</span>
              <span className="text-white font-medium">Home</span>
            </div>
            <button className="flex items-center gap-1 text-red-400 text-sm hover:text-red-300">
              <TrashIcon />
              Delete
            </button>
          </div>

          <div style={{ display: (rightView as string) === 'builder' ? 'block' : 'none' }}>
              {/* Pages carousel (5 visible, arrows, drag-reorder) */}
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #2a2f3a' }}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300 font-semibold">Pages</div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('left')} aria-label="Scroll left">
                      <ChevronLeftIcon />
                    </button>
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('right')} aria-label="Scroll right">
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
                <div className="mt-3" style={{ overflow: 'hidden' }}>
                  <div ref={pagesScrollRef} className="flex items-start gap-3" style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
                {pages.map((p, index) => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, index)}
                    className="flex flex-col items-center gap-2 cursor-pointer select-none"
                    style={{ width: 74 }}
                    title={p.name}
                  >
                    <div className="rounded bg-gray-800 border border-gray-700 overflow-hidden" style={{ width: 74, height: 110 }}>
                      <div style={{ width: 375, height: 667, transform: 'scale(0.18)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                        <iframe src={p.url} style={{ width: '375px', height: '667px', border: '0' }} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-300 truncate" style={{ width: 74 }}>{p.name}</div>
                  </div>
                ))}
                {/* Add new page card */}
                <div className="flex flex-col items-center gap-2" style={{ width: 74 }}>
                  <button onClick={addPage} className="rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-blue-500 text-xl" style={{ width: 74, height: 110 }}>+
                  </button>
                  <div className="text-xs text-gray-400">Add</div>
                </div>
              </div>
            </div>
          </div>

          {/* DESIGN LAYOUT */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-300 font-semibold">DESIGN LAYOUT</div>
              <button className="text-gray-400">▾</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Home', icon: <HomeIcon /> },
                { name: 'Category', icon: <LayersIcon />, onClick: () => setRightView('category'), active: (rightView as string) === 'category' },
                { name: 'Search', icon: <SearchIcon />, onClick: () => setRightView('search'), active: (rightView as string) === 'search' },
                { name: 'Cart', icon: <ShoppingCartIcon />, onClick: () => setRightView('cart'), active: (rightView as string) === 'cart' },
                { name: 'List Blog', icon: <ListIcon />, onClick: () => setRightView('listBlog'), active: (rightView as string) === 'listBlog' },
                { name: 'Page', icon: <FileTextIcon />, onClick: () => setRightView('page'), active: (rightView as string) === 'page' },
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
                  className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-center cursor-pointer hover:bg-gray-700 transition"
                  onClick={item.onClick as any}
                  style={item.active ? { borderColor: '#2563eb', background: 'rgba(37,99,235,0.18)' } : undefined}
                >
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded bg-gray-700 text-gray-300">
                    {item.icon}
                  </div>
                  <div className="text-xs font-medium" style={{ color: item.active ? '#fff' : '#e5e7eb' }}>{item.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* HOME LAYOUT list (spaced + draggable) */}
          <div className="px-4 pb-24">
            <div className="text-sm text-gray-300 font-semibold mb-3">HOME LAYOUT</div>
            <div className="space-y-4">
              {homeLayoutItems.map((row, index) => (
                <div
                  key={row.key}
                  draggable
                  onDragStart={(e) => onHomeDragStart(e, index)}
                  onDragOver={onHomeDragOver}
                  onDrop={(e) => onHomeDrop(e, index)}
                  className="flex items-center justify-between rounded-lg bg-gray-800 border border-gray-700 p-2"
                  style={{ cursor: 'grab', height: 56 }}
                  onClick={() => { if (row.type === 'category') setRightView('category'); }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-gray-500 w-4 flex items-center justify-center">
                      <GripVerticalIcon />
                    </div>
                    <div className="text-gray-400 w-5 h-5 flex items-center justify-center">
                      {getLayoutIcon(row.type)}
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0" style={{ lineHeight: 1.1 }}>
                      <div className="text-sm text-white font-medium truncate">{row.name}</div>
                      <div className="text-[10px] text-gray-400 h-3 overflow-hidden whitespace-nowrap">{row.tag || '\u00A0'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Remove from CMS layout
                        cms.removeBlock(row.key);
                        // Remove from visual list
                        setHomeLayoutItems(prev => prev.filter(item => item.key !== row.key));
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete component"
                    >
                      <TrashIcon />
                    </button>
                    <div className="text-gray-500 w-4 flex items-center justify-center">
                      <ChevronRightIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer buttons */}
            <div className="flex items-center gap-2" style={{ marginTop: 24 }}>
              <button className="btn btn-primary text-sm flex items-center gap-1" onClick={() => setIsAddLayoutOpen(true)}>
                <PlusIcon />
                Add New Layout
              </button>
            </div>
          </div>

          {/* Conditional: Category builder view */}
          {rightView === 'category' && (
            <div className="px-4 pb-24">
              {/* Header for category subview */}
              <div className="flex items-center justify-between mb-3" style={{ borderBottom: '1px solid #2a2f3a', paddingBottom: 12 }}>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-gray-400">Design</span>
                  <span className="text-gray-600">›</span>
                  <span className="text-white font-medium">Category</span>
                </div>
                <button className="btn btn-secondary text-xs" onClick={() => setRightView('builder')}>Back</button>
              </div>

              {/* Pages (same as homepage) */}
              <div className="px-0 py-3" style={{ borderBottom: '1px solid #2a2f3a' }}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300 font-semibold">Pages</div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('left')} aria-label="Scroll left">
                      <ChevronLeftIcon />
                    </button>
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('right')} aria-label="Scroll right">
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
                <div className="mt-3" style={{ overflow: 'hidden' }}>
                  <div ref={pagesScrollRef} className="flex items-start gap-3" style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
                    {pages.map((p, index) => (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, index)}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, index)}
                        className="flex flex-col items-center gap-2 cursor-pointer select-none"
                        style={{ width: 74 }}
                        title={p.name}
                      >
                        <div className="rounded bg-gray-800 border border-gray-700 overflow-hidden" style={{ width: 74, height: 110 }}>
                          <div style={{ width: 375, height: 667, transform: 'scale(0.18)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                            <iframe src={p.url} style={{ width: '375px', height: '667px', border: '0' }} />
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 truncate" style={{ width: 74 }}>{p.name}</div>
                      </div>
                    ))}
                    {/* Add new page card */}
                    <div className="flex flex-col items-center gap-2" style={{ width: 74 }}>
                      <button onClick={addPage} className="rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-blue-500 text-xl" style={{ width: 74, height: 110 }}>+
                      </button>
                      <div className="text-xs text-gray-400">Add</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESIGN LAYOUT (same as homepage) */}
              <div className="p-0 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-300 font-semibold">DESIGN LAYOUT</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Home', icon: <HomeIcon /> },
                    { name: 'Category', icon: <LayersIcon />, onClick: () => setRightView('category'), active: (rightView as string) === 'category' },
                    { name: 'Search', icon: <SearchIcon />, onClick: () => setRightView('search') },
                    { name: 'Cart', icon: <ShoppingCartIcon />, onClick: () => setRightView('cart') },
                    { name: 'List Blog', icon: <ListIcon />, onClick: () => setRightView('listBlog') },
                    { name: 'Page', icon: <FileTextIcon />, onClick: () => setRightView('page') },
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
                      className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-center cursor-pointer hover:bg-gray-700 transition"
                      onClick={item.onClick as any}
                      style={(item as any).active ? { borderColor: '#2563eb', background: 'rgba(37,99,235,0.18)' } : undefined}
                    >
                      <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded bg-gray-700 text-gray-300">
                        {item.icon}
                      </div>
                      <div className="text-xs text-gray-200 font-medium">{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* separator before Category Layout */}
              <div style={{ borderTop: '1px solid #2a2f3a', margin: '16px 0' }} />
              {/* CATEGORY LAYOUT tiles */}
              <div className="text-xs text-gray-300 font-semibold mt-2 mb-3 uppercase">Category Layout</div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { key: 'card', name: 'Card', icon: <QuadGridIcon /> },
                  { key: 'sideMenu', name: 'Side Menu', icon: <MenuIcon /> },
                  { key: 'column', name: 'Column', icon: <LayoutIcon /> },
                  { key: 'topMenu', name: 'Top Menu', icon: <MenuIcon /> },
                  { key: 'animation', name: 'Animation', icon: <PlayIcon /> },
                  { key: 'grid', name: 'Grid', icon: <QuadGridIcon /> },
                  { key: 'sideCate', name: 'Side Cate', icon: <ListIcon /> },
                  { key: 'group', name: 'Group', icon: <LayersIcon /> },
                  { key: 'multiLevel', name: 'Multi Level', icon: <ListIcon /> },
                  { key: 'fancyScroll', name: 'Fancy Scroll', icon: <ScrollIcon /> },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setCategoryState(s => ({ ...s, layout: opt.key as any }))}
                    className={`rounded-lg bg-gray-800 border ${categoryState.layout === opt.key ? 'border-blue-500' : 'border-gray-700'} px-3 py-3 text-center hover:bg-gray-700 flex flex-col items-center gap-2`}
                  >
                    <span className="text-gray-300 w-5 h-5 flex items-center justify-center">{opt.icon}</span>
                    <span className="text-white text-sm">{opt.name}</span>
                  </button>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #2a2f3a', margin: '12px 0' }} />

              {/* VISIBILITY */}
              <div className="text-xs text-gray-300 font-semibold mt-3 mb-2 uppercase">Visibility</div>
              <div className="text-[11px] text-gray-400 mb-3">Update category as Visible/Hidden, or Drag & Drop to change the Order</div>
                <div className="space-y-3 mb-3">
                <label className="flex items-center justify-between text-sm text-gray-200 py-2">
                  <span>Show Search</span>
                  <input type="checkbox" checked={categoryState.showSearch} onChange={e => setCategoryState(s => ({ ...s, showSearch: e.target.checked }))} style={{ accentColor: '#2563eb' }} />
                </label>
                <label className="flex items-center justify-between text-sm text-gray-200 py-2">
                  <span>Enable Parallax Effect</span>
                  <input type="checkbox" checked={categoryState.parallax} onChange={e => setCategoryState(s => ({ ...s, parallax: e.target.checked }))} style={{ accentColor: '#2563eb' }} />
                </label>
                <label className="flex items-center justify-between text-sm text-gray-200 py-2">
                  <span>Large Number of Categories</span>
                  <input type="checkbox" checked={categoryState.largeCount} onChange={e => setCategoryState(s => ({ ...s, largeCount: e.target.checked }))} style={{ accentColor: '#2563eb' }} />
                </label>
              </div>

              {/* LIST CATEGORIES */}
              <div className="flex items-center justify-between mt-3" style={{ borderTop: '1px solid #2a2f3a', borderBottom: '1px solid #2a2f3a', paddingTop: 12, paddingBottom: 12 }}>
                <div className="text-sm text-gray-300">LIST CATEGORIES</div>
                <button className="text-gray-500" onClick={() => setIsCatListOpen(v => !v)}>{isCatListOpen ? '▾' : '▸'}</button>
              </div>
              {isCatListOpen && (
                <>
                <div className="space-y-3 mt-3 mb-3">
                    <label className="flex items-center justify-between text-sm text-gray-200 py-2">
                      <span>Using Mapped Categories</span>
                      <input type="checkbox" style={{ accentColor: '#2563eb' }} />
                    </label>
                    <label className="flex items-center justify-between text-sm text-gray-200 py-2">
                      <span>Show All Categories</span>
                      <input type="checkbox" defaultChecked style={{ accentColor: '#2563eb' }} />
                    </label>
                  </div>
                  <div style={{ borderTop: '1px solid #2a2f3a', margin: '12px 0' }} />
                  <div className="mt-3 space-y-3 mb-6">
                    {categoryItems.map((c, index) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-lg bg-gray-800 border border-gray-700 px-4 py-3"
                        draggable
                        onDragStart={(e) => onCatDragStart(e, index)}
                        onDragOver={onCatDragOver}
                        onDrop={(e) => onCatDrop(e, index)}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="text-gray-500 w-4 flex items-center justify-center"><GripVerticalIcon /></span>
                          <span className="text-blue-500 w-5 h-5 flex items-center justify-center"><QuadGridIcon /></span>
                          <span className="text-sm text-gray-200 truncate">{c.name}</span>
                        </div>
                        <button
                          onClick={() => toggleCatEnabled(c.id)}
                          aria-label="toggle"
                          className="relative"
                          style={{ width: 36, height: 20, borderRadius: 9999, background: c.enabled ? '#2563eb' : '#374151' }}
                        >
                          <span style={{ position: 'absolute', top: 2, left: c.enabled ? 18 : 2, width: 16, height: 16, borderRadius: 9999, background: '#fff' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* SETTINGS */}
              <div className="mt-6">
                <div className="flex items-center justify-between" style={{ borderTop: '1px solid #2a2f3a', paddingTop: 12 }}>
                  <div className="text-xs text-gray-300 font-semibold uppercase">Settings</div>
                  <button className="text-gray-500" onClick={() => setIsCatSettingsOpen(v => !v)}>{isCatSettingsOpen ? '▾' : '▸'}</button>
                </div>
                {isCatSettingsOpen && (
                <div className="space-y-2 mt-3">
                  <label className="flex items-center justify-between text-sm text-gray-200 py-2">
                    <span>Show Tab Menu</span>
                    <input type="checkbox" checked={categoryState.showTabMenu} onChange={e => setCategoryState(s => ({ ...s, showTabMenu: e.target.checked }))} style={{ accentColor: '#2563eb' }} />
                  </label>
                  <label className="flex items-center justify-between text-sm text-gray-200 py-2">
                    <span>Default Tab</span>
                    <input type="checkbox" checked={categoryState.defaultTab} onChange={e => setCategoryState(s => ({ ...s, defaultTab: e.target.checked }))} style={{ accentColor: '#2563eb' }} />
                  </label>
                  <label className="flex items-center justify-between text-sm text-gray-200 py-2">
                    <span>Tab Image</span>
                    <input type="checkbox" checked={categoryState.tabImage} onChange={e => setCategoryState(s => ({ ...s, tabImage: e.target.checked }))} style={{ accentColor: '#2563eb' }} />
                  </label>
                  <label className="flex items-center justify-between text-sm text-gray-200 py-2">
                    <span>Tab Icon</span>
                    <input type="checkbox" checked={categoryState.tabIcon} onChange={e => setCategoryState(s => ({ ...s, tabIcon: e.target.checked }))} style={{ accentColor: '#2563eb' }} />
                  </label>
                  <div className="mt-2">
                    <div className="text-[11px] text-gray-400 mb-1">Tab Name (optional)</div>
                    <input className="input" value={categoryState.tabName} onChange={e => setCategoryState(s => ({ ...s, tabName: e.target.value }))} placeholder="Enter tab name" />
                  </div>
                </div>
                )}
              </div>
            </div>
          )}

          {rightView === 'cart' && (
            <div className="px-4 pb-24">
              {/* Header + Back */}
              <div className="flex items-center justify-between mb-3" style={{ borderBottom: '1px solid #2a2f3a', paddingBottom: 12 }}>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-gray-400">Design</span>
                  <span className="text-gray-600">›</span>
                  <span className="text-white font-medium">Cart</span>
                </div>
                <button className="btn btn-secondary text-xs" onClick={() => setRightView('builder')}>Back</button>
              </div>

              {/* Pages (same as homepage) */}
              <div className="py-3" style={{ borderBottom: '1px solid #2a2f3a' }}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300 font-semibold">Pages</div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('left')} aria-label="Scroll left"><ChevronLeftIcon /></button>
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('right')} aria-label="Scroll right"><ChevronRightIcon /></button>
                  </div>
                </div>
                <div className="mt-3" style={{ overflow: 'hidden' }}>
                  <div ref={pagesScrollRef} className="flex items-start gap-3" style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
                    {pages.map((p, index) => (
                      <div key={p.id} className="flex flex-col items-center gap-2 cursor-pointer select-none" style={{ width: 74 }} title={p.name}>
                        <div className="rounded bg-gray-800 border border-gray-700 overflow-hidden" style={{ width: 74, height: 110 }}>
                          <div style={{ width: 375, height: 667, transform: 'scale(0.18)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                            <iframe src={p.url} style={{ width: '375px', height: '667px', border: '0' }} />
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 truncate" style={{ width: 74 }}>{p.name}</div>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-2" style={{ width: 74 }}>
                      <button onClick={addPage} className="rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-blue-500 text-xl" style={{ width: 74, height: 110 }}>+
                      </button>
                      <div className="text-xs text-gray-400">Add</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESIGN LAYOUT (same as homepage) */}
              <div className="p-0 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-300 font-semibold">DESIGN LAYOUT</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Home', icon: <HomeIcon /> },
                    { name: 'Category', icon: <LayersIcon />, onClick: () => setRightView('category') },
                    { name: 'Search', icon: <SearchIcon />, onClick: () => setRightView('search') },
                    { name: 'Cart', icon: <ShoppingCartIcon />, onClick: () => setRightView('cart'), active: (rightView as string) === 'cart' },
                    { name: 'List Blog', icon: <ListIcon />, onClick: () => setRightView('listBlog') },
                    { name: 'Page', icon: <FileTextIcon />, onClick: () => setRightView('page') },
                    { name: 'Wishlist', icon: <HeartIcon /> },
                    { name: 'Profile', icon: <UserIcon /> },
                    { name: 'Static', icon: <FileTextIcon /> },
                    { name: 'Html', icon: <CodeIcon /> },
                    { name: 'Dynamic', icon: <ZapIcon /> },
                    { name: 'Tab Menu', icon: <MenuIcon /> },
                    { name: 'Scrollable', icon: <ScrollIcon /> },
                    { name: 'Videos', icon: <PlayIcon /> }
                  ].map((item) => (
                    <div key={item.name} className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-center cursor-pointer hover:bg-gray-700 transition" onClick={item.onClick as any} style={(item as any).active ? { borderColor: '#2563eb', background: 'rgba(37,99,235,0.18)' } : undefined}>
                      <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded bg-gray-700 text-gray-300">{item.icon}</div>
                      <div className="text-xs text-gray-200 font-medium">{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-300 font-semibold mb-3 uppercase" style={{ marginTop: 16 }}>Cart Settings</div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <label className="text-sm text-gray-200">Cart Style</label>
                  <select
                    className="input"
                    value={cartState.style}
                    onChange={(e) => setCartState(s => ({ ...s, style: e.target.value as any }))}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Minimal">Minimal</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <label className="text-sm text-gray-200">Checkout Button Position</label>
                  <select
                    className="input"
                    value={cartState.checkoutButtonPosition}
                    onChange={(e) => setCartState(s => ({ ...s, checkoutButtonPosition: e.target.value as any }))}
                  >
                    <option>Top Right</option>
                    <option>Bottom Right</option>
                    <option>Top Left</option>
                    <option>Bottom Left</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {rightView === 'listBlog' && (
            <div className="px-4 pb-24">
              {/* Header + Back */}
              <div className="flex items-center justify-between mb-3" style={{ borderBottom: '1px solid #2a2f3a', paddingBottom: 12 }}>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-gray-400">Design</span>
                  <span className="text-gray-600">›</span>
                  <span className="text-white font-medium">List Blog</span>
                </div>
                <button className="btn btn-secondary text-xs" onClick={() => setRightView('builder')}>Back</button>
              </div>

              {/* Pages */}
              <div className="py-3" style={{ borderBottom: '1px solid #2a2f3a' }}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300 font-semibold">Pages</div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('left')} aria-label="Scroll left"><ChevronLeftIcon /></button>
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('right')} aria-label="Scroll right"><ChevronRightIcon /></button>
                  </div>
                </div>
                <div className="mt-3" style={{ overflow: 'hidden' }}>
                  <div ref={pagesScrollRef} className="flex items-start gap-3" style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
                    {pages.map((p, index) => (
                      <div key={p.id} className="flex flex-col items-center gap-2 cursor-pointer select-none" style={{ width: 74 }} title={p.name}>
                        <div className="rounded bg-gray-800 border border-gray-700 overflow-hidden" style={{ width: 74, height: 110 }}>
                          <div style={{ width: 375, height: 667, transform: 'scale(0.18)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                            <iframe src={p.url} style={{ width: '375px', height: '667px', border: '0' }} />
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 truncate" style={{ width: 74 }}>{p.name}</div>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-2" style={{ width: 74 }}>
                      <button onClick={addPage} className="rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-blue-500 text-xl" style={{ width: 74, height: 110 }}>+
                      </button>
                      <div className="text-xs text-gray-400">Add</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESIGN LAYOUT */}
              <div className="p-0 pt-4">
                <div className="flex items-center justify-between mb-3"><div className="text-sm text-gray-300 font-semibold">DESIGN LAYOUT</div></div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Home', icon: <HomeIcon /> },
                    { name: 'Category', icon: <LayersIcon />, onClick: () => setRightView('category') },
                    { name: 'Search', icon: <SearchIcon />, onClick: () => setRightView('search') },
                    { name: 'Cart', icon: <ShoppingCartIcon />, onClick: () => setRightView('cart') },
                    { name: 'List Blog', icon: <ListIcon />, onClick: () => setRightView('listBlog'), active: (rightView as string) === 'listBlog' },
                    { name: 'Page', icon: <FileTextIcon />, onClick: () => setRightView('page') },
                    { name: 'Wishlist', icon: <HeartIcon /> },
                    { name: 'Profile', icon: <UserIcon /> },
                    { name: 'Static', icon: <FileTextIcon /> },
                    { name: 'Html', icon: <CodeIcon /> },
                    { name: 'Dynamic', icon: <ZapIcon /> },
                    { name: 'Tab Menu', icon: <MenuIcon /> },
                    { name: 'Scrollable', icon: <ScrollIcon /> },
                    { name: 'Videos', icon: <PlayIcon /> }
                  ].map((item) => (
                    <div key={item.name} className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-center cursor-pointer hover:bg-gray-700 transition" onClick={item.onClick as any} style={(item as any).active ? { borderColor: '#2563eb', background: 'rgba(37,99,235,0.18)' } : undefined}>
                      <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded bg-gray-700 text-gray-300">{item.icon}</div>
                      <div className="text-xs text-gray-200 font-medium">{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-300 font-semibold mb-3 uppercase" style={{ marginTop: 16 }}>List Blog Settings</div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-gray-200">Style</label>
                <select
                  className="input"
                  value={listBlogState.style}
                  onChange={(e) => setListBlogState({ style: e.target.value as any })}
                >
                  <option>Staggered</option>
                  <option>Grid</option>
                </select>
              </div>
            </div>
          )}

          {rightView === 'search' && (
            <div className="px-4 pb-24">
              {/* Header + Back */}
              <div className="flex items-center justify-between mb-3" style={{ borderBottom: '1px solid #2a2f3a', paddingBottom: 12 }}>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-gray-400">Design</span>
                  <span className="text-gray-600">›</span>
                  <span className="text-white font-medium">Search</span>
                </div>
                <button className="btn btn-secondary text-xs" onClick={() => setRightView('builder')}>Back</button>
              </div>

              {/* Pages */}
              <div className="py-3" style={{ borderBottom: '1px solid #2a2f3a' }}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300 font-semibold">Pages</div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('left')} aria-label="Scroll left"><ChevronLeftIcon /></button>
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('right')} aria-label="Scroll right"><ChevronRightIcon /></button>
                  </div>
                </div>
                <div className="mt-3" style={{ overflow: 'hidden' }}>
                  <div ref={pagesScrollRef} className="flex items-start gap-3" style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
                    {pages.map((p, index) => (
                      <div key={p.id} className="flex flex-col items-center gap-2 cursor-pointer select-none" style={{ width: 74 }} title={p.name}>
                        <div className="rounded bg-gray-800 border border-gray-700 overflow-hidden" style={{ width: 74, height: 110 }}>
                          <div style={{ width: 375, height: 667, transform: 'scale(0.18)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                            <iframe src={p.url} style={{ width: '375px', height: '667px', border: '0' }} />
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 truncate" style={{ width: 74 }}>{p.name}</div>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-2" style={{ width: 74 }}>
                      <button onClick={addPage} className="rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-blue-500 text-xl" style={{ width: 74, height: 110 }}>+
                      </button>
                      <div className="text-xs text-gray-400">Add</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESIGN LAYOUT */}
              <div className="p-0 pt-4">
                <div className="flex items-center justify-between mb-3"><div className="text-sm text-gray-300 font-semibold">DESIGN LAYOUT</div></div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Home', icon: <HomeIcon /> },
                    { name: 'Category', icon: <LayersIcon />, onClick: () => setRightView('category') },
                    { name: 'Search', icon: <SearchIcon />, onClick: () => setRightView('search'), active: (rightView as string) === 'search' },
                    { name: 'Cart', icon: <ShoppingCartIcon />, onClick: () => setRightView('cart') },
                    { name: 'List Blog', icon: <ListIcon />, onClick: () => setRightView('listBlog') },
                    { name: 'Page', icon: <FileTextIcon />, onClick: () => setRightView('page') },
                    { name: 'Wishlist', icon: <HeartIcon /> },
                    { name: 'Profile', icon: <UserIcon /> },
                    { name: 'Static', icon: <FileTextIcon /> },
                    { name: 'Html', icon: <CodeIcon /> },
                    { name: 'Dynamic', icon: <ZapIcon /> },
                    { name: 'Tab Menu', icon: <MenuIcon /> },
                    { name: 'Scrollable', icon: <ScrollIcon /> },
                    { name: 'Videos', icon: <PlayIcon /> }
                  ].map((item) => (
                    <div key={item.name} className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-center cursor-pointer hover:bg-gray-700 transition" onClick={item.onClick as any} style={(item as any).active ? { borderColor: '#2563eb', background: 'rgba(37,99,235,0.18)' } : undefined}>
                      <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded bg-gray-700 text-gray-300">{item.icon}</div>
                      <div className="text-xs text-gray-200 font-medium">{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-300 font-semibold mb-3 uppercase" style={{ marginTop: 16 }}>Search Settings</div>
              <div className="text-sm text-gray-400">No additional settings yet.</div>
            </div>
          )}

          {rightView === 'page' && (
            <div className="px-4 pb-24">
              {/* Header + Back */}
              <div className="flex items-center justify-between mb-3" style={{ borderBottom: '1px solid #2a2f3a', paddingBottom: 12 }}>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-gray-400">Design</span>
                  <span className="text-gray-600">›</span>
                  <span className="text-white font-medium">Page</span>
                </div>
                <button className="btn btn-secondary text-xs" onClick={() => setRightView('builder')}>Back</button>
              </div>

              {/* Pages */}
              <div className="py-3" style={{ borderBottom: '1px solid #2a2f3a' }}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300 font-semibold">Pages</div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('left')} aria-label="Scroll left"><ChevronLeftIcon /></button>
                    <button className="btn btn-secondary text-xs" onClick={() => scrollPages('right')} aria-label="Scroll right"><ChevronRightIcon /></button>
                  </div>
                </div>
                <div className="mt-3" style={{ overflow: 'hidden' }}>
                  <div ref={pagesScrollRef} className="flex items-start gap-3" style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
                    {pages.map((p, index) => (
                      <div key={p.id} className="flex flex-col items-center gap-2 cursor-pointer select-none" style={{ width: 74 }} title={p.name}>
                        <div className="rounded bg-gray-800 border border-gray-700 overflow-hidden" style={{ width: 74, height: 110 }}>
                          <div style={{ width: 375, height: 667, transform: 'scale(0.18)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                            <iframe src={p.url} style={{ width: '375px', height: '667px', border: '0' }} />
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 truncate" style={{ width: 74 }}>{p.name}</div>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-2" style={{ width: 74 }}>
                      <button onClick={addPage} className="rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-blue-500 text-xl" style={{ width: 74, height: 110 }}>+
                      </button>
                      <div className="text-xs text-gray-400">Add</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESIGN LAYOUT */}
              <div className="p-0 pt-4">
                <div className="flex items-center justify-between mb-3"><div className="text-sm text-gray-300 font-semibold">DESIGN LAYOUT</div></div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Home', icon: <HomeIcon /> },
                    { name: 'Category', icon: <LayersIcon />, onClick: () => setRightView('category') },
                    { name: 'Search', icon: <SearchIcon />, onClick: () => setRightView('search') },
                    { name: 'Cart', icon: <ShoppingCartIcon />, onClick: () => setRightView('cart') },
                    { name: 'List Blog', icon: <ListIcon />, onClick: () => setRightView('listBlog') },
                    { name: 'Page', icon: <FileTextIcon />, onClick: () => setRightView('page'), active: (rightView as string) === 'page' },
                    { name: 'Wishlist', icon: <HeartIcon /> },
                    { name: 'Profile', icon: <UserIcon /> },
                    { name: 'Static', icon: <FileTextIcon /> },
                    { name: 'Html', icon: <CodeIcon /> },
                    { name: 'Dynamic', icon: <ZapIcon /> },
                    { name: 'Tab Menu', icon: <MenuIcon /> },
                    { name: 'Scrollable', icon: <ScrollIcon /> },
                    { name: 'Videos', icon: <PlayIcon /> }
                  ].map((item) => (
                    <div key={item.name} className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-center cursor-pointer hover:bg-gray-700 transition" onClick={item.onClick as any} style={(item as any).active ? { borderColor: '#2563eb', background: 'rgba(37,99,235,0.18)' } : undefined}>
                      <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded bg-gray-700 text-gray-300">{item.icon}</div>
                      <div className="text-xs text-gray-200 font-medium">{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-300 font-semibold mb-3 uppercase" style={{ marginTop: 16 }}>Custom Page Code</div>
              <div className="text-[11px] text-gray-400 mb-4">Add custom code for this page. Supported: TypeScript/React (client-only), HTML/JSX, Tailwind/normal CSS.</div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-200 mb-2">Markup (HTML / JSX)</div>
                  <textarea
                    className="input"
                    style={{ minHeight: 120, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                    placeholder="<section>...</section>"
                    value={pageCode.markup}
                    onChange={(e) => setPageCode(s => ({ ...s, markup: e.target.value }))}
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-200 mb-2">CSS / Tailwind</div>
                  <textarea
                    className="input"
                    style={{ minHeight: 120, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                    placeholder={".container { display: grid }\n/* or Tailwind classes in markup */"}
                    value={pageCode.css}
                    onChange={(e) => setPageCode(s => ({ ...s, css: e.target.value }))}
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-200 mb-2">Script (TypeScript / React)</div>
                  <textarea
                    className="input"
                    style={{ minHeight: 140, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                    placeholder={"export default function MyWidget(){\n  return (<div>Hello</div>)\n}"}
                    value={pageCode.script}
                    onChange={(e) => setPageCode(s => ({ ...s, script: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Layout Drawer */}
      {isAddLayoutOpen && (
          <div className="fixed inset-0" style={{ zIndex: 50 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setIsAddLayoutOpen(false)} />
            <div className="absolute top-0 right-0 h-full bg-gray-900 border-l border-gray-700" style={{ width: 420 }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #2a2f3a' }}>
                <div className="text-sm text-white font-medium">Add Layout</div>
                <button className="btn btn-secondary text-xs" onClick={() => setIsAddLayoutOpen(false)}>Close</button>
              </div>
              <div className="p-3" style={{ borderBottom: '1px solid #2a2f3a' }}>
                <input className="input" placeholder="Search layouts..." />
              </div>
              <div className="p-3" style={{ height: 'calc(100% - 106px)', overflowY: 'auto' }}>
                <div className="space-y-2">
                  {layoutOptions.map(opt => (
                    <button
                      key={opt.type}
                      onClick={() => {
                        // Add to CMS layout
                        const newBlock = createBlock(opt.type as CmsBlockType);
                        cms.addBlock(newBlock);
                        
                        // Also add to visual list for UI
                        setHomeLayoutItems(prev => [
                          ...prev,
                          { key: newBlock.id, name: opt.name, type: opt.type }
                        ]);
                        setIsAddLayoutOpen(false);
                      }}
                      className="w-full flex items-center justify-between rounded-lg bg-gray-800 border border-gray-700 px-3 py-3 text-left hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-gray-300">{getLayoutIcon(opt.type)}</div>
                        <div className="text-white text-sm">{opt.name}</div>
                      </div>
                      {opt.badge && <span className="text-[10px] text-red-400">{opt.badge}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}