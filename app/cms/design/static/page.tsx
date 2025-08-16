"use client";

export default function StaticDesignPage() {
  return (
    <div className="p-4 text-gray-200">
      <div className="flex items-center justify-between mb-3" style={{ borderBottom: '1px solid #2a2f3a', paddingBottom: 12 }}>
        <div className="text-sm font-medium text-white">Design • Static</div>
        <a href="/cms" className="btn btn-secondary text-xs">Back</a>
      </div>
      <div className="text-sm text-gray-400">Static layout editor coming soon.</div>
    </div>
  );
}


