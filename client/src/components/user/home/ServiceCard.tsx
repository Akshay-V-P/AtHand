import React, { useState, useEffect } from 'react';
import { getPresignedDisplayUrl } from '../../../services/imageService';

interface ServiceCardProp {
  title: string;
  location: string;
  price: string;
  rating: string;
  mediaKeys?: string[];
  providerName?: string;
}

const ServiceCard = ({ title, location, price, rating, mediaKeys, providerName }: ServiceCardProp) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (mediaKeys && mediaKeys.length > 0) {
      getPresignedDisplayUrl(mediaKeys[0])
        .then(res => {
          if (res.data?.data) {
            setImageUrl(res.data.data);
          }
        })
        .catch(console.error);
    }
  }, [mediaKeys]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-w-[250px] cursor-pointer hover:shadow-md transition-shadow">
      <div className="w-full h-40 bg-gray-200 rounded-xl mb-4 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center text-indigo-500 font-bold">
            {title.charAt(0) || 'S'}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs font-bold mb-2">
        <span className="text-green-600 flex items-center">
          ★ {rating}
        </span>
        {providerName && <span className="text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{providerName}</span>}
      </div>
      <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">{title}</h3>
      <div className="flex justify-between items-end mt-4">
        <span className="text-gray-500 text-sm">{location}</span>
        <span className="font-bold text-blue-600 border border-blue-100 bg-blue-50 px-2 py-1 rounded-lg">₹{price}</span>
      </div>
    </div>
  );
};

export default ServiceCard;