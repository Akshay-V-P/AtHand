// components/Filters.jsx
import React from 'react';
import { MapPin, ChevronDown, ArrowUpDown, List, Clock, Star, Smartphone } from 'lucide-react';

export default function Filters({ filters, onFilterChange, categories = [] }) {
  return (
    <div className="mt-6 px-8">
      {/* Primary Filter Block */}
      <div className="bg-[#E6F4F1] rounded-3xl p-6 flex flex-col md:flex-row gap-4 w-full justify-between">

        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-900 mb-2">Location</label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="w-full bg-[#2A2A2A] text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter location"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-900 mb-2">Distance</label>
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/70 z-10" />
            <select
              value={filters.distance}
              onChange={(e) => onFilterChange('distance', e.target.value)}
              className="w-full bg-[#2A2A2A] text-white appearance-none pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
            >
              <option value="5">5 Km</option>
              <option value="15">15 Km</option>
              <option value="25">25 Km</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-900 mb-2">Categories</label>
          <div className="relative">
            <List className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/70 z-10" />
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full bg-[#2A2A2A] text-white appearance-none pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-900 mb-2">Urgency</label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/70 z-10" />
            <select
              value={filters.urgency}
              onChange={(e) => onFilterChange('urgency', e.target.value)}
              className="w-full bg-[#2A2A2A] text-white appearance-none pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
            >
              <option value="Flexible">Flexible</option>
              <option value="Within 24h">Within 24 Hours</option>
              <option value="Emergency">Emergency</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Secondary Filters */}
      <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
        <div className="flex gap-3">
          <button className="border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Star className="w-4 h-4" /> Ratings <ChevronDown className="w-4 h-4" />
          </button>
          <button className="border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Clock className="w-4 h-4" /> Hours <ChevronDown className="w-4 h-4" />
          </button>
          <button className="border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Smartphone className="w-4 h-4" /> Mobile <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center text-sm">
          <span className="text-gray-500 mr-2">Sort By :</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="font-semibold bg-transparent focus:outline-none cursor-pointer appearance-none pr-5 relative z-10"
          >
            <option value="Popularity">Popularity</option>
            <option value="PriceLowHigh">Price: Low to High</option>
            <option value="Rating">Highest Rated</option>
          </select>
          <ChevronDown className="w-4 h-4 -ml-4 pointer-events-none text-gray-700" />
        </div>
      </div>
    </div>
  );
}