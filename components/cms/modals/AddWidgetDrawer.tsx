"use client";

interface AddWidgetDrawerProps {
  onClose: () => void;
  onSelect: (item: { title: string; type: string }) => void;
}

import type { ReactElement } from 'react'

export default function AddWidgetDrawer({ onClose, onSelect }: AddWidgetDrawerProps) {
  const widgets: Array<{ title: string; type: string; badge?: string; icon: ReactElement }> = [
    { title: 'Header', type: 'header', icon: <HeaderIcon /> },
    { title: 'Footer', type: 'footer', icon: <FooterIcon /> },
    { title: 'Background', type: 'background', icon: <ImageIcon /> },
    { title: 'Banner Image', type: 'bannerImage', icon: <ImageIcon /> },
    { title: 'Blogs', type: 'blogs', icon: <ListIcon /> },
    { title: 'Dynamic Blog', type: 'dynamicBlog', badge: 'New!', icon: <ListIcon /> },
    { title: 'Button', type: 'button', icon: <SquareIcon /> },
    { title: 'Category', type: 'category', icon: <GridIcon /> },
    { title: 'Divider', type: 'divider', icon: <DividerIcon /> },
    { title: 'Header Search', type: 'headerSearch', icon: <SearchIcon /> },
    { title: 'Header View', type: 'headerView', badge: 'New!', icon: <HeaderViewIcon /> },
    { title: 'Horizontal Products', type: 'horizontalProducts', icon: <ProductsIcon /> },
    { title: 'Instagram Story', type: 'instagramStory', icon: <StoryIcon /> },
    { title: 'List Card', type: 'listCard', badge: 'New!', icon: <CardIcon /> },
    // Removed: Logo, Menu List, Spacer, Story, Animated Stack per request
    { title: 'Testimonial', type: 'testimonial', icon: <TestimonialIcon /> },
    { title: 'Testimonial Slider', type: 'testimonialSlider', icon: <SliderIcon /> },
    { title: 'Text', type: 'text', icon: <TextIcon /> },
    { title: 'Web Embed', type: 'webEmbed', icon: <EmbedIcon /> }
  ];

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

function HeaderIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="4" rx="2" /><rect x="3" y="10" width="12" height="2" rx="1" /></svg>); }
function FooterIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="16" width="18" height="4" rx="2" /><rect x="3" y="12" width="12" height="2" rx="1" /></svg>); }


