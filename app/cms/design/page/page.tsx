"use client";

import { useState } from "react";

export default function PageDesignPage() {
  const [markup, setMarkup] = useState('');
  const [css, setCss] = useState('');
  const [script, setScript] = useState('');

  return (
    <div className="p-4 text-gray-200">
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #2a2f3a', paddingBottom: 12 }}>
        <div className="text-sm font-medium text-white">Design • Page</div>
        <a href="/cms" className="btn btn-secondary text-xs">Back</a>
      </div>

      <div className="text-xs text-gray-300 font-semibold mb-3 uppercase">Custom Code</div>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-200 mb-2">Markup (HTML / JSX)</div>
          <textarea
            className="input"
            style={{ minHeight: 120, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
            placeholder="<section>...</section>"
            value={markup}
            onChange={(e) => setMarkup(e.target.value)}
          />
        </div>
        <div>
          <div className="text-sm text-gray-200 mb-2">CSS / Tailwind</div>
          <textarea
            className="input"
            style={{ minHeight: 120, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
            placeholder={".container { display: grid }\n/* or Tailwind classes in markup */"}
            value={css}
            onChange={(e) => setCss(e.target.value)}
          />
        </div>
        <div>
          <div className="text-sm text-gray-200 mb-2">Script (TypeScript / React)</div>
          <textarea
            className="input"
            style={{ minHeight: 140, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
            placeholder={"export default function MyWidget(){\n  return (<div>Hello</div>)\n}"}
            value={script}
            onChange={(e) => setScript(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}


