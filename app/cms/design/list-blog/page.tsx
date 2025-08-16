"use client";

import { useState } from "react";

export default function ListBlogDesignPage() {
  const [style, setStyle] = useState<'Staggered' | 'Grid'>('Staggered');

  return (
    <div className="p-4 text-gray-200">
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #2a2f3a', paddingBottom: 12 }}>
        <div className="text-sm font-medium text-white">Design • List Blog</div>
        <a href="/cms" className="btn btn-secondary text-xs">Back</a>
      </div>

      <div className="grid grid-cols-1 gap-2 mb-4">
        <label className="text-sm text-gray-200">Style</label>
        <select className="input" value={style} onChange={(e) => setStyle(e.target.value as any)}>
          <option>Staggered</option>
          <option>Grid</option>
        </select>
      </div>
    </div>
  );
}


