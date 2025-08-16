"use client";

import { useState } from "react";
import { WidgetConfig } from "./types";

export default function HorizontalProductsWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const hp = config.horizontalProducts || {};
  const update = (partial: Partial<WidgetConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="space-y-4">
      <Section title="DATA" collapsible defaultOpen>
        <InputRow label="Header" value={hp.header || ''} onChange={(v) => update({ horizontalProducts: { ...hp, header: v } })} />
        <Toggle label="Use Special Products" value={!!hp.useSpecialProducts} onChange={(v) => update({ horizontalProducts: { ...hp, useSpecialProducts: v } })} />
        <SelectRow label="Category" value={hp.category || ''} options={[{label:'', value:''}]} onChange={(v) => update({ horizontalProducts: { ...hp, category: v } })} />
        <button className="text-blue-400 text-sm">Advanced Params +</button>
      </Section>

      <Section title="TYPE" collapsible defaultOpen>
        <LayoutGrid value={hp.layout || 'twoColumn'} onChange={(v) => update({ horizontalProducts: { ...hp, layout: v as any } })} />
      </Section>

      <Section title="PRODUCT CARD OPTIONS" collapsible defaultOpen>
        <SelectRow label="Image BoxFit" value={hp.imageBoxFit || 'COVER'} options={['COVER','CONTAIN','FILL','NONE'].map(v=>({label:v,value:v}))} onChange={(v) => update({ horizontalProducts: { ...hp, imageBoxFit: v as any } })} />
        <SliderRow label="Min Height" value={hp.minHeight ?? 125} onChange={(v) => update({ horizontalProducts: { ...hp, minHeight: v } })} />
        <SelectRow label="Card Design" value={hp.cardDesign || 'card'} options={[{label:'card',value:'card'},{label:'plain',value:'plain'},{label:'outline',value:'outline'}]} onChange={(v) => update({ horizontalProducts: { ...hp, cardDesign: v as any } })} />
        <SliderRow label="Card Radius" value={hp.cardRadius ?? 3} onChange={(v) => update({ horizontalProducts: { ...hp, cardRadius: v } })} />
        <Toggle label="Show Image With Circular Radius" value={!!hp.showImageWithCircularRadius} onChange={(v) => update({ horizontalProducts: { ...hp, showImageWithCircularRadius: v } })} />
        <SliderRow label="Image Ratio" value={hp.imageRatio ?? 1.2} min={0.5} max={3} step={0.1} onChange={(v) => update({ horizontalProducts: { ...hp, imageRatio: v } })} />
        <Toggle label="Show Title" value={!!hp.showTitle} onChange={(v) => update({ horizontalProducts: { ...hp, showTitle: v } })} />
        <SliderRow label="Title Max Line" value={hp.titleMaxLine ?? 2} min={1} max={5} step={1} onChange={(v) => update({ horizontalProducts: { ...hp, titleMaxLine: v } })} />
        <Toggle label="Show Pricing" value={!!hp.showPricing} onChange={(v) => update({ horizontalProducts: { ...hp, showPricing: v } })} />
        <Toggle label="Show Stock Status" value={!!hp.showStockStatus} onChange={(v) => update({ horizontalProducts: { ...hp, showStockStatus: v } })} />
        <Toggle label="Enable Rating" value={!!hp.enableRating} onChange={(v) => update({ horizontalProducts: { ...hp, enableRating: v } })} />
        <Toggle label="Show Heart Icon" value={!!hp.showHeartIcon} onChange={(v) => update({ horizontalProducts: { ...hp, showHeartIcon: v } })} />
        <div className="h-px my-2" style={{ background: '#2a2a30' }} />
        <Toggle label="Cart Bottom Sheet" value={!!hp.cartBottomSheet} onChange={(v) => update({ horizontalProducts: { ...hp, cartBottomSheet: v } })} />
        <Toggle label="Show Cart Quantity" value={!!hp.showCartQuantity} onChange={(v) => update({ horizontalProducts: { ...hp, showCartQuantity: v } })} />
        <Toggle label="Show Cart Button" value={!!hp.showCartButton} onChange={(v) => update({ horizontalProducts: { ...hp, showCartButton: v } })} />
        <Toggle label="Show Cart Icon" value={!!hp.showCartIcon} onChange={(v) => update({ horizontalProducts: { ...hp, showCartIcon: v } })} />
        <ColorRow label="Cart Icon Color" value={hp.cartIconColor || '#ffffff'} onChange={(v) => update({ horizontalProducts: { ...hp, cartIconColor: v } })} />
      </Section>

      <Section title="PRODUCT CARD SHADOW" collapsible>
        <Toggle label="Enable Box Shadow" value={!!hp.cardShadowEnabled} onChange={(v) => update({ horizontalProducts: { ...hp, cardShadowEnabled: v } })} />
      </Section>

      <Section title="HORIZONTAL OPTIONS" collapsible defaultOpen>
        <SliderRow label="Rows" value={hp.rows ?? 1} min={1} max={5} onChange={(v) => update({ horizontalProducts: { ...hp, rows: v } })} />
        <SliderRow label="Horizontal Margin" value={hp.horizontalMargin ?? 6} onChange={(v) => update({ horizontalProducts: { ...hp, horizontalMargin: v } })} />
        <SliderRow label="Vertical Margin" value={hp.verticalMargin ?? 0} onChange={(v) => update({ horizontalProducts: { ...hp, verticalMargin: v } })} />
        <SliderRow label="Horizontal Padding" value={hp.horizontalPadding ?? 6} onChange={(v) => update({ horizontalProducts: { ...hp, horizontalPadding: v } })} />
        <SliderRow label="Vertical Padding" value={hp.verticalPadding ?? 2} onChange={(v) => update({ horizontalProducts: { ...hp, verticalPadding: v } })} />
      </Section>

      <Section title="SETTINGS" collapsible defaultOpen>
        <Toggle label="Show Featured Products" value={!!hp.showFeaturedProducts} onChange={(v) => update({ horizontalProducts: { ...hp, showFeaturedProducts: v } })} />
        <Toggle label="Enable Sticky Scrolling" value={!!hp.enableStickyScrolling} onChange={(v) => update({ horizontalProducts: { ...hp, enableStickyScrolling: v } })} />
        <Toggle label="Only On Sale" value={!!hp.onlyOnSale} onChange={(v) => update({ horizontalProducts: { ...hp, onlyOnSale: v } })} />
        <SelectRow label="Order By" value={hp.orderBy || 'none'} options={['none','title','popularity','rating','date','price','menu_order','rand'].map(v=>({label:v,value:v}))} onChange={(v) => update({ horizontalProducts: { ...hp, orderBy: v as any } })} />
        <SelectRow label="Order" value={hp.order || 'none'} options={['none','asc','desc'].map(v=>({label:v,value:v}))} onChange={(v) => update({ horizontalProducts: { ...hp, order: v as any } })} />
        <Toggle label="Customize Limit Products" value={!!hp.customizeLimitProducts} onChange={(v) => update({ horizontalProducts: { ...hp, customizeLimitProducts: v } })} />
        <Toggle label="Enable Auto Sliding" value={!!hp.enableAutoSliding} onChange={(v) => update({ horizontalProducts: { ...hp, enableAutoSliding: v } })} />
      </Section>

      <Section title="BACKGROUND" collapsible defaultOpen>
        <ColorRow label="Color" value={hp.backgroundColor || '#0b0c0f'} onChange={(v) => update({ horizontalProducts: { ...hp, backgroundColor: v } })} />
        <SliderRow label="Border Radius" value={hp.backgroundBorderRadius ?? 10} onChange={(v) => update({ horizontalProducts: { ...hp, backgroundBorderRadius: v } })} />
        <UploadRow onUploaded={(url) => update({ horizontalProducts: { ...hp, backgroundImageUrl: url } })} />
        <SelectRow label="Image BoxFit" value={hp.backgroundImageBoxFit || 'COVER'} options={['COVER','CONTAIN','FILL','NONE'].map(v=>({label:v,value:v}))} onChange={(v) => update({ horizontalProducts: { ...hp, backgroundImageBoxFit: v as any } })} />
        <Toggle label="Enable Parallax Effect" value={!!hp.enableParallaxEffect} onChange={(v) => update({ horizontalProducts: { ...hp, enableParallaxEffect: v } })} />
        <Toggle label="Customize Space" value={!!hp.customizeSpace} onChange={(v) => update({ horizontalProducts: { ...hp, customizeSpace: v } })} />
        <Toggle label="Use Max Width" value={!!hp.useMaxWidth} onChange={(v) => update({ horizontalProducts: { ...hp, useMaxWidth: v } })} />
        <Toggle label="Customize Width" value={!!hp.customizeWidth} onChange={(v) => update({ horizontalProducts: { ...hp, customizeWidth: v } })} />
        <Toggle label="Customize Height" value={!!hp.customizeHeight} onChange={(v) => update({ horizontalProducts: { ...hp, customizeHeight: v } })} />
        <SliderRow label="Margin Left" value={hp.marginLeft ?? 0} onChange={(v) => update({ horizontalProducts: { ...hp, marginLeft: v } })} />
        <SliderRow label="Margin Right" value={hp.marginRight ?? 0} onChange={(v) => update({ horizontalProducts: { ...hp, marginRight: v } })} />
        <SliderRow label="Margin Top" value={hp.marginTop ?? 0} onChange={(v) => update({ horizontalProducts: { ...hp, marginTop: v } })} />
        <SliderRow label="Margin Bottom" value={hp.marginBottom ?? 0} onChange={(v) => update({ horizontalProducts: { ...hp, marginBottom: v } })} />
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

function InputRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-2/3 px-3 py-1.5 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} />
    </div>
  );
}

