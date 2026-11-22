import { MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProviderCardProps {
    id: string;
    providerName: string;
    rating: string | number;
    totalReviews?: number;
    distance: string | number;
    location?: string;
    serviceNames: string[];
    startingPrice: string | number;
}

export default function ProviderCard({
    id,
    providerName,
    rating,
    totalReviews,
    distance,
    location,
    serviceNames,
    startingPrice
}: ProviderCardProps) {
    const navigate = useNavigate();

    const handleViewProvider = () => {
        if (id) {
            navigate(`/providers/${id}`);
        }
    };

    return (
        <div
            onClick={handleViewProvider}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full cursor-pointer"
        >
            <div className="p-5 flex-grow flex flex-col">
                <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{providerName}</h3>
                    <div className="flex items-center flex-wrap gap-3 text-sm mt-1 text-gray-500">
                        <span className="flex items-center text-amber-500 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                            <Star className="w-3.5 h-3.5 fill-current mr-1" />
                            {rating}
                            {typeof totalReviews === 'number' && totalReviews > 0 && (
                                <span className="text-xs text-gray-500 ml-1 font-normal">({totalReviews})</span>
                            )}
                        </span>
                        {distance ? (
                            <span className="flex items-center">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                {distance} km
                            </span>
                        ) : location ? (
                            <span className="flex items-center">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                {location}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="mt-4 flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {serviceNames.join(' • ')}
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Starting from</p>
                        <p className="font-bold text-gray-900">₹{startingPrice}</p>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewProvider();
                        }}
                        className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        View Provider
                    </button>
                </div>
            </div>
        </div>
    );
}
