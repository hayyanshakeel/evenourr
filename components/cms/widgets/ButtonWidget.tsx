"use client";
import { useState } from "react";
import { ButtonItem, WidgetConfig } from "./types";

export default function ButtonWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const update = (partial: Partial<WidgetConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="space-y-4">
      <Section title="ITEMS">
        <div className="space-y-3 text-white">
          <button onClick={() => {
            const newItem: ButtonItem = { id: String(Date.now()), buttonType:'text', text:'', textColor:'#ffffff', fontSize:14, backgroundColor:'#2563eb', useMaxWidth:false, width:100, height:20, borderRadius:2, marginLeft:0, marginRight:0, action:'No navigation' };
            update({ button: { ...(config.button || {}), items: [ ...(config.button?.items || []), newItem ] } });
            setSelectedIndex((config.button?.items || []).length);
          }} className="w-full text-sm text-white px-3 py-2 rounded-md" style={{ background: '#2563eb' }}>+ ADD NEW BUTTON</button>
          {(config.button?.items || []).length > 0 && (
            <div className="space-y-2">
              {(config.button?.items || []).map((it, idx) => (
                <button key={it.id} onClick={() => setSelectedIndex(idx)} className={`w-full flex items-center justify-between px-3 py-2 rounded border ${selectedIndex === idx ? 'border-blue-500 bg-[#0f1115] text-white' : 'border-[#2a2a30] bg-black text-gray-300'}`}>
                  <span>Button {idx + 1}</span>
                  <span>›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section title="SETTINGS">
        <SelectRow label="Alignment" value={config.button?.alignment || 'topCenter'} options={[{label:'Top Left',value:'topLeft'},{label:'Top Center',value:'topCenter'},{label:'Top Right',value:'topRight'}]} onChange={(v) => update({ button: { ...(config.button || {}), alignment: v as any } })} />
        <SliderRow label="Margin Top" value={config.button?.marginTop ?? 0} onChange={(v) => update({ button: { ...(config.button || {}), marginTop: v } })} />
        <SliderRow label="Margin Bottom" value={config.button?.marginBottom ?? 0} onChange={(v) => update({ button: { ...(config.button || {}), marginBottom: v } })} />
      </Section>

      {selectedIndex !== null && (config.button?.items || [])[selectedIndex] && (
        <Section title="BUTTON ITEM EDIT">
          {(() => {
            const items = config.button?.items || [];
            const idx = selectedIndex as number;
            const item = items[idx] as ButtonItem | undefined;
            if (!item) return <div className="text-xs text-gray-400">Select a button</div>;
            const updateItem = (partial: Partial<ButtonItem>) => {
              const nextItems: ButtonItem[] = [...items];
              nextItems[idx] = { ...(item as ButtonItem), ...partial } as ButtonItem;
              update({ button: { ...(config.button || {}), items: nextItems } });
            };
            return (
              <div className="space-y-3 text-white">
                <SelectRow label="Button Type" value={item.buttonType} options={[{label:'Text',value:'text'},{label:'Image',value:'image'}]} onChange={(v) => updateItem({ buttonType: v as any })} />
                <InputRow label="Text" value={item.text || ''} onChange={(v) => updateItem({ text: v })} />
                <ColorRow label="Text Color" value={item.textColor || '#ffffff'} onChange={(v) => updateItem({ textColor: v })} />
                <SliderRow label="Font Size" value={item.fontSize ?? 14} onChange={(v) => updateItem({ fontSize: v })} />
                <ColorRow label="Background Color" value={item.backgroundColor || '#2563eb'} onChange={(v) => updateItem({ backgroundColor: v })} />
                <Toggle label="Use Max Width" value={!!item.useMaxWidth} onChange={(v) => updateItem({ useMaxWidth: v })} />
                <SliderRow label="Width" value={item.width ?? 100} onChange={(v) => updateItem({ width: v })} />
                <SliderRow label="Height" value={item.height ?? 20} onChange={(v) => updateItem({ height: v })} />
                <SliderRow label="Border Radius" value={item.borderRadius ?? 2} onChange={(v) => updateItem({ borderRadius: v })} />
                <SliderRow label="Margin Left" value={item.marginLeft ?? 0} onChange={(v) => updateItem({ marginLeft: v })} />
                <SliderRow label="Margin Right" value={item.marginRight ?? 0} onChange={(v) => updateItem({ marginRight: v })} />
                <SelectRow label="Navigator Options" value={item.action || 'No navigation'} options={[
                  {label:'No navigation',value:'No navigation'},
                  {label:'Open a Product Screen',value:'Open a Product Screen'},
                  {label:'Open Products by Category/Tag',value:'Open Products by Category/Tag'},
                  {label:'Select Screen to Open',value:'Select Screen to Open'},
                  {label:'Select TabBar to Open',value:'Select TabBar to Open'},
                  {label:'Select TabBar Number to Open',value:'Select TabBar Number to Open'},
                  {label:'Open URL by WebView',value:'Open URL by WebView'},
                  {label:'Open URL by External Browser',value:'Open URL by External Browser'},
                  {label:'Open Blog screen',value:'Open Blog screen'},
                  {label:'Open Blog Category',value:'Open Blog Category'},
                  {label:'Open Coupon Screen',value:'Open Coupon Screen'},
                ]} onChange={(v) => updateItem({ action: v })} />
                <div className="flex justify-end">
                  <button className="text-red-400 text-sm" onClick={() => {
                    const remaining = (config.button?.items || []).filter((_, i) => i !== idx);
                    update({ button: { ...(config.button || {}), items: remaining } });
                    setSelectedIndex(null);
                  }}>Delete</button>
                </div>
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

function InputRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-2/3 px-3 py-1.5 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} />
    </div>
  );
}


