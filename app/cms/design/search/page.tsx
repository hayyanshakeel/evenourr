"use client";

import { useState } from "react";

export default function SearchDesignPage() {
  const [requiredLogin, setRequiredLogin] = useState(false);
  const [enableForward, setEnableForward] = useState(true);
  const [enableBackward, setEnableBackward] = useState(true);

  return (
    <div className="p-4 text-gray-200">
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #2a2f3a', paddingBottom: 12 }}>
        <div className="text-sm font-medium text-white">Design • Search</div>
        <a href="/cms" className="btn btn-secondary text-xs">Back</a>
      </div>

      {/* SETTINGS */}
      <div className="text-xs text-gray-300 font-semibold mb-3 uppercase">Settings</div>
      <div className="space-y-3">
        <label className="flex items-center justify-between text-sm text-gray-200">
          <span>Required Login</span>
          <input type="checkbox" checked={requiredLogin} onChange={e => setRequiredLogin(e.target.checked)} style={{ accentColor: '#2563eb' }} />
        </label>
        <label className="flex items-center justify-between text-sm text-gray-200">
          <span>Enable Forward</span>
          <input type="checkbox" checked={enableForward} onChange={e => setEnableForward(e.target.checked)} style={{ accentColor: '#2563eb' }} />
        </label>
        <label className="flex items-center justify-between text-sm text-gray-200">
          <span>Enable Backward</span>
          <input type="checkbox" checked={enableBackward} onChange={e => setEnableBackward(e.target.checked)} style={{ accentColor: '#2563eb' }} />
        </label>
      </div>
    </div>
  );
}


