"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export interface AppBarItemConfig {
  id?: string;
  type: 'text' | 'profile' | 'logo' | 'wishlist' | 'cart';
  title?: string;
  alignment?: 'left' | 'center' | 'right';
  logoUrl?: string;
  fontSize?: number;
  fontWeight?: number;
  textColor?: string;
  textOpacity?: number;
  backgroundColor?: string;
  borderRadius?: number;
  customWidthEnabled?: boolean;
  customHeightEnabled?: boolean;
  margin?: { left: number; right: number; top: number; bottom: number };
  padding?: { left: number; right: number; top: number; bottom: number };
}

export default function AppBarItemSheet({
  open,
  value,
  onOpenChange,
  onChange,
  onDelete,
}: {
  open: boolean;
  value: AppBarItemConfig;
  onOpenChange: (open: boolean) => void;
  onChange: (v: AppBarItemConfig) => void;
  onDelete: () => void;
}) {
  const v: AppBarItemConfig = {
    id: value.id,
    type: value.type || 'text',
    title: value.title || '',
    alignment: value.alignment || 'right',
    logoUrl: value.logoUrl,
    fontSize: value.fontSize ?? 16,
    fontWeight: value.fontWeight ?? 400,
    textColor: value.textColor || '#111827',
    textOpacity: value.textOpacity ?? 0.5,
    backgroundColor: value.backgroundColor || '#111827',
    borderRadius: value.borderRadius ?? 0,
    customWidthEnabled: value.customWidthEnabled ?? false,
    customHeightEnabled: value.customHeightEnabled ?? false,
    margin: value.margin || { left: 0, right: 0, top: 0, bottom: 0 },
    padding: value.padding || { left: 0, right: 0, top: 0, bottom: 0 },
  };

  const update = (partial: Partial<AppBarItemConfig>) => onChange({ ...v, ...partial });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] p-0 bg-[#0b0c0f] border-l border-[#2a2a30]">
        <SheetHeader className="px-4 py-3 border-b border-[#2a2a30]">
          <SheetTitle className="text-xs text-white">AppBar Item</SheetTitle>
        </SheetHeader>

        <div className="p-3 space-y-4 overflow-y-auto" style={{ height: 'calc(100vh - 48px)' }}>
          {/* TYPE */}
          <section className="rounded-lg" style={{ background: '#0f1115', border: '1px solid #2a2a30' }}>
            <div className="flex items-center justify-between px-4 py-3 text-white" style={{ borderBottom: '1px solid #2a2a30' }}>
              <span className="text-xs tracking-wide">TYPE</span>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3 text-white text-[11px]">
              {([
                ['text','TEXT'],
                ['profile','PROFILE'],
                ['logo','LOGO'],
                ['wishlist','WISHLIST'],
                ['cart','CART'],
              ] as const).map(([k,label]) => (
                <button
                  key={k}
                  onClick={() => update({ type: k as any })}
                  className={`px-3 py-3 rounded border ${v.type===k? 'border-blue-500 bg-[#0c0e12]' : 'border-[#2a2a30] bg-black'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* ALIGNMENT */}
          <section className="rounded-lg" style={{ background: '#0f1115', border: '1px solid #2a2a30' }}>
            <div className="flex items-center justify-between px-4 py-3 text-white" style={{ borderBottom: '1px solid #2a2a30' }}>
              <span className="text-xs tracking-wide">ALIGNMENT</span>
            </div>
            <div className="p-4 text-white text-xs flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input type="radio" name="align" checked={v.alignment==='left'} onChange={() => update({ alignment: 'left' })} />
                <span>Left</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="align" checked={v.alignment==='center'} onChange={() => update({ alignment: 'center' })} />
                <span>Center</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="align" checked={v.alignment==='right'} onChange={() => update({ alignment: 'right' })} />
                <span>Right</span>
              </label>
            </div>
          </section>

          {/* LOGO UPLOAD */}
          {v.type === 'logo' && (
            <section className="rounded-lg" style={{ background: '#0f1115', border: '1px solid #2a2a30' }}>
              <div className="flex items-center justify-between px-4 py-3 text-white" style={{ borderBottom: '1px solid #2a2a30' }}>
                <span className="text-xs tracking-wide">LOGO</span>
              </div>
              <div className="p-4 text-white text-xs space-y-3">
                {v.logoUrl ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.logoUrl} alt="Logo" className="h-8 w-auto rounded bg-black/30 border border-[#2a2a30]" />
                    <button
                      className="px-3 py-1 rounded bg-[#2563eb] text-white"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = () => {
                          const file = (input.files && input.files[0]) || null;
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => update({ logoUrl: String(reader.result || '') });
                          reader.readAsDataURL(file);
                        };
                        input.click();
                      }}
                    >
                      Replace Logo
                    </button>
                    <button className="px-3 py-1 rounded bg-red-600/20 text-red-300 border border-red-700" onClick={() => update({ logoUrl: undefined })}>Remove</button>
                  </div>
                ) : (
                  <button
                    className="px-3 py-2 rounded bg-[#2563eb] text-white"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = () => {
                        const file = (input.files && input.files[0]) || null;
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => update({ logoUrl: String(reader.result || '') });
                        reader.readAsDataURL(file);
                      };
                      input.click();
                    }}
                  >
                    Upload Logo
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Delete Button */}
          <section className="rounded-lg" style={{ background: '#0f1115', border: '1px solid #2a2a30' }}>
            <div className="p-4 text-center">
              <button className="text-red-400 text-sm px-4 py-2 rounded bg-red-900/20 hover:bg-red-900/30" onClick={onDelete}>
                Delete Item
              </button>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}


