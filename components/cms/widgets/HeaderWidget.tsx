"use client";

import { useState } from "react";
import { Search as SearchIcon, ShoppingCart, Heart, User, Menu, Store, Trash2, Bookmark, Bell } from "lucide-react";

export interface HeaderItem {
  id: string;
  type: 'logo' | 'menu' | 'search' | 'cart' | 'wishlist' | 'profile' | 'custom';
  label?: string;
  href?: string;
  icon?: string;
}

export interface HeaderConfig {
  placement: 'mobile' | 'desktop' | 'both';
  mobileCollapsed: boolean;
  left: HeaderItem[];
  center: HeaderItem[];
  right: HeaderItem[];
  menuItems: Array<{ id: string; label: string; href: string }>;
}

export function HeaderWidgetEditor({ value, onChange }: { value: HeaderConfig; onChange: (v: HeaderConfig) => void }) {
  const [drag, setDrag] = useState<{ region: 'left' | 'center' | 'right'; index: number } | null>(null);
  const [showIconLib, setShowIconLib] = useState(false);
  const [iconRegion, setIconRegion] = useState<'left' | 'center' | 'right'>('right');
  const [customIconText, setCustomIconText] = useState('');

  const regions: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];

  const move = (fromRegion: 'left' | 'center' | 'right', fromIndex: number, toRegion: 'left' | 'center' | 'right', toIndex: number) => {
    const next: HeaderConfig = JSON.parse(JSON.stringify(value));
    const listFrom = (next as any)[fromRegion] as HeaderItem[];
    const listTo = (next as any)[toRegion] as HeaderItem[];
    const clampedTo = Math.max(0, Math.min(toIndex, listTo.length));
    const removed = listFrom.splice(fromIndex, 1);
    const moved = removed[0];
    if (moved) {
      listTo.splice(clampedTo, 0, moved);
    }
    onChange(next);
  };

  const addItem = (region: 'left' | 'center' | 'right', item: HeaderItem) => {
    const next: HeaderConfig = JSON.parse(JSON.stringify(value));
    (next as any)[region].push(item);
    onChange(next);
  };

  const palette: HeaderItem[] = [
    { id: 'logo', type: 'logo', label: 'Logo' },
    { id: 'menu', type: 'menu', label: 'Menu' },
    { id: 'search', type: 'search', label: 'Search' },
    { id: 'cart', type: 'cart', label: 'Cart' },
    { id: 'wishlist', type: 'wishlist', label: 'Wishlist' },
    { id: 'profile', type: 'profile', label: 'Profile' },
    { id: 'custom', type: 'custom', label: 'Link' },
  ];

  const renderIcon = (t: string) => {
    switch (t) {
      case 'logo':
        return <Store className="h-4 w-4" />;
      case 'menu':
        return <Menu className="h-4 w-4" />;
      case 'search':
        return <SearchIcon className="h-4 w-4" />;
      case 'cart':
        return <ShoppingCart className="h-4 w-4" />;
      case 'wishlist':
        return <Heart className="h-4 w-4" />;
      case 'profile':
        return <User className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {palette.map((p) => (
          <button key={p.id} className="px-3 py-2 rounded border border-[#2a2a30] bg-black text-white text-xs" onClick={() => addItem('right', { ...p, id: `${p.id}-${Date.now()}` })}>{p.label}</button>
        ))}
        <button className="px-3 py-2 rounded border border-[#2a2a30] bg-[#0f0f12] text-white text-xs" onClick={() => setShowIconLib(v => !v)}>Icon Library</button>
      </div>

      {showIconLib && (
        <div className="rounded border border-[#2a2a30] bg-[#0f0f12] p-3 space-y-3">
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <span>Add to:</span>
            {(['left','center','right'] as const).map(r => (
              <label key={r} className={`px-2 py-1 rounded border ${iconRegion===r ? 'border-blue-500 text-white' : 'border-[#2a2a30] text-gray-300'}`}>
                <input type="radio" className="mr-1" checked={iconRegion===r} onChange={() => setIconRegion(r)} />{r}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-2 text-white">
            {[{t:'search',I:SearchIcon},{t:'cart',I:ShoppingCart},{t:'wishlist',I:Heart},{t:'profile',I:User},{t:'bookmark',I:Bookmark},{t:'bell',I:Bell}].map(({t,I}) => (
              <button key={t} className="h-9 w-9 flex items-center justify-center rounded border border-[#2a2a30] bg-black hover:bg-[#111]" onClick={() => addItem(iconRegion,{ id:`${t}-${Date.now()}`, type:(t as any), label:t })}>
                <I className="h-4 w-4" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <input value={customIconText} onChange={(e)=>setCustomIconText(e.target.value)} placeholder="Custom icon/text (emoji, 1-3 chars)" className="flex-1 px-2 py-1 rounded bg-black border border-[#2a2a30] text-white" />
            <button className="px-2 py-1 rounded bg-blue-600 text-white" onClick={()=>{ if(!customIconText) return; addItem(iconRegion,{ id:`custom-${Date.now()}`, type:'custom', label: customIconText }); setCustomIconText(''); }}>Add</button>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-300">Drag to reorder. Move items across Left / Center / Right.</div>

      <div className="grid grid-cols-3 gap-3">
        {regions.map((region) => (
          <div
            key={region}
            className="rounded border border-[#2a2a30] bg-[#0f0f12]"
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
            onDrop={() => {
              if (!drag) return;
              const length = (value as any)[region].length;
              move(drag.region, drag.index, region, length);
              setDrag(null);
            }}
          >
            <div className="px-3 py-2 text-[11px] text-gray-200 flex items-center justify-between">
              <span className="capitalize font-medium">{region}</span>
              <span className="text-[10px] text-gray-500 whitespace-nowrap">Drop here</span>
            </div>
            <div className="p-2 space-y-2 min-h-[42px]">
              {(value as any)[region].map((it: HeaderItem, idx: number) => (
                <div
                  key={it.id}
                  draggable
                  onDragStart={(e) => { setDrag({ region, index: idx }); try { e.dataTransfer.setData('text/plain', `${region}:${idx}`); } catch {} }}
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!drag) {
                      try {
                        const raw = e.dataTransfer.getData('text/plain');
                        if (raw) {
                          const [r, i] = raw.split(':');
                          setDrag({ region: r as any, index: Number(i) });
                        }
                      } catch {}
                    }
                    const d = drag || { region, index: idx };
                    move(d.region as any, d.index as any, region, idx);
                    setDrag(null);
                  }}
                  className={`flex items-center justify-between gap-2 px-2 py-2 rounded bg-black text-white border border-[#2a2a30] ${drag && drag.region === region && drag.index === idx ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="cursor-move text-gray-400">⋮⋮</span>
                    {renderIcon(it.type)}
                    <span className="text-xs capitalize">{it.label || it.type}</span>
                  </div>
                  <button className="text-red-400 hover:text-red-300" aria-label="delete-item" title="Delete" onClick={() => {
                    const next: HeaderConfig = JSON.parse(JSON.stringify(value));
                    (next as any)[region].splice(idx, 1);
                    onChange(next);
                  }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


