"use client";

import { useRef, useState } from "react";
import { CategoryItem, WidgetConfig } from "./types";

export default function CategoryWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const update = (partial: Partial<WidgetConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="space-y-4">
      {/* Styles */}
      <Section title="STYLES">
        <div className="grid grid-cols-4 gap-2 text-white">
          {([
            {k:'icon',label:'Icon'},
            {k:'image',label:'Image'},
            {k:'text',label:'Text'},
            {k:'menu',label:'Menu With Products'}
          ] as const).map(({k,label}) => (
            <button key={k} onClick={() => update({ category: { ...(config.category || {}), style: k as any } })} className={`rounded-md px-3 py-3 text-xs border ${config.category?.style === k ? 'border-blue-500 bg-[#0f1115] text-white' : 'border-[#2a2a30] bg-black text-gray-300'}`}>{label}</button>
          ))}
        </div>
      </Section>

      {/* Data */}
      <Section title="DATA">
        <div className="space-y-2 text-white">
          <button onClick={() => fileInputRef.current?.click()} className="w-full text-left px-4 py-3 rounded-md" style={{ background: '#0f0f12', border: '1px dashed #2a2a30', color: '#e5e7eb' }}>+ Add New Item</button>
          <input ref={fileInputRef} onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const body = new FormData();
            body.append('file', file);
            const res = await fetch('/api/upload/image', { method: 'POST', body });
            let url: string | undefined = undefined;
            if (res.ok) { const r = await res.json(); url = r.url; }
            const newItem: CategoryItem = { id: String(Date.now()), imageUrl: url };
            update({ category: { ...(config.category || {}), data: [ ...(config.category?.data || []), newItem ] } });
            setSelectedIndex((config.category?.data || []).length);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }} type="file" accept="image/*" className="hidden" />
          {(config.category?.data || []).length > 0 && (
            <div className="space-y-2">
              {(config.category?.data || []).map((it, idx) => (
                <button key={it.id} onClick={() => setSelectedIndex(idx)} className={`w-full flex items-center justify-between px-3 py-2 rounded border ${selectedIndex === idx ? 'border-blue-500 bg-[#0f1115] text-white' : 'border-[#2a2a30] bg-black text-gray-300'}`}>
                  <span>(id)</span>
                  <span>🧩</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Icon style */}
      {config.category?.style === 'icon' && (
        <>
          <Section title="ICON STYLE">
            <Toggle label="Gradient Style" value={!!config.category?.gradientStyle} onChange={(v) => update({ category: { ...(config.category || {}), gradientStyle: v } })} />
            <Toggle label="Horizontal Mode" value={!!config.category?.horizontalMode} onChange={(v) => update({ category: { ...(config.category || {}), horizontalMode: v } })} />
            <Toggle label="Hide Background" value={!!config.category?.hideBackground} onChange={(v) => update({ category: { ...(config.category || {}), hideBackground: v } })} />
            <Toggle label="Hide Item Label" value={!!config.category?.hideItemLabel} onChange={(v) => update({ category: { ...(config.category || {}), hideItemLabel: v } })} />
            <Toggle label="Enable Wrap Mode" value={!!config.category?.enableWrapMode} onChange={(v) => update({ category: { ...(config.category || {}), enableWrapMode: v } })} />
            <SliderRow label="Separate Width" value={config.category?.separateWidth ?? 24} onChange={(v) => update({ category: { ...(config.category || {}), separateWidth: v } })} />
            <SliderRow label="Size" value={config.category?.size ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), size: v } })} />
            <SliderRow label="Spacing" value={config.category?.spacing ?? 12} onChange={(v) => update({ category: { ...(config.category || {}), spacing: v } })} />
            <SliderRow label="Radius" value={config.category?.radius ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), radius: v } })} />
            <SliderRow label="Padding X" value={config.category?.paddingX ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), paddingX: v } })} />
            <SliderRow label="Padding Y" value={config.category?.paddingY ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), paddingY: v } })} />
            <SliderRow label="Margin X" value={config.category?.marginX ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), marginX: v } })} />
            <SliderRow label="Margin Y" value={config.category?.marginY ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), marginY: v } })} />
          </Section>

          <Section title="ICON BORDER">
            <SliderRow label="Border Width" value={config.category?.iconBorderWidth ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), iconBorderWidth: v } })} />
            <SelectRow label="Border Style" value={config.category?.iconBorderStyle || 'solid'} options={[{label:'solid',value:'solid'},{label:'dashed',value:'dashed'},{label:'dotted',value:'dotted'}]} onChange={(v) => update({ category: { ...(config.category || {}), iconBorderStyle: v as any } })} />
            <SliderRow label="Spacing" value={config.category?.iconBorderSpacing ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), iconBorderSpacing: v } })} />
            <ColorRow label="Border Color" value={config.category?.iconBorderColor || '#ffffff'} onChange={(v) => update({ category: { ...(config.category || {}), iconBorderColor: v } })} />
          </Section>

          <Section title="LABEL SETTING">
            <SliderRow label="Font Size" value={config.category?.labelFontSize ?? 14} onChange={(v) => update({ category: { ...(config.category || {}), labelFontSize: v } })} />
          </Section>

          <Section title="BOX SHADOW">
            <Toggle label="Enable Box Shadow" value={!!config.category?.boxShadowEnabled} onChange={(v) => update({ category: { ...(config.category || {}), boxShadowEnabled: v } })} />
            {config.category?.boxShadowEnabled && (
              <>
                <SliderRow label="Blur Radius" value={config.category?.boxShadowBlur ?? 10} onChange={(v) => update({ category: { ...(config.category || {}), boxShadowBlur: v } })} />
                <SliderRow label="Opacity" value={config.category?.boxShadowOpacity ?? 0.1} onChange={(v) => update({ category: { ...(config.category || {}), boxShadowOpacity: v } })} />
                <SliderRow label="Offset X" value={config.category?.boxShadowOffsetX ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), boxShadowOffsetX: v } })} />
                <SliderRow label="Offset Y" value={config.category?.boxShadowOffsetY ?? 10} onChange={(v) => update({ category: { ...(config.category || {}), boxShadowOffsetY: v } })} />
              </>
            )}
          </Section>

          <Section title="MARGIN">
            <SliderRow label="Left" value={config.category?.marginLeft ?? 15} onChange={(v) => update({ category: { ...(config.category || {}), marginLeft: v } })} />
            <SliderRow label="Right" value={config.category?.marginRight ?? 15} onChange={(v) => update({ category: { ...(config.category || {}), marginRight: v } })} />
            <SliderRow label="Top" value={config.category?.marginTop ?? 10} onChange={(v) => update({ category: { ...(config.category || {}), marginTop: v } })} />
            <SliderRow label="Bottom" value={config.category?.marginBottom ?? 10} onChange={(v) => update({ category: { ...(config.category || {}), marginBottom: v } })} />
          </Section>
        </>
      )}

      {/* Image style */}
      {config.category?.style === 'image' && (
        <>
          <Section title="COMMON SETTINGS">
            <Toggle label="Enable Wrap Mode" value={!!config.category?.useWrapMode} onChange={(v) => update({ category: { ...(config.category || {}), useWrapMode: v } })} />
            <Toggle label="Gradient Style" value={!!config.category?.useGradient} onChange={(v) => update({ category: { ...(config.category || {}), useGradient: v } })} />
            <Toggle label="Use Column" value={!!config.category?.useColumn} onChange={(v) => update({ category: { ...(config.category || {}), useColumn: v } })} />
            <Toggle label="Enable Border" value={!!config.category?.enableBorder} onChange={(v) => update({ category: { ...(config.category || {}), enableBorder: v } })} />
            <SliderRow label="Border" value={config.category?.border ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), border: v } })} />
            <SelectRow label="Text Alignment" value={config.category?.textAlignment || 'topLeft'} options={[{label:'topLeft',value:'topLeft'},{label:'topCenter',value:'topCenter'},{label:'topRight',value:'topRight'}]} onChange={(v) => update({ category: { ...(config.category || {}), textAlignment: v as any } })} />
            <SliderRow label="Padding X" value={config.category?.imagePaddingX ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), imagePaddingX: v } })} />
            <SliderRow label="Padding Y" value={config.category?.imagePaddingY ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), imagePaddingY: v } })} />
            <SliderRow label="Margin X" value={config.category?.imageMarginX ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), imageMarginX: v } })} />
            <SliderRow label="Margin Y" value={config.category?.imageMarginY ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), imageMarginY: v } })} />
          </Section>

          <Section title="IMAGE SETTINGS">
            <SliderRow label="Width" value={config.category?.imageWidth ?? 10} onChange={(v) => update({ category: { ...(config.category || {}), imageWidth: v } })} />
            <SliderRow label="Height" value={config.category?.imageHeight ?? 10} onChange={(v) => update({ category: { ...(config.category || {}), imageHeight: v } })} />
            <SliderRow label="Radius" value={config.category?.imageRadius ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), imageRadius: v } })} />
            <SelectRow label="Image BoxFit" value={config.category?.imageBoxFit || 'cover'} options={[{label:'cover',value:'cover'},{label:'contain',value:'contain'},{label:'fill',value:'fill'},{label:'none',value:'none'}]} onChange={(v) => update({ category: { ...(config.category || {}), imageBoxFit: v as any } })} />
          </Section>

          <Section title="IMAGE BORDER">
            <SliderRow label="Border Width" value={config.category?.imageBorderWidth ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), imageBorderWidth: v } })} />
            <SelectRow label="Border Style" value={config.category?.imageBorderStyle || 'solid'} options={[{label:'solid',value:'solid'},{label:'dashed',value:'dashed'},{label:'dotted',value:'dotted'}]} onChange={(v) => update({ category: { ...(config.category || {}), imageBorderStyle: v as any } })} />
            <SliderRow label="Spacing" value={config.category?.imageBorderSpacing ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), imageBorderSpacing: v } })} />
            <ColorRow label="Border Color" value={config.category?.imageBorderColor || '#ffffff'} onChange={(v) => update({ category: { ...(config.category || {}), imageBorderColor: v } })} />
          </Section>

          <Section title="LABEL SETTING">
            <SliderRow label="Font Size" value={config.category?.labelFontSize ?? 14} onChange={(v) => update({ category: { ...(config.category || {}), labelFontSize: v } })} />
          </Section>

          <Section title="BOX SHADOW">
            <Toggle label="Enable Box Shadow" value={!!config.category?.boxShadowEnabled} onChange={(v) => update({ category: { ...(config.category || {}), boxShadowEnabled: v } })} />
            {config.category?.boxShadowEnabled && (
              <>
                <SliderRow label="Blur Radius" value={config.category?.boxShadowBlur ?? 10} onChange={(v) => update({ category: { ...(config.category || {}), boxShadowBlur: v } })} />
                <SliderRow label="Opacity" value={config.category?.boxShadowOpacity ?? 0.1} onChange={(v) => update({ category: { ...(config.category || {}), boxShadowOpacity: v } })} />
                <SliderRow label="Offset X" value={config.category?.boxShadowOffsetX ?? 0} onChange={(v) => update({ category: { ...(config.category || {}), boxShadowOffsetX: v } })} />
                <SliderRow label="Offset Y" value={config.category?.boxShadowOffsetY ?? 10} onChange={(v) => update({ category: { ...(config.category || {}), boxShadowOffsetY: v } })} />
              </>
            )}
          </Section>

          <Section title="MARGIN">
            <SliderRow label="Left" value={config.category?.marginLeft ?? 15} onChange={(v) => update({ category: { ...(config.category || {}), marginLeft: v } })} />
            <SliderRow label="Right" value={config.category?.marginRight ?? 15} onChange={(v) => update({ category: { ...(config.category || {}), marginRight: v } })} />
            <SliderRow label="Top" value={config.category?.marginTop ?? 10} onChange={(v) => update({ category: { ...(config.category || {}), marginTop: v } })} />
            <SliderRow label="Bottom" value={config.category?.marginBottom ?? 10} onChange={(v) => update({ category: { ...(config.category || {}), marginBottom: v } })} />
          </Section>
        </>
      )}

      {/* Item edit */}
      {selectedIndex !== null && (config.category?.data || [])[selectedIndex] && (
        <Section title="ITEM CATEGORY">
          {(() => {
            const items = config.category?.data || [];
            const idx = selectedIndex as number;
            const item = items[idx] as CategoryItem | undefined;
            if (!item) return <div className="text-xs text-gray-400">Select an item</div>;
            const updateItem = (partial: Partial<CategoryItem>) => {
              const next = [...items];
              next[idx] = { ...(item as CategoryItem), ...partial } as CategoryItem;
              update({ category: { ...(config.category || {}), data: next } });
            };
            return (
              <div className="space-y-3 text-white">
                <div className="rounded-lg border border-dashed p-4 text-center" style={{ borderColor: '#2a2a30' }}>
                  <div className="text-gray-400 mb-2">Drag and Drop here</div>
                </div>
                <SelectRow label="Category" value={item.category || 'None'} options={[{label:'None',value:'None'},{label:'Electronics',value:'Electronics'},{label:'Clothing',value:'Clothing'}]} onChange={(v) => updateItem({ category: v })} />
                <Toggle label="Show Featured Products" value={!!item.showFeatured} onChange={(v) => updateItem({ showFeatured: v })} />
                <Toggle label="Only On Sale" value={!!item.onlyOnSale} onChange={(v) => updateItem({ onlyOnSale: v })} />
                <SelectRow label="Order By" value={item.orderBy || 'none'} options={[{label:'none',value:'none'},{label:'name',value:'name'},{label:'date',value:'date'}]} onChange={(v) => updateItem({ orderBy: v as any })} />
                <SelectRow label="Order" value={item.order || 'none'} options={[{label:'none',value:'none'},{label:'asc',value:'asc'},{label:'desc',value:'desc'}]} onChange={(v) => updateItem({ order: v as any })} />
                <Toggle label="Keep Original Color" value={!!item.keepOriginalColor} onChange={(v) => updateItem({ keepOriginalColor: v })} />
                <ColorRow label="Background Color" value={item.backgroundColor || '#0b0c0f'} onChange={(v) => updateItem({ backgroundColor: v })} />
                <Toggle label="Override New Label" value={!!item.overrideNewLabel} onChange={(v) => updateItem({ overrideNewLabel: v })} />
                <div className="flex justify-end"><button className="text-red-400 text-sm" onClick={() => { const remaining = items.filter((_, i) => i !== idx); update({ category: { ...(config.category || {}), data: remaining } }); setSelectedIndex(null); }}>Delete</button></div>
              </div>
            );
          })()}
        </Section>
      )}
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

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between text-white">
      <span>{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
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


