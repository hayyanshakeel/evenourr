"use client";
import { useState } from "react";
import { WidgetConfig } from "./types";

export default function BlogsWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const [local, setLocal] = useState(config);
  const update = (partial: Partial<WidgetConfig>) => {
    const updated = { ...local, ...partial };
    setLocal(updated);
    onChange(updated);
  };
  return (
    <div className="space-y-3 text-white">
      <div className="flex items-center justify-between">
        <span>Label</span>
        <input value={local.blogs?.label || ''} onChange={(e) => update({ blogs: { ...(local.blogs || {}), label: e.target.value } })} className="w-2/3 px-3 py-1.5 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} />
      </div>
    </div>
  );
}


