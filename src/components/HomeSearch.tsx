'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Sparkles } from 'lucide-react';

export default function HomeSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/colleges');
    }
  };

  const quickSearches = [
    { label: 'IITs', href: '/colleges?type=IIT' },
    { label: 'NITs', href: '/colleges?type=NIT' },
    { label: 'Mumbai', href: '/colleges?city=Mumbai' },
    { label: 'Delhi', href: '/colleges?city=New+Delhi' },
    { label: 'Bangalore', href: '/colleges?city=Bengaluru' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form
        onSubmit={handleSearch}
        className="relative flex items-center p-1.5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-indigo-500/5 backdrop-blur-md focus-within:border-indigo-500/50 transition-all duration-300"
      >
        <div className="flex items-center pl-3 flex-grow gap-2">
          <Search className="h-5 w-5 text-slate-500 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by college name, city or state..."
            className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-550 border-0 focus:outline-none focus:ring-0 py-2"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200"
        >
          Search
        </button>
      </form>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium mr-1">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          Popular Searches:
        </span>
        {quickSearches.map((qs) => (
          <button
            key={qs.label}
            onClick={() => router.push(qs.href)}
            className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-all duration-200"
          >
            {qs.label}
          </button>
        ))}
      </div>
    </div>
  );
}
