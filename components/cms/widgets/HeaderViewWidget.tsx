"use client";

import { useState } from "react";
import { WidgetConfig } from "./types";

type Action = NonNullable<NonNullable<WidgetConfig['headerView']>['actionType']>;

const ACTION_OPTIONS: { label: string; value: Action }[] = [
  { label: 'No navigation', value: 'none' },
  { label: 'Open a Product Screen', value: 'product' },
  { label: 'Open Products by Category/Tag', value: 'categoryTag' },
  { label: 'Select Screen to Open', value: 'screen' },
  { label: 'Select TabBar to Open', value: 'tab' },
  { label: 'Select TabBar Number to Open', value: 'tabNumber' },
  { label: 'Open URL by WebView', value: 'webview' },
  { label: 'Open URL by External Browser', value: 'external' },
  { label: 'Open Blog screen', value: 'blog' },
  { label: 'Open Blog Category', value: 'blogCategory' },
  { label: 'Open Coupon Screen', value: 'coupon' }
];

export default function HeaderViewWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const update = (partial: Partial<WidgetConfig>) => onChange({ ...config, ...partial });
  const hv = config.headerView || {};

  return (
    <div className="space-y-4">
      <Section title="SETTINGS" collapsible defaultOpen>
        <InputRow label="Text" value={hv.text || ''} onChange={(v) => update({ headerView: { ...hv, text: v } })} />
        <InputRow label="Action Text" value={hv.actionText || ''} onChange={(v) => update({ headerView: { ...hv, actionText: v } })} />

        <SelectRow full label="" value={hv.actionType || 'none'} options={ACTION_OPTIONS.map(o => ({ label: o.label, value: String(o.value) }))} onChange={(v) => update({ headerView: { ...hv, actionType: v as Action } })} />

        {/* Conditional per action */}
        {hv.actionType === 'product' && (
          <SelectRow label="Product" value={hv.product || ''} options={[{label:'Select product', value:''}]} onChange={(v) => update({ headerView: { ...hv, product: v } })} />
        )}
        {hv.actionType === 'categoryTag' && (
          <SelectRow label="Category" value={hv.category || ''} options={[{label:'None', value:''}]} onChange={(v) => update({ headerView: { ...hv, category: v } })} />
        )}
        {hv.actionType === 'screen' && (
          <>
            <SelectRow label="Screen" value={hv.screen || 'Home'} options={[{label:'Home', value:'Home'}]} onChange={(v) => update({ headerView: { ...hv, screen: v } })} />
            <Toggle label="Open in full screen mode" value={!!hv.fullScreen} onChange={(v) => update({ headerView: { ...hv, fullScreen: v } })} />
          </>
        )}
        {hv.actionType === 'tab' && (
          <SelectRow label="Tab" value={hv.tab || 'List Blog'} options={[{label:'List Blog',value:'List Blog'},{label:'Wishlist',value:'Wishlist'},{label:'Profile',value:'Profile'},{label:'Home',value:'Home'}]} onChange={(v) => update({ headerView: { ...hv, tab: v } })} />
        )}
        {hv.actionType === 'tabNumber' && (
          <SelectRow label="Tab Number" value={String(hv.tabNumber || 1)} options={[{label:'1 (List Blog)',value:'1'},{label:'2 (Wishlist)',value:'2'},{label:'3 (Profile)',value:'3'},{label:'4 (Home)',value:'4'}]} onChange={(v) => update({ headerView: { ...hv, tabNumber: Number(v) } })} />
        )}
        {hv.actionType === 'webview' && (
          <>
            <InputRow label="URL" value={hv.url || ''} onChange={(v) => update({ headerView: { ...hv, url: v } })} />
            <InputRow label="Title" value={hv.urlTitle || ''} onChange={(v) => update({ headerView: { ...hv, urlTitle: v } })} />
            <Toggle label="Enable Forward" value={!!hv.enableForward} onChange={(v) => update({ headerView: { ...hv, enableForward: v } })} />
            <Toggle label="Enable Backward" value={!!hv.enableBackward} onChange={(v) => update({ headerView: { ...hv, enableBackward: v } })} />
          </>
        )}
        {hv.actionType === 'external' && (
          <InputRow label="Url launch" value={hv.urlLaunch || ''} onChange={(v) => update({ headerView: { ...hv, urlLaunch: v } })} />
        )}
        {hv.actionType === 'blog' && (
          <SelectRow label="Blog" value={hv.blog || ''} options={[{label:'Select blog',value:''}]} onChange={(v) => update({ headerView: { ...hv, blog: v } })} />
        )}
        {hv.actionType === 'blogCategory' && (
          <SelectRow label="Category" value={hv.blogCategory || ''} options={[{label:'Select category',value:''}]} onChange={(v) => update({ headerView: { ...hv, blogCategory: v } })} />
        )}
        {hv.actionType === 'coupon' && (
          <InputRow label="Coupon" value={hv.coupon || ''} onChange={(v) => update({ headerView: { ...hv, coupon: v } })} />
        )}

        <DateRow label="Countdown" value={hv.countdown || ''} onChange={(v) => update({ headerView: { ...hv, countdown: v } })} />
      </Section>

      <Section title="MARGIN" collapsible defaultOpen>
        <SliderRow label="Start" value={hv.marginStart ?? 0} onChange={(v) => update({ headerView: { ...hv, marginStart: v } })} />
        <SliderRow label="End" value={hv.marginEnd ?? 0} onChange={(v) => update({ headerView: { ...hv, marginEnd: v } })} />
        <SliderRow label="Top" value={hv.marginTop ?? 6} onChange={(v) => update({ headerView: { ...hv, marginTop: v } })} />
        <SliderRow label="Bottom" value={hv.marginBottom ?? 6} onChange={(v) => update({ headerView: { ...hv, marginBottom: v } })} />
      </Section>

      <Section title="PADDING" collapsible defaultOpen>
        <SliderRow label="Start" value={hv.paddingStart ?? 16} onChange={(v) => update({ headerView: { ...hv, paddingStart: v } })} />
        <SliderRow label="End" value={hv.paddingEnd ?? 8} onChange={(v) => update({ headerView: { ...hv, paddingEnd: v } })} />
        <SliderRow label="Top" value={hv.paddingTop ?? 6} onChange={(v) => update({ headerView: { ...hv, paddingTop: v } })} />
        <SliderRow label="Bottom" value={hv.paddingBottom ?? 6} onChange={(v) => update({ headerView: { ...hv, paddingBottom: v } })} />
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
        {collapsible && (
          <button onClick={() => setOpen(o => !o)} className="text-gray-400">{open ? '▾' : '▸'}</button>
        )}
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

function SelectRow({ label, value, options, onChange, full = false }: { label: string; value: string; options: Array<{label:string; value:string}>; onChange: (v: string) => void; full?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      {label ? <span>{label}</span> : <span className="sr-only">action</span>}
      <select className={`px-2 py-1 rounded bg-black text-white ${full ? 'w-full' : ''}`} style={{ border: '1px solid #2a2a30' }} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
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

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between text-white">
      <span>{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function DateRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <input type="date" value={value ? value.substring(0,10) : ''} onChange={(e) => onChange(e.target.value)} className="w-2/3 px-3 py-1.5 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} />
    </div>
  );
}


