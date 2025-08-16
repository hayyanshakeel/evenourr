"use client";

import { useRef, useState } from "react";
import { WidgetConfig } from "./types";

export default function BannerImageWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [local, setLocal] = useState(config);
  const update = (partial: Partial<WidgetConfig>) => {
    const updated = { ...local, ...partial };
    setLocal(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-300">Background Image</div>
      <div className="rounded-lg border border-dashed" style={{ borderColor: '#2a2a30' }}>
        <div className="p-4 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="mb-2">Drag and Drop here</div>
            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 rounded bg-[#0f0f12] border" style={{ borderColor: '#2a2a30' }}>Browse File</button>
          </div>
        </div>
        <input ref={fileInputRef} onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const body = new FormData();
          body.append('file', file);
          const res = await fetch('/api/upload/image', { method: 'POST', body });
          if (res.ok) {
            const { url } = await res.json();
            update({ images: [ ...(local.images || []), { id: String(Date.now()), url } ] });
          }
        }} type="file" accept="image/*" className="hidden" />
        {(local.images || []).length > 0 && (
          <div className="grid grid-cols-3 gap-2 p-2">
            {(local.images || []).map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.id} src={img.url} alt="banner" className="w-full h-20 object-cover rounded" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


