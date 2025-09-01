"use client";

export default function AurionLayoutPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <div className="flex justify-between items-center p-2.5 bg-white rounded-md mb-5 mx-5 mt-5">
        <span className="text-xl font-bold">←</span>
        <input 
          type="text" 
          placeholder="Luxury Brand"
          className="border-none outline-none text-base flex-1 mx-4 text-center"
        />
        <span className="text-xl font-bold">⋮</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2.5 mb-5 px-5 overflow-x-auto">
        {['Top Pick', 'New Product', 'Exclusive', 'Seasonal'].map((tab, index) => (
          <div
            key={tab}
            className={`px-5 py-2.5 rounded-md cursor-pointer whitespace-nowrap ${
              index === 0 
                ? 'bg-black text-white' 
                : 'bg-[#ddd] text-black hover:bg-[#ccc]'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid gap-5 px-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {/* Product 1 */}
        <div className="bg-white p-2.5 rounded-md text-center">
          <img 
            src="https://image.hm.com/assets/hm/de/bd/debde7ca69060b5c3a4a53f3f301016ee673f01a.jpg?imwidth=1260" 
            alt="A.P.C. Sweatshirt"
            className="w-full h-auto rounded-md mb-3"
          />
          <div className="text-base mb-2.5">A.P.C. ★ 4.5 (780)</div>
          <div className="text-[#888] text-sm mb-2">Effortless Eleganc...</div>
          <div className="text-red-600 text-lg font-bold">$599.00</div>
        </div>

        {/* Product 2 */}
        <div className="bg-white p-2.5 rounded-md text-center">
          <img 
            src="https://image.hm.com/assets/hm/94/04/94041c72e99e06b4ef96fdb449e67e05d75ee693.jpg?imwidth=1260" 
            alt="Moncler Jacket"
            className="w-full h-auto rounded-md mb-3"
          />
          <div className="text-base mb-2.5">MONCLER ★ 4.5 (523)</div>
          <div className="text-[#888] text-sm mb-2">Padded Bi-Materi...</div>
          <div className="text-red-600 text-lg font-bold">$2,499.00</div>
        </div>

        {/* Product 3 */}
        <div className="bg-white p-2.5 rounded-md text-center">
          <img 
            src="https://image.hm.com/assets/hm/fc/21/fc21c349316ce5f8dc3a8719e19cbfdc2b5281cc.jpg?imwidth=1260" 
            alt="Loro Piana Bag"
            className="w-full h-auto rounded-md mb-3"
          />
          <div className="text-base mb-2.5">LORO PIANA ★ 4.5 (156)</div>
          <div className="text-[#888] text-sm mb-2">Loom L25 Grained...</div>
          <div className="text-red-600 text-lg font-bold">$4,472.00</div>
        </div>

        {/* Product 4 */}
        <div className="bg-white p-2.5 rounded-md text-center">
          <img 
            src="https://image.hm.com/assets/hm/41/eb/41eb68272261143edead1680553e9d5f9b38cda8.jpg?imwidth=1260" 
            alt="Ganni Hat"
            className="w-full h-auto rounded-md mb-3"
          />
          <div className="text-base mb-2.5">GANNI ★ 4.5 (178)</div>
          <div className="text-[#888] text-sm mb-2">Oversized Wool Ri...</div>
          <div className="text-red-600 text-lg font-bold">$125.99</div>
        </div>
      </div>

      {/* CMS Navigation - Fixed at bottom */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex gap-3">
          <a 
            href="/cms" 
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
            ← Back to CMS
          </a>
          <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm hover:bg-[#1d4ed8] transition-colors">
            Edit Layout
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
