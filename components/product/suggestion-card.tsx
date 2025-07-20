'use client';

export function SuggestionCard({ onQuickView }: { onQuickView: () => void }) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-medium">You might also like...</h3>
      <button onClick={onQuickView} className="mt-2 text-sm text-indigo-600 hover:text-indigo-500">
        Quick View
      </button>
    </div>
  );
}
