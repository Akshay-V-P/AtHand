// pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Filters from '../../../../components/user/category-list/Filter';
import ServiceCard from '../../../../components/user/home/ServiceCard';
import { useGeolocation } from '../../../../hooks/useGeolocation';
import { categoryPageServices, type FetchProvidersParams } from '../services/categoryPageServices';

export default function CategoryPage() {
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';

  const [services, setServices] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const [activeFilters, setActiveFilters] = useState({
    location: '',
    distance: '15',
    category: '',
    urgency: 'Flexible',
    sortBy: 'Popularity',
    search: searchParam
  });

  const [categories, setCategories] = useState<any[]>([]);

  const locationCoords = useGeolocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryPageServices.fetchCategories()
        setCategories(response.data || [])
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [])


  const handleFilterChange = (filterKey: string, value: any) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value
    }));

    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  useEffect(() => {
    if (locationCoords.latitude && locationCoords.longitude && !activeFilters.location) {
      setActiveFilters(prev => ({ ...prev, location: 'Current Location' }));
    }
  }, [locationCoords]);

  useEffect(() => {
    setActiveFilters(prev => {
      if (prev.search !== searchParam) {
        return { ...prev, search: searchParam };
      }
      return prev;
    });
  }, [searchParam]);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        let sortField = undefined;
        if (activeFilters.sortBy === 'Rating') {
          sortField = 'averageRating';
        }

        const params: FetchProvidersParams = {
          page: pagination.page,
          limit: pagination.limit,
          sort: sortField,
          sortOrder: 'desc',
          radius: parseInt(activeFilters.distance) || 10
        };
        console.log(params)


        if (locationCoords.latitude && locationCoords.longitude && activeFilters.location) {
          params.lat = locationCoords.latitude;
          params.lng = locationCoords.longitude;
        }

        if (activeFilters.category) {
          params.categoryId = activeFilters.category;
        }

        if (activeFilters.search) {
          params.search = activeFilters.search;
        }

        const res = await categoryPageServices.fetchServicesApi(params);
        if (res.success) {
          setServices(res.data.items || []);
          setPagination(prev => ({
            ...prev,
            totalPages: res.data.totalPages,
            totalItems: res.data.totalItems
          }));
        }
        console.log(res)
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!locationCoords.isLoading) {
      fetchProviders();
    }
  }, [activeFilters, pagination.page, pagination.limit, locationCoords]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-4">
      <main className="max-w-[1440px] mx-auto">
        <Filters
          filters={activeFilters}
          onFilterChange={handleFilterChange}
          categories={categories}
        />

        {/* Service Grid */}
        <div className="px-8 mt-10">
          {loading ? (
            <div className="flex justify-center items-center h-40">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="flex justify-center flex-col items-center h-40 text-gray-500">
              <p className="text-xl font-semibold mb-2">No services found</p>
              <p>Try adjusting your search filters or distance.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.name}
                  location={service.providerLocation || (service.distanceKm ? `${service.distanceKm.toFixed(1)} km away` : 'Unknown location')}
                  price={service.startingPrice?.toString() || '0'}
                  rating={service.providerRating ? service.providerRating.toFixed(1) : '0.0'}
                  providerName={service.providerName}
                  mediaKeys={service.media}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16 mb-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="bg-[#2A2A2A] text-white p-2.5 rounded-full hover:bg-black transition-colors shadow-sm disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              {[...Array(pagination.totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${pageNum === pagination.page
                      ? "border-2 border-gray-200 text-gray-900"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="bg-[#2A2A2A] text-white p-2.5 rounded-full hover:bg-black transition-colors shadow-sm disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </main>
    </div>
  );
}