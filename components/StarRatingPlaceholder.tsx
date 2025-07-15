// components/StarRatingPlaceholder.tsx

export default function StarRatingPlaceholder() {
  return (
    <div className="flex cursor-pointer items-center gap-2">
      <span className="text-lg text-black">★★★★★</span>
      {/* This fixes the "Unexpected token" error */}
      <span className="text-sm text-gray-600">{'15 >'}</span>
    </div>
  );
}