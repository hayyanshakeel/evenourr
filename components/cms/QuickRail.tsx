"use client";

export default function QuickRail() {
  const Item = ({ label, active }: { label: string; active?: boolean }) => (
    <button
      className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs transition-colors ${
        active ? 'bg-[#2563eb] text-white' : 'bg-[#0f0f12] text-gray-300 hover:bg-[#15151a]'
      }`}
      style={{ border: '1px solid #1f1f22' }}
      aria-label={label}
    >
      {label.slice(0, 1)}
    </button>
  );

  return (
    <div
      className="flex flex-col items-center gap-3"
      style={{ width: 56, padding: 8 }}
    >
      <Item label="Home" active />
      <Item label="Category" />
      <Item label="Wishlist" />
      <Item label="Profile" />
      <button
        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl text-gray-200 hover:bg-[#15151a]"
        style={{ border: '1px dashed #2a2a30', background: '#0f0f12' }}
        aria-label="Add"
      >
        +
      </button>
    </div>
  );
}