function UploadRow({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="rounded-lg border border-dashed" style={{ borderColor: '#2a2a30' }}>
      <div className="p-4 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="mb-2">Drag and Drop here</div>
          <button disabled={busy} onClick={async () => {
            // trigger hidden file input via temporary element
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              setBusy(true);
              const fd = new FormData();
              fd.append('file', file);
              const r = await fetch('/api/upload/image', { method: 'POST', body: fd });
              if (r.ok) { const { url } = await r.json(); onUploaded(url); }
              setBusy(false);
            };
            input.click();
          }} className="px-3 py-1.5 rounded bg-[#0f0f12] border" style={{ borderColor: '#2a2a30' }}>{busy ? 'Uploading...' : 'Browse File'}</button>
        </div>
      </div>
    </div>
  );
}

function LayoutGrid({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const items = [
    { key:'twoColumn', label:'TWO COLUMN' },
    { key:'threeColumn', label:'THREE COLUMN' },
    { key:'fourColumn', label:'FOUR COLUMN' },
    { key:'recentView', label:'RECENT VIEW' },
    { key:'card', label:'CARD' },
    { key:'staggered', label:'STAGGERED' },
    { key:'saleOff', label:'SALE OFF' },
    { key:'listTile', label:'LIST TILE' },
    { key:'simpleList', label:'SIMPLE LIST' },
    { key:'largeCard', label:'LARGE CARD' },
    { key:'quiltedGridTile', label:'QUILTED GRID TILE' },
    { key:'bannerSlider', label:'BANNER SLIDER' },
    { key:'carousel', label:'CAROUSEL' },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(it => (
        <button key={it.key} onClick={() => onChange(it.key)} className={`rounded-md p-3 text-xs border ${value === it.key ? 'border-blue-500 bg-[#0f1115] text-white' : 'border-[#2a2a30] bg-black text-gray-300'}`}>{it.label}</button>
      ))}
    </div>
  );
}


