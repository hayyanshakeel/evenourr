"use client";

import { useState } from "react";

export default function CartDesignPage() {
  const [style, setStyle] = useState<'Normal' | 'Minimal'>('Normal');
  const [position, setPosition] = useState<'Top Right' | 'Bottom Right' | 'Top Left' | 'Bottom Left'>('Top Right');

  return (
    <div className="p-4 text-gray-200">
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #2a2f3a', paddingBottom: 12 }}>
        <div className="text-sm font-medium text-white">Design • Cart</div>
        <a href="/cms" className="btn btn-secondary text-xs">Back</a>
      </div>

      <div className="text-xs text-gray-300 font-semibold mb-3 uppercase">Cart Settings</div>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-2">
          <label className="text-sm text-gray-200">Cart Style</label>
          <select className="input" value={style} onChange={(e) => setStyle(e.target.value as any)}>
            <option>Normal</option>
            <option>Minimal</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <label className="text-sm text-gray-200">Checkout Button Position</label>
          <select className="input" value={position} onChange={(e) => setPosition(e.target.value as any)}>
            <option>Top Right</option>
            <option>Bottom Right</option>
            <option>Top Left</option>
            <option>Bottom Left</option>
          </select>
        </div>
      </div>
    </div>
  );
}


