"use client";
import { useState } from "react";
import { WidgetConfig } from "./types";

export default function DynamicBlogWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const [local, setLocal] = useState(config);
  const update = (partial: Partial<WidgetConfig>) => {
    const updated = { ...local, ...partial };
    setLocal(updated);
    onChange(updated);
  };
  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center justify-between">
        <span>Label</span>
        <input value={local.dynamicBlog?.label || ''} onChange={(e) => update({ dynamicBlog: { ...(local.dynamicBlog || {}), label: e.target.value } })} className="w-2/3 px-3 py-1.5 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} />
      </div>
      <div className="flex items-center justify-between">
        <span>Layout</span>
        <select className="px-2 py-1 rounded bg-black text-white" style={{ border: '1px solid #2a2a30' }} value={local.dynamicBlog?.layout || 'two'} onChange={(e) => update({ dynamicBlog: { ...(local.dynamicBlog || {}), layout: e.target.value as any } })}>
          <option value="two">Two column</option>
          <option value="three">Three column</option>
          <option value="four">Four column</option>
          <option value="staggered">Staggered</option>
          <option value="card">Card</option>
          <option value="bannerSlider">Banner Slider</option>
          <option value="carousel">Carousel</option>
        </select>
      </div>
    </div>
  );
}


