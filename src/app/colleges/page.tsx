'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, ChevronLeft, ChevronRight, X, Sparkles, MapPin, Shield, Compass } from 'lucide-react';
import CollegeCard from '@/components/CollegeCard';

interface College {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  banner: string;
  locationCity: string;
  locationState: string;
  rating: number;
  feesMin: number;
  feesMax: number;
  placementAverage: number;
  placementHighest: number;
  type: string;
  facilities: string[];
  _count: {
    courses: number;
    reviews: number;
  };
}

interface CollegesApiResponse {
  colleges: College[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  cities: string[];
  states: string[];
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-96 rounded-2xl border border-slate-900 bg-slate-900/20 p-5 space-y-4 animate-pulse">
              <div className="h-40 bg-slate-800/60 rounded-xl" />
              <div className="h-6 bg-slate-800/60 rounded-md w-3/4" />
              <div className="h-4 bg-slate-800/60 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      </div>
    }>
      <CollegesPageContent />
    </Suspense>
  );
}

function CollegesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read initial states from URL
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '0');
  const [maxFees, setMaxFees] = useState(searchParams.get('feesMax') || '1000000');
  const [minPlacement, setMinPlacement] = useState(searchParams.get('placementMin') || '0');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'highest-rated');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounce search value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
      setCurrentPage(1); // Reset to page 1 on search
    }, 405);
    return () => clearTimeout(handler);
  }, [searchVal]);

  // Sync state parameters to URL query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedState) params.set('state', selectedState);
    if (selectedCity) params.set('city', selectedCity);
    if (selectedType) params.set('type', selectedType);
    if (minRating !== '0') params.set('rating', minRating);
    if (maxFees !== '1000000') params.set('feesMax', maxFees);
    if (minPlacement !== '0') params.set('placementMin', minPlacement);
    if (sortBy) params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    startTransition(() => {
      router.push(`/colleges?${params.toString()}`);
    });
  }, [debouncedSearch, selectedState, selectedCity, selectedType, minRating, maxFees, minPlacement, sortBy, currentPage, router]);

  // Query Colleges API
  const fetchColleges = async (): Promise<CollegesApiResponse> => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedState) params.set('state', selectedState);
    if (selectedCity) params.set('city', selectedCity);
    if (selectedType) params.set('type', selectedType);
    if (minRating !== '0') params.set('rating', minRating);
    if (maxFees !== '1000000') params.set('feesMax', maxFees);
    if (minPlacement !== '0') params.set('placementMin', minPlacement);
    if (sortBy) params.set('sort', sortBy);
    params.set('page', currentPage.toString());
    params.set('limit', '9');

    const res = await fetch(`/api/colleges?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch colleges');
    return res.json();
  };

  const { data, isLoading, isError, refetch } = useQuery<CollegesApiResponse>({
    queryKey: ['colleges', debouncedSearch, selectedState, selectedCity, selectedType, minRating, maxFees, minPlacement, sortBy, currentPage],
    queryFn: fetchColleges
  });

  const handleResetFilters = () => {
    setSearchVal('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedType('');
    setMinRating('0');
    setMaxFees('1000000');
    setMinPlacement('0');
    setSortBy('highest-rated');
    setCurrentPage(1);
  };

  const formatFeesSlider = (val: string) => {
    const num = parseInt(val, 10);
    if (num >= 100000) return `\u20B9${(num / 100000).toFixed(1)} Lakh`;
    return `\u20B9${num.toLocaleString('en-IN')}`;
  };

  const collegeTypes = ['IIT', 'NIT', 'Private', 'Government'];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Compass className="h-7 w-7 text-indigo-500" />
            Discover Institutions
          </h1>
          <p className="text-sm text-slate-400 mt-1">Explore, filter, and compare the premier engineering and medical institutions in the country.</p>
        </div>
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-350 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-grow">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block w-72 flex-shrink-0 bg-slate-900/40 border border-slate-900 rounded-2xl p-6 h-fit space-y-6">
          <div className="flex items-center gap-2 font-bold text-slate-200 border-b border-slate-800 pb-3">
            <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-500" />
            Filter Criteria
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Name, city or state..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 focus:ring-0 text-sm text-slate-200 rounded-xl pl-9 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          {/* State Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">State</label>
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); setCurrentPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="">All States</option>
              {data?.states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">City</label>
            <select
              value={selectedCity}
              disabled={!selectedState}
              onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none disabled:opacity-40"
            >
              <option value="">All Cities</option>
              {data?.cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* College Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">College Type</label>
            <div className="flex flex-wrap gap-2">
              {collegeTypes.map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedType(selectedType === t ? '' : t);
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                    selectedType === t
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Fees Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-slate-455">Max Fees (Annual)</span>
              <span className="text-indigo-400 font-semibold">{formatFeesSlider(maxFees)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="1000000"
              step="10000"
              value={maxFees}
              onChange={(e) => { setMaxFees(e.target.value); setCurrentPage(1); }}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Ratings Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Min Rating</label>
            <select
              value={minRating}
              onChange={(e) => { setMinRating(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="0">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>

          {/* Placement Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Min Avg Package</label>
            <select
              value={minPlacement}
              onChange={(e) => { setMinPlacement(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="0">Any Placement</option>
              <option value="25">25+ LPA</option>
              <option value="20">20+ LPA</option>
              <option value="15">15+ LPA</option>
              <option value="10">10+ LPA</option>
            </select>
          </div>
        </aside>

        {/* RESULTS GRID AREA */}
        <div className="flex-grow space-y-6">
          
          {/* Controls: Search result count & Sort By */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/20 border border-slate-900 rounded-2xl p-4">
            <p className="text-sm text-slate-400">
              {isLoading ? (
                <span className="inline-block h-4 w-28 animate-pulse rounded bg-slate-800" />
              ) : (
                <>Found <span className="font-semibold text-slate-200">{data?.total || 0}</span> colleges match</>
              )}
            </p>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <label className="text-xs font-semibold text-slate-450 whitespace-nowrap flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-450" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-44 bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="highest-rated">Highest Rated</option>
                <option value="lowest-fees">Lowest Fees</option>
                <option value="highest-placement">Highest Placements</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
              </select>
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs font-semibold text-slate-300 hover:bg-slate-900"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Listing Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-96 rounded-2xl border border-slate-900 bg-slate-900/20 p-5 space-y-4 animate-pulse">
                  <div className="h-40 bg-slate-800/60 rounded-xl" />
                  <div className="h-6 bg-slate-800/60 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-800/60 rounded-md w-1/2" />
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/30">
                    <div className="h-8 bg-slate-800/60 rounded-md" />
                    <div className="h-8 bg-slate-800/60 rounded-md" />
                  </div>
                  <div className="h-10 bg-slate-800/60 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-900 rounded-3xl bg-slate-900/10">
              <p className="text-slate-400 font-medium">Failed to retrieve colleges.</p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md"
              >
                Try Again
              </button>
            </div>
          ) : data?.colleges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-slate-900/60 rounded-3xl bg-slate-900/10">
              <div className="rounded-2xl bg-slate-900 p-4 border border-slate-850 mb-4">
                <Search className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-350">No Colleges Match Your Filters</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1">We couldn't find any institutions that meet all selected parameters. Try widening your criteria.</p>
              <button
                onClick={handleResetFilters}
                className="mt-6 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-5 py-2 text-xs font-semibold text-indigo-400 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {/* Pagination Controls */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-900 pt-6 mt-8 text-sm text-slate-450">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <span className="font-semibold text-slate-300">
                    Page {currentPage} of {data.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(data.totalPages, prev + 1))}
                    disabled={currentPage === data.totalPages}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MOBILE FILTER OVERLAY DRAWERS */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/80 backdrop-blur-sm">
          <div className="ml-auto w-full max-w-sm bg-slate-950 border-l border-slate-900 p-6 overflow-y-auto flex flex-col space-y-6 h-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-500" />
                Filter Options
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-slate-400 hover:text-slate-250 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Name, city or state..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-200 rounded-xl pl-9 py-2.5 focus:outline-none"
                />
              </div>
            </div>

            {/* Mobile State */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">State</label>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); setCurrentPage(1); }}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-350 rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="">All States</option>
                {data?.states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Mobile City */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">City</label>
              <select
                value={selectedCity}
                disabled={!selectedState}
                onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-350 rounded-xl px-3 py-2.5 focus:outline-none disabled:opacity-40"
              >
                <option value="">All Cities</option>
                {data?.cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Mobile Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">College Type</label>
              <div className="flex flex-wrap gap-2">
                {collegeTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedType(selectedType === t ? '' : t);
                      setCurrentPage(1);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      selectedType === t
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Fees */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-450">Max Fees (Annual)</span>
                <span className="text-indigo-400 font-semibold">{formatFeesSlider(maxFees)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="1000000"
                step="10000"
                value={maxFees}
                onChange={(e) => { setMaxFees(e.target.value); setCurrentPage(1); }}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Mobile Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Min Rating</label>
              <select
                value={minRating}
                onChange={(e) => { setMinRating(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-350 rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="0">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>

            {/* Mobile Placement */}
            <div className="space-y-2 mb-8">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Min Avg Package</label>
              <select
                value={minPlacement}
                onChange={(e) => { setMinPlacement(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-350 rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="0">Any Placement</option>
                <option value="25">25+ LPA</option>
                <option value="20">20+ LPA</option>
                <option value="15">15+ LPA</option>
                <option value="10">10+ LPA</option>
              </select>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-auto w-full py-3 bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
