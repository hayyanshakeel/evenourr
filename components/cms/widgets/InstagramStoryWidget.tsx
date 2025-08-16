"use client";

import { useState } from "react";
import { WidgetConfig } from "./types";

export default function InstagramStoryWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const ig = config.instagramStory || {};
  const update = (partial: Partial<WidgetConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="space-y-4">
      <Section title="ITEMS" collapsible defaultOpen>
        <button className="px-4 py-2 rounded bg-blue-600 text-white text-xs" onClick={() => {
          const next = [ ...(ig.items || []), { id: String(Date.now()) } ];
          update({ instagramStory: { ...ig, items: next } });
        }}>ADD STORY</button>
      </Section>

      <Section title="ITEM SETTINGS" collapsible defaultOpen>
        <SliderRow label="Width" value={ig.width ?? 100} onChange={(v) => update({ instagramStory: { ...ig, width: v } })} />
        <SliderRow label="Height" value={ig.height ?? 200} onChange={(v) => update({ instagramStory: { ...ig, height: v } })} />
        <SliderRow label="Radius" value={ig.radius ?? 10} onChange={(v) => update({ instagramStory: { ...ig, radius: v } })} />
        <Toggle label="Hide Avatar" value={!!ig.hideAvatar} onChange={(v) => update({ instagramStory: { ...ig, hideAvatar: v } })} />
        <Toggle label="Hide Caption" value={!!ig.hideCaption} onChange={(v) => update({ instagramStory: { ...ig, hideCaption: v } })} />
      </Section>

      <Section title="SETTINGS" collapsible defaultOpen>
        <SliderRow label="Limit Item" value={ig.limitItem ?? 10} onChange={(v) => update({ instagramStory: { ...ig, limitItem: v } })} />
        <SliderRow label="Spacing Item" value={ig.spacingItem ?? 10} onChange={(v) => update({ instagramStory: { ...ig, spacingItem: v } })} />
        <SliderRow label="Time View" value={ig.timeView ?? 10} onChange={(v) => update({ instagramStory: { ...ig, timeView: v } })} />
        <SelectRow label="View Layout" value={ig.viewLayout || 'iframe'} options={[{label:'iframe',value:'iframe'},{label:'media',value:'media'},{label:'mediaWithCap',value:'mediaWithCap'}]} onChange={(v) => update({ instagramStory: { ...ig, viewLayout: v as any } })} />
      </Section>

      <Section title="MARGIN" collapsible defaultOpen>
        <SliderRow label="Left" value={ig.marginLeft ?? 15} onChange={(v) => update({ instagramStory: { ...ig, marginLeft: v } })} />
        <SliderRow label="Right" value={ig.marginRight ?? 15} onChange={(v) => update({ instagramStory: { ...ig, marginRight: v } })} />
        <SliderRow label="Top" value={ig.marginTop ?? 10} onChange={(v) => update({ instagramStory: { ...ig, marginTop: v } })} />
        <SliderRow label="Bottom" value={ig.marginBottom ?? 10} onChange={(v) => update({ instagramStory: { ...ig, marginBottom: v } })} />
      </Section>

      {/* Story item editor (opens when clicking an item; for now provide a simple config UI) */}
      {Array.isArray(ig.items) && ig.items.length > 0 && (
        <Section title="ITEM CONFIG" collapsible>
          <UploadRow label="Image" onUploaded={(url) => {
            const next = [...(ig.items || [])];
            const last = next[next.length - 1];
            if (!last) return;
            next[next.length - 1] = { id: last.id, imageUrl: url, avatarUrl: last.avatarUrl, codeEmbed: last.codeEmbed, videoLink: last.videoLink, mediaCaption: last.mediaCaption } as any;
            update({ instagramStory: { ...ig, items: next } });
          }} />
          <UploadRow label="Avatar" onUploaded={(url) => {
            const next = [...(ig.items || [])];
            const last = next[next.length - 1];
            if (!last) return;
            next[next.length - 1] = { id: last.id, imageUrl: (last as any).imageUrl, avatarUrl: url, codeEmbed: last.codeEmbed, videoLink: last.videoLink, mediaCaption: last.mediaCaption } as any;
            update({ instagramStory: { ...ig, items: next } });
          }} />
          <InputRow label="Code Embed" value={''} onChange={() => {}} />
          <InputRow label="Video Link" value={''} onChange={() => {}} />
          <TextareaRow label="Media Caption" value={''} onChange={() => {}} />
        </Section>
      )}
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

function InputRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-2/3 px-3 py-1.5 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} />
    </div>
  );
}

function TextareaRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-2/3 h-24 px-3 py-1.5 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} />
    </div>
  );
}

function UploadRow({ label, onUploaded }: { label: string; onUploaded: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <div className="text-xs text-gray-300 mb-1">{label}</div>
      <div className="rounded-lg border border-dashed" style={{ borderColor: '#2a2a30' }}>
        <div className="p-4 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="mb-2">Drag and Drop here</div>
            <button disabled={busy} onClick={async () => {
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
    </div>
  );
}


