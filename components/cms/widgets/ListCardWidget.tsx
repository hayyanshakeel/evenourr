"use client";

import { useState } from "react";
import { WidgetConfig } from "./types";

export default function ListCardWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const lc = config.listCard || {};
  const update = (partial: Partial<WidgetConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="space-y-4">
      <Section title="SETTINGS" collapsible defaultOpen>
        <InputRow label="Title" value={lc.title || ''} onChange={(v) => update({ listCard: { ...lc, title: v } })} />
        <InputRow label="Subtitle" value={lc.subtitle || ''} onChange={(v) => update({ listCard: { ...lc, subtitle: v } })} />
        <SliderRow label="Card Count" value={lc.cardCount ?? 3} min={1} max={10} onChange={(v) => update({ listCard: { ...lc, cardCount: v } })} />
        <SliderRow label="Spacing" value={lc.spacing ?? 10} onChange={(v) => update({ listCard: { ...lc, spacing: v } })} />
        <Toggle label="Show Image" value={!!lc.showImage} onChange={(v) => update({ listCard: { ...lc, showImage: v } })} />
        <Toggle label="Show Description" value={!!lc.showDescription} onChange={(v) => update({ listCard: { ...lc, showDescription: v } })} />
      </Section>
      <Section title="MARGIN" collapsible defaultOpen>
        <SliderRow label="Left" value={lc.marginLeft ?? 0} onChange={(v) => update({ listCard: { ...lc, marginLeft: v } })} />
        <SliderRow label="Right" value={lc.marginRight ?? 0} onChange={(v) => update({ listCard: { ...lc, marginRight: v } })} />
        <SliderRow label="Top" value={lc.marginTop ?? 0} onChange={(v) => update({ listCard: { ...lc, marginTop: v } })} />
        <SliderRow label="Bottom" value={lc.marginBottom ?? 0} onChange={(v) => update({ listCard: { ...lc, marginBottom: v } })} />
      </Section>
    </div>
  );
}

function Section({ title, children, collapsible = false, defaultOpen = true }: { title: string; children: React.ReactNode; collapsible?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg" style={{ background: '#0f1115', border: '1px solid #2a2a30' }}>
      <div className="flex items-center justify-between px-4 py-3 text-white" style={{ borderBottom: '1px solid #2a2a30' }}>
        <span className="text-xs tracking-wide">{title}</span>
        {collapsible && (<button onClick={() => setOpen(o => !o)} className="text-gray-400">{open ? '▾' : '▸'}</button>)}
      </div>
      {(open || !collapsible) && (
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

function InputRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-2/3 px-3 py-1.5 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} />
    </div>
  );
}


