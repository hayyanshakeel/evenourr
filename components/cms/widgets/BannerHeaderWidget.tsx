"use client";
import { useState } from "react";
import { WidgetConfig } from "./types";

export default function BannerHeaderWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const update = (partial: Partial<WidgetConfig>) => onChange({ ...config, ...partial });
  return (
    <div className="space-y-4 text-white">
      <Section title="HEADER TEXT">
        <Toggle label="Enable" value={!!config.headerEnabled} onChange={(v) => update({ headerEnabled: v })} />
        <div className="rounded-lg" style={{ border: '1px dashed #2a2a30' }}>
          <div className="p-4 space-y-3">
            <Toggle label="Enable Search Button" value={!!config.header?.enableSearchButton} onChange={(v) => update({ header: { ...(config.header || {}), enableSearchButton: v } })} />
            <Toggle label="Safearea" value={!!config.header?.safearea} onChange={(v) => update({ header: { ...(config.header || {}), safearea: v } })} />
            <SelectRow label="Type" value={config.header?.type || 'Static'} options={[{label:'Static',value:'Static'},{label:'Dynamic',value:'Dynamic'}]} onChange={(v) => update({ header: { ...(config.header || {}), type: v as any } })} />
            <InputRow label="Text" value={config.header?.text || ''} onChange={(v) => update({ header: { ...(config.header || {}), text: v } })} />
            <SliderRow label="Header Height" value={config.header?.height ?? 44} onChange={(v) => update({ header: { ...(config.header || {}), height: v } })} />
            <ColorRow label="Background Color" value={config.header?.backgroundColor || '#000000'} onChange={(v) => update({ header: { ...(config.header || {}), backgroundColor: v } })} />
            <SelectRow label="Alignment" value={config.header?.alignment || 'left'} options={[{label:'Left',value:'left'},{label:'Center',value:'center'},{label:'Right',value:'right'}]} onChange={(v) => update({ header: { ...(config.header || {}), alignment: v as any } })} />
          </div>
        </div>
      </Section>

      <Section title="TEXT STYLE">
        <SelectRow label="Header Font" value={config.header?.font || 'Roboto'} options={[{label:'Roboto',value:'Roboto'},{label:'Inter',value:'Inter'},{label:'System',value:'System'},{label:'Poppins',value:'Poppins'},{label:'Open Sans',value:'Open Sans'}]} onChange={(v) => update({ header: { ...(config.header || {}), font: v } })} />
        <SliderRow label="Font Size" value={config.header?.fontSize ?? 20} onChange={(v) => update({ header: { ...(config.header || {}), fontSize: v } })} />
        <SliderRow label="Font Weight" value={config.header?.fontWeight ?? 400} onChange={(v) => update({ header: { ...(config.header || {}), fontWeight: v } })} />
        <SliderRow label="Text Opacity" value={config.header?.textOpacity ?? 1} onChange={(v) => update({ header: { ...(config.header || {}), textOpacity: v } })} />
        <ColorRow label="Text Color" value={config.header?.textColor || '#ffffff'} onChange={(v) => update({ header: { ...(config.header || {}), textColor: v } })} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg" style={{ background: '#0f1115', border: '1px solid #2a2a30' }}>
      <div className="flex items-center justify-between px-4 py-3 text-white" style={{ borderBottom: '1px solid #2a2a30' }}>
        <span className="text-xs tracking-wide">{title}</span>
      </div>
      <div className="p-4 text-gray-200 space-y-3">{children}</div>
    </div>
  );
}

function SliderRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <div className="flex items-center gap-3 w-2/3">
        <input className="w-full" type="range" min={0} max={400} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <span className="px-2 py-1 rounded bg-black text-white text-xs" style={{ border: '1px solid #2a2a30' }}>{value.toFixed(1)}</span>
      </div>
    </div>
  );
}

function SelectRow({ label, value, options, onChange }: { label: string; value: string; options: Array<{label:string; value:string}>; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <select className="px-2 py-1 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
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


