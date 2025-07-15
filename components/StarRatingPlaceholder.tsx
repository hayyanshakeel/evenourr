// components/StarRatingPlaceholder.tsx

export default function StarRatingPlaceholder() {
  return (
    <div className="flex cursor-pointer items-center gap-2">
      {/* These are just visual characters for stars */}
      <span className="text-lg text-black">★★★★★</span>
      {/* A placeholder number just like your example image */}
      <span className="text-sm text-gray-600">15 ></span>
    </div>
  );
}