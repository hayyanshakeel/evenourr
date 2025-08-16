"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Top Toolbar Component
interface Props {
  viewport?: 'mobile' | 'tablet' | 'desktop';
  setViewport?: (v: 'mobile' | 'tablet' | 'desktop') => void;
}

export default function TopToolbar({ viewport = 'mobile', setViewport }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <header
      className="flex items-center justify-between px-4 py-2"
      style={{ background: '#000', borderBottom: '1px solid #1f1f22', position: 'sticky', top: 0, zIndex: 30, paddingRight: 440 }}
    >
      {/* Left - Save/Publish/Version (moved left, removed search/breadcrumb) */}
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 text-white rounded-md text-sm" style={{ background: '#10b981', border: '1px solid #1f9f73' }}>Save</button>
        <button className="px-4 py-2 text-white rounded-md text-sm" style={{ background: '#15151a', border: '1px solid #2a2a30' }}>Publish</button>
        <div className="px-2 py-1 text-xs text-gray-200 rounded-md" style={{ background: '#0b0c0f', border: '1px solid #2a2a30' }}>V31</div>
      </div>

      {/* Center spacer */}
      <div />

      {/* Right - Viewport Toggle + Theme */}
      <div className="flex items-center gap-5 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded-md border border-[#1f1f22] bg-[#15151a] text-white"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            {mounted ? (resolvedTheme === 'dark' ? 'Light' : 'Dark') : 'Theme'}
          </button>
        </div>
        <div className="flex items-center gap-2 bg-black border border-[#1f1f22] rounded-lg p-1 mr-2" style={{ position: 'relative', right: 0 }}>
          <button aria-label="Mobile" onClick={() => setViewport?.('mobile')} className={`${viewport === 'mobile' ? 'border border-[#2a2a30] bg-[#15151a]' : 'hover:bg-[#15151a]'} w-8 h-8 rounded-md flex items-center justify-center text-white`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
          </button>
          <button aria-label="Tablet" onClick={() => setViewport?.('tablet')} className={`${viewport === 'tablet' ? 'border border-[#2a2a30] bg-[#15151a]' : 'hover:bg-[#15151a]'} w-8 h-8 rounded-md flex items-center justify-center text-white`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="12" y1="20" x2="12" y2="20"/></svg>
          </button>
          <button aria-label="Desktop" onClick={() => setViewport?.('desktop')} className={`${viewport === 'desktop' ? 'border border-[#2a2a30] bg-[#15151a]' : 'hover:bg-[#15151a]'} w-8 h-8 rounded-md flex items-center justify-center text-white`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="14" rx="2"/><line x1="8" y1="22" x2="16" y2="22"/><line x1="12" y1="18" x2="12" y2="22"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
