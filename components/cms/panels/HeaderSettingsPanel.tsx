"use client";

import React from "react";
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
}

export default function HeaderSettingsPanel({
  value,
  onChange,
  onEditItem,
  onAddNew,
}: {
  value: HeaderNavConfig;
  onChange: (v: HeaderNavConfig) => void;
  onEditItem: (index: number) => void;
  onAddNew: () => void;
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
  };

  const update = (partial: Partial<HeaderNavConfig>) => onChange({ ...nav, ...partial });

  return (
    <div className="space-y-4">
      {/* HEADER NAVIGATION section removed per request */}

      {/* APPBAR SETTINGS */}
      <div className="rounded-lg border border-[#2a2a30] bg-black">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a30]">
          <span className="text-xs tracking-wide text-gray-200">APPBAR SETTINGS</span>
        </div>
        <div className="p-4 space-y-3 text-gray-200 text-xs">
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
      </div>
    </div>
  );
}


