"use client";
import { useState } from "react";
import { WidgetConfig } from "./types";

export default function DividerWidget({ config, onChange }: { config: WidgetConfig; onChange: (c: WidgetConfig) => void }) {
  const [local, setLocal] = useState(config);
  const update = (partial: Partial<WidgetConfig>) => {
    const updated = { ...local, ...partial };
    setLocal(updated);
    onChange(updated);
  };
  return (
    <div className="space-y-3 text-white">
      <div className="flex items-center justify-between">
        <span>Thickness</span>
        <input type="range" min={0} max={20} value={local.divider?.thickness ?? 0} onChange={(e) => update({ divider: { ...(local.divider || {}), thickness: Number(e.target.value) } })} />
      </div>
    </div>
  );
}


