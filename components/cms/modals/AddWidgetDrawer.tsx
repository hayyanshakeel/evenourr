"use client";

interface AddWidgetDrawerProps {
  onClose: () => void;
  onSelect: (item: { title: string; type: string }) => void;
  context?: 'category' | 'home' | 'default';
}

import type { ReactElement } from 'react'

export default function AddWidgetDrawer({ onClose, onSelect, context = 'default' }: AddWidgetDrawerProps) {
  // Define all available widgets
  const allWidgets: Array<{ title: string; type: string; badge?: string; icon: ReactElement; category?: string }> = [
    { title: 'Header', type: 'header', icon: <HeaderIcon />, category: 'layout' },
    { title: 'Footer', type: 'footer', icon: <FooterIcon />, category: 'layout' },
    { title: 'Background', type: 'background', icon: <ImageIcon />, category: 'media' },
    { title: 'Banner Image', type: 'bannerImage', icon: <ImageIcon />, category: 'media' },
    { title: 'Blogs', type: 'blogs', icon: <ListIcon />, category: 'content' },
    { title: 'Dynamic Blog', type: 'dynamicBlog', badge: 'New!', icon: <ListIcon />, category: 'content' },
    { title: 'Button', type: 'button', icon: <SquareIcon />, category: 'interactive' },
    { title: 'Divider', type: 'divider', icon: <DividerIcon />, category: 'layout' },
    { title: 'Header Search', type: 'headerSearch', icon: <SearchIcon />, category: 'interactive' },
    { title: 'Header View', type: 'headerView', badge: 'New!', icon: <HeaderViewIcon />, category: 'layout' },
    { title: 'Horizontal Products', type: 'horizontalProducts', icon: <ProductsIcon />, category: 'commerce' },
    { title: 'Instagram Story', type: 'instagramStory', icon: <StoryIcon />, category: 'media' },
    { title: 'List Card', type: 'listCard', badge: 'New!', icon: <CardIcon />, category: 'content' },
    { title: 'Testimonial', type: 'testimonial', icon: <TestimonialIcon />, category: 'content' },
    { title: 'Testimonial Slider', type: 'testimonialSlider', icon: <SliderIcon />, category: 'content' },
    { title: 'Text', type: 'text', icon: <TextIcon />, category: 'content' },
    { title: 'Web Embed', type: 'webEmbed', icon: <EmbedIcon />, category: 'interactive' },
    { title: 'Filter', type: 'filter', icon: <FilterIcon />, category: 'commerce' }
  ];

  // Reorder widgets based on context
  const getOrderedWidgets = () => {
    if (context === 'category') {
      // Category-relevant widgets first
      const categoryPriority = [
        'filter', 'horizontalProducts', 'bannerImage', 'text', 'button', 'divider'
      ];
      
      const priorityWidgets = allWidgets.filter(w => categoryPriority.includes(w.type));
      const otherWidgets = allWidgets.filter(w => !categoryPriority.includes(w.type));
      
      return [...priorityWidgets, ...otherWidgets];
    }
    
    // Default order for home and other contexts
    return allWidgets;
  };

  const widgets = getOrderedWidgets();

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: 420, background: '#000', borderLeft: '1px solid #2a2a30', zIndex: 50 }}>
      <div className="flex items-center gap-2 px-4 py-3 text-white" style={{ borderBottom: '1px solid #2a2a30', background: '#000' }}>
        <button onClick={onClose} className="text-gray-300 mr-2">‹</button>
        <span className="text-xs text-gray-300 tracking-wide">ADD WIDGET</span>
      </div>
      <div className="px-4 py-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100vh - 48px)' }}>
        {widgets.map((w) => (
          <button
            key={w.title}
            onClick={() => onSelect({ title: w.title, type: w.type })}
            className="w-full rounded-2xl flex items-center gap-4 px-5 py-5 text-left hover:bg-[#101114] transition"
            style={{ background: '#0f0f12', border: '1px solid #2a2a30', color: '#fff', minHeight: 72 }}
          >
            <div className="flex items-center justify-center rounded-lg" style={{ width: 40, height: 40, background: '#15151a', color: '#e5e7eb' }}>
              {w.icon}
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-medium text-white">{w.title}</div>
              {w.badge && <div className="text-[11px] text-red-400 mt-0.5">{w.badge}</div>}
            </div>
            <div className="text-gray-500 text-lg">›</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Simple inline icons (lightweight, consistent)
function LayersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  );
}
function ImageIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="14" rx="2"/><circle cx="8" cy="8" r="2"/><path d="M21 14l-5-5-4 4-2-2-5 5"/></svg>); }
function ListIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>); }
function SquareIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>); }
function GridIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>); }
function DividerIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>); }
function HeaderViewIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="4" rx="2"/><rect x="3" y="13" width="12" height="6" rx="2"/></svg>); }
function ProductsIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>); }
function StoryIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><rect x="3" y="3" width="18" height="18" rx="4"/></svg>); }
function CardIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="10" rx="2"/><line x1="7" y1="11" x2="17" y2="11"/></svg>); }
function LogoIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="6"/></svg>); }
function MenuIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>); }
function SpacerIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="5 12 19 12"/><polyline points="12 5 12 19"/></svg>); }
function TestimonialIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="3"/><path d="M2 21v-2a4 4 0 0 1 4-4h4"/></svg>); }
function SliderIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/></svg>); }
function TextIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M9 6v12"/></svg>); }
function EmbedIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="7 8 3 12 7 16"/><polyline points="17 8 21 12 17 16"/></svg>); }
function FilterIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>); }

function HeaderIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="4" rx="2" /><rect x="3" y="10" width="12" height="2" rx="1" /></svg>); }
function FooterIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="16" width="18" height="4" rx="2" /><rect x="3" y="12" width="12" height="2" rx="1" /></svg>); }


