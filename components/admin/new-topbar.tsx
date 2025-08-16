"use client";

import { Search, Bell, Grid as GridIcon } from 'lucide-react';

export function NewTopbar() {
  return (
    <header className="h-12 w-full bg-black border-b border-black flex items-center justify-between px-4 text-gray-200 select-none">
      {/* Brand */}
      <div className="flex items-center gap-2 text-sm select-none">
        <div className="h-6 w-6 rounded-full" style={{background:'conic-gradient(#e11d48 0 25%, #22c55e 0 50%, #3b82f6 0 75%, #eab308 0 100%)'}} />
        <span className="font-medium">Product of {" "}
          <span className="[--c1:#22c55e] [--c2:#ef4444] [--c3:#3b82f6] [--c4:#eab308] [--c5:#a855f7]">
            <span style={{color:'#22c55e'}}>N</span>
            <span style={{color:'#ef4444'}}>o</span>
            <span style={{color:'#3b82f6'}}>u</span>
            <span style={{color:'#eab308'}}>s</span>
            <span style={{color:'#a855f7'}}>e</span>
            <span style={{color:'#22c55e'}}>n</span>
          </span>
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative" style={{ width: 900, maxWidth: '76vw' }}>
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/90" />
          <input
            className="w-full h-10 rounded-[14px] bg-[#555555] text-white pl-11 pr-4 outline-none placeholder:text-gray-200 border border-transparent"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-6 pr-3 text-sm">
        <span className="text-[18px] leading-none" role="img" aria-label="lang">🇲🇾</span>
        <GridIcon className="h-[20px] w-[20px] text-white" />
        <div className="relative">
          <Bell className="h-[20px] w-[20px] text-white" />
          <span className="absolute -top-2 -right-3 h-5 min-w-5 px-1 flex items-center justify-center text-[11px] bg-[#ef2b19] text-white rounded-full">7</span>
        </div>
        <span className="h-6 w-6 rounded-full bg-[#44ff63] inline-block"/>
      </div>
    </header>
  );
}



