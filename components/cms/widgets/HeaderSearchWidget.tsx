"use client";

import { useState } from "react";
import { WidgetConfig } from "./types";

export default function HeaderSearchWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const [openBoxShadow, setOpenBoxShadow] = useState(false);
  const [openMargin, setOpenMargin] = useState(true);
  const [openPadding, setOpenPadding] = useState(false);
  const update = (partial: Partial<WidgetConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="space-y-4">
      <Section title="TEXT STYLE" collapsible defaultOpen>
        <InputRow label="Text" value={config.headerSearch?.text || ''} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), text: v } })} />
        <SliderRow label="Font Size" value={config.headerSearch?.fontSize ?? 20} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), fontSize: v } })} />
        <ColorRow label="Text Color" value={config.headerSearch?.textColor || '#ffffff'} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), textColor: v } })} />
        <SliderRow label="Opacity" value={config.headerSearch?.textOpacity ?? 1} min={0} max={1} step={0.01} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), textOpacity: v } })} />
      </Section>

      <Section title="INPUT STYLE" collapsible defaultOpen>
        <SliderRow label="Height" value={config.headerSearch?.height ?? 44} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), height: v } })} />
        <SliderRow label="Radius" value={config.headerSearch?.radius ?? 30} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), radius: v } })} />
        <ColorRow label="Background Color" value={config.headerSearch?.backgroundColor || '#000000'} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), backgroundColor: v } })} />
        <Toggle label="Use Primary Color Light" value={!!config.headerSearch?.usePrimaryColorLight} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), usePrimaryColorLight: v } })} />
        <ColorRow label="Outside Color" value={config.headerSearch?.outsideColor || '#000000'} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), outsideColor: v } })} />
        <Toggle label="Show Border" value={!!config.headerSearch?.showBorder} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), showBorder: v } })} />
      </Section>

      <Section title="BOX SHADOW" collapsible isOpen={openBoxShadow} onToggle={() => setOpenBoxShadow(!openBoxShadow)}>
        <Toggle label="Enable Box Shadow" value={!!config.headerSearch?.boxShadowEnabled} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), boxShadowEnabled: v } })} />
        {config.headerSearch?.boxShadowEnabled && (
          <>
            <SliderRow label="Spread Radius" value={config.headerSearch?.boxShadowSpread ?? 10} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), boxShadowSpread: v } })} />
            <SliderRow label="Blur Radius" value={config.headerSearch?.boxShadowBlur ?? 10} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), boxShadowBlur: v } })} />
            <SliderRow label="Opacity" value={config.headerSearch?.boxShadowOpacity ?? 0.1} min={0} max={1} step={0.01} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), boxShadowOpacity: v } })} />
            <SliderRow label="Offset X" value={config.headerSearch?.boxShadowOffsetX ?? 0} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), boxShadowOffsetX: v } })} />
            <SliderRow label="Offset Y" value={config.headerSearch?.boxShadowOffsetY ?? 10} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), boxShadowOffsetY: v } })} />
          </>
        )}
      </Section>

      <Section title="MARGIN" collapsible isOpen={openMargin} onToggle={() => setOpenMargin(!openMargin)}>
        <SliderRow label="Left" value={config.headerSearch?.marginLeft ?? 0} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), marginLeft: v } })} />
        <SliderRow label="Right" value={config.headerSearch?.marginRight ?? 0} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), marginRight: v } })} />
        <SliderRow label="Top" value={config.headerSearch?.marginTop ?? 15} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), marginTop: v } })} />
        <SliderRow label="Bottom" value={config.headerSearch?.marginBottom ?? 15} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), marginBottom: v } })} />
      </Section>

      <Section title="PADDING" collapsible isOpen={openPadding} onToggle={() => setOpenPadding(!openPadding)}>
        <SliderRow label="Left" value={config.headerSearch?.paddingLeft ?? 5} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), paddingLeft: v } })} />
        <SliderRow label="Right" value={config.headerSearch?.paddingRight ?? 15} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), paddingRight: v } })} />
        <SliderRow label="Top" value={config.headerSearch?.paddingTop ?? 0} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), paddingTop: v } })} />
        <SliderRow label="Bottom" value={config.headerSearch?.paddingBottom ?? 0} onChange={(v) => update({ headerSearch: { ...(config.headerSearch || {}), paddingBottom: v } })} />
      </Section>
    </div>
  );
}

function Section({ title, children, collapsible = false, defaultOpen = true, isOpen, onToggle }: { title: string; children: React.ReactNode; collapsible?: boolean; defaultOpen?: boolean; isOpen?: boolean; onToggle?: () => void }) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = typeof isOpen === 'boolean' ? isOpen : localOpen;
  const toggle = onToggle || (() => setLocalOpen(o => !o));
  return (
    <div className="rounded-lg" style={{ background: '#0f1115', border: '1px solid #2a2a30' }}>
      <div className="flex items-center justify-between px-4 py-3 text-white" style={{ borderBottom: '1px solid #2a2a30' }}>
        <span className="text-xs tracking-wide">{title}</span>
        {collapsible && (
          <button onClick={toggle} className="text-gray-400" aria-label="toggle">{open ? '▾' : '▸'}</button>
        )}
      </div>
      {(!collapsible || open) && (
        <div className="p-4 text-gray-200 space-y-3">{children}</div>
      )}
    </div>
  );
}

function SliderRow({ label, value, onChange, min = 0, max = 400, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <div className="flex items-center gap-3 w-2/3">
        <input className="w-full" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <span className="px-2 py-1 rounded bg-black text-white text-xs" style={{ border: '1px solid #2a2a30' }}>{value.toFixed(1)}</span>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between text-white">
      <span>{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function InputRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-2/3 px-3 py-1.5 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} />
    </div>
  );
}


