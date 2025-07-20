'use client';

import { useState } from 'react';

type Review = {
  id: string;
  user: string;
  country: string;
  date: string;
  rating: number;
  size: string;
  text: string;
  fit: string;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  photos: string[];
};

export function Reviews({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState<'all' | 'withPhotos'>('all');

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.photos.length > 0);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>

      {/* Filter Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-300">
        <button
          className={`pb-2 font-semibold ${filter === 'all' ? 'border-b-2 border-black' : 'text-gray-500'}`}
          onClick={() => setFilter('all')}
        >
          All {reviews.length}
        </button>
        <button
          className={`pb-2 font-semibold ${filter === 'withPhotos' ? 'border-b-2 border-black' : 'text-gray-500'}`}
          onClick={() => setFilter('withPhotos')}
        >
          With Photos {reviews.filter(r => r.photos.length > 0).length}
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {filteredReviews.map(review => (
          <div key={review.id} className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-semibold">{review.user}</span>
              <span className="text-gray-500 text-sm">{review.country}</span>
              <span className="text-gray-400 text-sm">{review.date}</span>
            </div>
            <p className="mb-2">{review.text}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Fit: {review.fit}</span>
              <span>Height: {review.height}</span>
              <span>Bust: {review.bust}</span>
              <span>Waist: {review.waist}</span>
              <span>Hips: {review.hips}</span>
            </div>
            {review.photos.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {review.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Review photo ${idx + 1}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
