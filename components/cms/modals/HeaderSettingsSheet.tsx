"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HeaderWidgetEditor } from "@/components/cms/widgets/HeaderWidget";

export interface HeaderNavConfig {
  placement?: 'mobile' | 'desktop' | 'both';
  mobileCollapsed?: boolean;
  left?: Array<{ id: string; type: string; label?: string; href?: string; icon?: string }>;
  center?: Array<{ id: string; type: string; label?: string; href?: string; icon?: string }>;
  right?: Array<{ id: string; type: string; label?: string; href?: string; icon?: string }>;
  menuItems?: Array<{ id: string; label: string; href: string }>;
  brandText?: string;
  enableAppBar?: boolean;
  alwaysShowAppBar?: boolean;
  backgroundColor?: string;
  elevation?: number;
  pinned?: boolean;
  expandedItems?: Array<{ id: string; label: string; type?: string }>;
  showOnScreens?: string[];
}

export function HeaderSettingsSheet({
  open,
  value,
  onOpenChange,
  onChange,
}: {
  open: boolean;
  value: HeaderNavConfig;
  onOpenChange: (open: boolean) => void;
  onChange: (v: HeaderNavConfig) => void;
}) {
  const nav: HeaderNavConfig = {
    placement: value.placement ?? 'both',
    mobileCollapsed: value.mobileCollapsed ?? true,
    left: value.left ?? [],
    center: value.center ?? [],
    right: value.right ?? [],
    menuItems: value.menuItems ?? [],
    brandText: value.brandText ?? 'BALENCIAGA',
    enableAppBar: value.enableAppBar ?? true,
    alwaysShowAppBar: value.alwaysShowAppBar ?? true,
    backgroundColor: value.backgroundColor ?? '#ffffff',
    elevation: value.elevation ?? 0,
    pinned: value.pinned ?? true,
    expandedItems: value.expandedItems ?? [],
    showOnScreens: value.showOnScreens ?? [
      'home','category','search','cart','listBlog','page','wishlist','profile','static','html','dynamic','tabMenu','scrollable','videos','homeSearch','detailBlog','categorySearch','orders','product'
    ],
  };

  const update = (partial: Partial<HeaderNavConfig>) => onChange({ ...nav, ...partial });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] p-0 bg-[#0b0c0f] border-l border-[#2a2a30]">
        <SheetHeader className="px-4 py-3 border-b border-[#2a2a30]">
          <SheetTitle className="text-xs text-white">AppBar</SheetTitle>
        </SheetHeader>

        <div className="p-3 space-y-4 overflow-y-auto" style={{ height: 'calc(100vh - 48px)' }}>
          {/* AppBar Items */}
          <section className="rounded-lg" style={{ background: '#0f1115', border: '1px solid #2a2a30' }}>
            <div className="flex items-center justify-between px-4 py-3 text-white" style={{ borderBottom: '1px solid #2a2a30' }}>
              <span className="text-xs tracking-wide">APPBAR ITEMS</span>
              <button
                className="text-xs text-white px-3 py-2 rounded-md"
                style={{ background: '#2563eb' }}
                onClick={() => onChange({
                  ...nav,
                  right: [ ...(nav.right || []), { id: String(Date.now()), type: 'custom', label: 'Text' } ]
                })}
              >
                + ADD NEW
              </button>
            </div>
            <div className="p-4 space-y-2">
              {(nav.right || []).length === 0 && (
                <div className="text-[11px] text-gray-400">No items yet.</div>
              )}
              {(nav.right || []).map((it, idx) => (
                <div key={it.id} className="flex items-center justify-between px-3 py-2 rounded-md" style={{ background: '#000000', border: '1px solid #2a2a30' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 cursor-move">⋮⋮</span>
                    <span className="text-white text-sm">{it.label || it.type}</span>
                  </div>
                  <button
                    className="text-red-400 text-xs"
                    onClick={() => onChange({ ...nav, right: (nav.right || []).filter((_, i) => i !== idx) })}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg" style={{ background: '#0f1115', border: '1px solid #2a2a30' }}>
            <div className="flex items-center justify-between px-4 py-3 text-white" style={{ borderBottom: '1px solid #2a2a30' }}>
              <span className="text-xs tracking-wide">HEADER NAVIGATION</span>
            </div>
            <div className="p-4">
              <HeaderWidgetEditor
                value={{
                  placement: nav.placement as any,
                  mobileCollapsed: !!nav.mobileCollapsed,
                  left: nav.left as any,
                  center: nav.center as any,
                  right: nav.right as any,
                  menuItems: nav.menuItems || [],
                } as any}
                onChange={(v: any) => update({
                  placement: v.placement,
                  mobileCollapsed: v.mobileCollapsed,
                  left: v.left,
                  center: v.center,
                  right: v.right,
                  menuItems: v.menuItems,
                })}
              />
              <div className="mt-3 space-y-2 text-xs text-white">
                <div className="flex items-center justify-between">
                  <span>Brand text</span>
                  <input className="w-2/3 px-2 py-1 rounded bg-black text-white border border-[#2a2a30]" value={nav.brandText} onChange={(e) => update({ brandText: e.target.value })} />
                </div>
                <label className="flex items-center justify-between">
                  <span>Mobile collapsed menu</span>
                  <input type="checkbox" checked={!!nav.mobileCollapsed} onChange={(e) => update({ mobileCollapsed: e.target.checked })} />
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-lg" style={{ background: '#0f1115', border: '1px solid #2a2a30' }}>
            <div className="flex items-center justify-between px-4 py-3 text-white" style={{ borderBottom: '1px solid #2a2a30' }}>
              <span className="text-xs tracking-wide">APPBAR SETTINGS</span>
            </div>
            <div className="p-4 space-y-3 text-white text-xs">
              <label className="flex items-center justify-between">
                <span>Enable AppBar</span>
                <input type="checkbox" checked={!!nav.enableAppBar} onChange={(e) => update({ enableAppBar: e.target.checked })} />
              </label>
              <label className="flex items-center justify-between">
                <span>Always Show AppBar</span>
                <input type="checkbox" checked={!!nav.alwaysShowAppBar} onChange={(e) => update({ alwaysShowAppBar: e.target.checked })} />
              </label>
              <div className="flex items-center justify-between">
                <span>Background Color</span>
                <input type="color" value={nav.backgroundColor} onChange={(e) => update({ backgroundColor: e.target.value })} />
              </div>
              <div className="flex items-center justify-between">
                <span>Elevation</span>
                <div className="flex items-center gap-3 w-2/3">
                  <input type="range" min={0} max={10} step={1} value={nav.elevation ?? 0} onChange={(e) => update({ elevation: Number(e.target.value) })} className="w-full" />
                  <span className="px-2 py-1 rounded bg-black border border-[#2a2a30] text-xs">{(nav.elevation ?? 0).toFixed(1)}</span>
                </div>
              </div>
              <label className="flex items-center justify-between">
                <span>Pinned</span>
                <input type="checkbox" checked={!!nav.pinned} onChange={(e) => update({ pinned: e.target.checked })} />
              </label>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default HeaderSettingsSheet;


