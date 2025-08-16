"use client";

// Left Sidebar Component
export default function LeftSidebar() {
  return (
    <aside className="bg-black" style={{ width: 200, borderRight: '1px solid #1f1f22' }}>
      <div className="flex flex-col h-full overflow-auto">
        {/* Header / Brand removed per request */}
        <div className="p-2" style={{ borderBottom: '1px solid #1f1f22' }} />

        {/* Menu removed per request */}

        {/* Footer / Account */}
        <div className="mt-auto" style={{ borderTop: '1px solid #1f1f22' }}>
          <div className="p-4 text-xs text-gray-400">
            <div className="mb-3">evenour.in@gmail.com</div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#0f0f12] text-white cursor-pointer hover:bg-[#15151a] border border-[#1f1f22]">
              <span>✔</span>
              <span>My Subscription</span>
            </div>
          </div>
          <div className="p-4 text-[10px] text-gray-500">FluxBuilder 2.2.0</div>
        </div>
      </div>
    </aside>
  );
}
