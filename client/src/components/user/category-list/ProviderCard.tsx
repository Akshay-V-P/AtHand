// components/ProviderCard.jsx
import React from 'react';
import { Heart, Star } from 'lucide-react';

export default function ProviderCard({ provider }) {
  // Use fallback values if provider data is missing
  const name = provider?.businessName || 'Unknown Provider';
  const locationText = provider?.location?.address?.city
    ? `${provider.location.address.city}, ${provider.location.address.state || ''}`
    : 'Unknown Location';
  const rating = provider?.averageRating?.toFixed(1) || '0.0';
  const reviewsCount = provider?.totalReviews || 0;

  return (
    <div className="flex flex-col gap-3 group">
      <div className="bg-[#E5E5E5] h-60 rounded-3xl relative w-full overflow-hidden">
        <button className="absolute top-4 right-4 text-gray-800 hover:text-red-500 transition-colors z-10 bg-white/50 p-2 rounded-full backdrop-blur-sm">
          <Heart className="w-5 h-5" />
        </button>
        {/* Placeholder for Provider Cover Image */}
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-gray-500">
          {name[0] || 'P'}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2 px-1">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
          {name.substring(0, 1).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-tight">{name}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{locationText}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-1 px-1">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 text-green-500 fill-current" />
          <span className="font-bold text-gray-900">{rating}</span>
          <span className="text-gray-500 text-sm">({reviewsCount})</span>
        </div>
        <button className="bg-[#2B6CB0] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          Request quote
        </button>
      </div>
    </div>
  );
}