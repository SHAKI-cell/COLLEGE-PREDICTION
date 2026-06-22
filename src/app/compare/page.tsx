'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shuffle, X, Plus, Star, MapPin, IndianRupee, Briefcase, Landmark, Compass, HelpCircle } from 'lucide-react';
import { useCompare, CollegeCompareItem } from '@/components/CompareContext';
import { useToast } from '@/components/Toast';
import { CollegeLogo } from '@/components/SafeImage';

export default function ComparePage() {
  const { compareList, removeFromCompare, addToCompare, clearCompare } = useCompare();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CollegeCompareItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdownForIndex, setShowSearchDropdownForIndex] = useState<number | null>(null);
  const [isAddingDynamic, setIsAddingDynamic] = useState(false);
  const [dynamicAddingName, setDynamicAddingName] = useState('');

  const handleCreateDynamicCollege = async (name: string) => {
    if (!name.trim()) return;
    setIsAddingDynamic(true);
    setDynamicAddingName(name);
    try {
      const res = await fetch('/api/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (res.ok) {
        addToCompare(data.college);
        setShowSearchDropdownForIndex(null);
        setSearchQuery('');
        setSearchResults([]);
      } else {
        toast(data.message || 'Failed to add college', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to search and add college', 'error');
    } finally {
      setIsAddingDynamic(false);
    }
  };

  // Fetch search suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/colleges?search=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.colleges);
        }
      } catch (err) {
        console.error('Failed to fetch search suggestions', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleAddCollege = (college: CollegeCompareItem) => {
    addToCompare(college);
    setShowSearchDropdownForIndex(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `\u20B9${(amount / 100000).toFixed(1)} L/Yr`;
    }
    return `\u20B9${amount.toLocaleString('en-IN')}/Yr`;
  };

  // Metric Comparison Rows Helper
  const metrics = [
    {
      label: 'Institution Type',
      icon: Landmark,
      getValue: (item: CollegeCompareItem) => item.type
    },
    {
      label: 'Location',
      icon: MapPin,
      getValue: (item: CollegeCompareItem) => `${item.locationCity}, ${item.locationState}`
    },
    {
      label: 'Student Rating',
      icon: Star,
      getValue: (item: CollegeCompareItem) => (
        <span className="flex items-center gap-1 text-emerald-400 font-semibold justify-center">
          <Star className="h-4 w-4 fill-current" />
          {item.rating.toFixed(1)} / 5.0
        </span>
      )
    },
    {
      label: 'Fees (Annual Range)',
      icon: IndianRupee,
      getValue: (item: CollegeCompareItem) => (
        <span className="font-bold text-slate-200">
          {formatFees(item.feesMin)} - {formatFees(item.feesMax)}
        </span>
      )
    },
    {
      label: 'Average Package',
      icon: Briefcase,
      getValue: (item: CollegeCompareItem) => (
        <span className="font-semibold text-slate-200">{item.placementAverage.toFixed(1)} LPA</span>
      )
    },
    {
      label: 'Highest Package',
      icon: Briefcase,
      getValue: (item: CollegeCompareItem) => (
        <span className="font-bold text-indigo-400">{item.placementHighest.toFixed(1)} LPA</span>
      )
    },
    {
      label: 'Offered Streams',
      icon: Compass,
      getValue: (item: CollegeCompareItem) => `${item._count?.courses || '3+'} Courses`
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow flex flex-col bg-slate-950">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Shuffle className="h-7 w-7 text-indigo-500" />
            Comparison Matrix
          </h1>
          <p className="text-sm text-slate-400 mt-1">Evaluate up to 3 universities side-by-side to make the right choice.</p>
        </div>
        {compareList.length > 0 && (
          <button
            onClick={clearCompare}
            className="rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors"
          >
            Clear Matrix
          </button>
        )}
      </div>

      {compareList.length === 0 ? (
        // Empty State
        <div className="flex-grow flex flex-col items-center justify-center py-24 text-center border border-slate-900/60 rounded-3xl bg-slate-900/10">
          <div className="rounded-2xl bg-slate-900 p-4 border border-slate-850 mb-4">
            <Shuffle className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-350">Your Comparison Matrix is Empty</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">Add colleges to compare fees, placements, ratings, and course information side-by-side.</p>
          <div className="flex gap-4 mt-8">
            <Link
              href="/colleges"
              className="rounded-xl bg-indigo-500 hover:bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              Discover Colleges
            </Link>
            
            <button
              onClick={() => setShowSearchDropdownForIndex(0)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              Add a College Now
            </button>
          </div>

          {/* Quick inline search when matrix empty */}
          {showSearchDropdownForIndex !== null && (
            <div className="mt-6 w-full max-w-md relative p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 px-2">
                <span className="text-xs font-semibold text-slate-300">Quick Add College</span>
                <button onClick={() => setShowSearchDropdownForIndex(null)} className="text-slate-450 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type college name, city or state..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none"
                autoFocus
              />
              
              {/* Results dropdown */}
              {searchQuery && (
                <div className="absolute left-2 right-2 mt-1 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-2xl z-20 space-y-0.5 max-h-60 overflow-y-auto text-left">
                  {isSearching ? (
                    <div className="text-xs text-slate-500 p-3 text-center">Searching...</div>
                  ) : (
                    <>
                      {searchResults.map(col => (
                        <button
                          key={col.id}
                          onClick={() => handleAddCollege(col)}
                          className="w-full flex items-center gap-2 rounded-lg p-2 text-left text-xs text-slate-300 hover:bg-slate-900 transition-colors"
                        >
                          <CollegeLogo src={col.logo} name={col.name} className="h-6 w-6 rounded object-cover flex-shrink-0" />
                          <span className="truncate font-medium">{col.name}</span>
                        </button>
                      ))}
                      
                      <div className="p-1.5 border-t border-slate-900 mt-1">
                        <button
                          onClick={() => handleCreateDynamicCollege(searchQuery)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 px-2 py-1.5 transition-colors cursor-pointer"
                        >
                          🔍 Search web & add "{searchQuery}"
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Comparison Matrix Table View
        <div className="space-y-6">
          <div className="overflow-x-auto border border-slate-900 rounded-3xl bg-slate-900/20 shadow-xl">
            <table className="w-full border-collapse text-center table-fixed min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-900/40">
                  
                  {/* Left Label Column */}
                  <th className="w-64 p-6 text-left font-bold text-slate-450 uppercase tracking-wider text-xs border-r border-slate-900/60">
                    Comparing metrics
                  </th>
                  
                  {/* Up to 3 College Headers */}
                  {[0, 1, 2].map((idx) => {
                    const col = compareList[idx];
                    return (
                      <th key={idx} className="p-6 relative border-r border-slate-900/60 last:border-r-0">
                        {col ? (
                          <div className="space-y-4">
                            
                            {/* Remove button */}
                            <button
                              onClick={() => removeFromCompare(col.id)}
                              className="absolute top-4 right-4 rounded-lg bg-slate-950 hover:bg-rose-950/40 border border-slate-800 text-slate-450 hover:text-rose-400 p-1.5 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>

                            <CollegeLogo
                              src={col.logo}
                              name={col.name}
                              className="mx-auto h-12 w-12 rounded-xl object-cover border border-slate-800 bg-slate-950"
                            />
                            
                            <div className="space-y-1">
                              <h3 className="line-clamp-2 text-sm font-extrabold text-slate-100 hover:text-indigo-400 hover:underline">
                                <Link href={`/colleges/${col.slug}`}>
                                  {col.name}
                                </Link>
                              </h3>
                              <p className="text-[10px] text-slate-500 uppercase font-semibold">{col.locationCity}</p>
                            </div>
                          </div>
                        ) : (
                          // Placeholder to add college
                          <div className="py-8 flex flex-col items-center justify-center">
                            {showSearchDropdownForIndex === idx ? (
                              <div className="w-full relative px-2">
                                <input
                                  type="text"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  placeholder="Search college name..."
                                  className="w-full bg-slate-950 border border-slate-850 text-xs text-slate-200 rounded-xl px-2.5 py-2 focus:outline-none"
                                  autoFocus
                                />
                                {searchQuery && (
                                  <div className="absolute left-2 right-2 mt-1 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-2xl z-20 space-y-0.5 text-left max-h-52 overflow-y-auto">
                                    {isSearching ? (
                                      <div className="text-[10px] text-slate-500 p-2 text-center">Searching...</div>
                                    ) : (
                                      <>
                                        {searchResults.map(c => (
                                          <button
                                            key={c.id}
                                            onClick={() => handleAddCollege(c)}
                                            className="w-full flex items-center gap-1.5 rounded-lg p-1.5 text-left text-[11px] text-slate-350 hover:bg-slate-900 transition-colors"
                                          >
                                            <CollegeLogo src={c.logo} name={c.name} className="h-5 w-5 rounded object-cover flex-shrink-0" />
                                            <span className="truncate">{c.name}</span>
                                          </button>
                                        ))}
                                        <div className="p-1 border-t border-slate-900 mt-1">
                                          <button
                                            onClick={() => handleCreateDynamicCollege(searchQuery)}
                                            className="w-full flex items-center justify-center gap-1 border border-indigo-500/20 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-[9px] font-semibold text-indigo-400 hover:text-indigo-300 px-2 py-1 transition-colors cursor-pointer"
                                          >
                                            🔍 Search web & add "{searchQuery}"
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                                <button
                                  onClick={() => setShowSearchDropdownForIndex(null)}
                                  className="mt-2 text-[10px] text-slate-500 hover:text-slate-300 font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setShowSearchDropdownForIndex(idx);
                                  setSearchQuery('');
                                }}
                                className="group flex flex-col items-center gap-2 border border-dashed border-slate-800 hover:border-indigo-500/40 rounded-2xl bg-slate-950/40 hover:bg-slate-900/30 p-5 transition-all"
                              >
                                <div className="rounded-xl bg-slate-900 border border-slate-850 group-hover:bg-indigo-500/10 p-2 text-slate-500 group-hover:text-indigo-400 transition-colors">
                                  <Plus className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-semibold text-slate-450 group-hover:text-slate-300">Add College</span>
                              </button>
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, mIdx) => {
                  const Icon = m.icon;
                  return (
                    <tr key={mIdx} className="border-b border-slate-900 last:border-b-0 hover:bg-slate-900/5 transition-colors">
                      {/* Metric name column */}
                      <td className="p-4 text-left font-bold text-slate-300 border-r border-slate-900/60 bg-slate-900/10 text-xs">
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-slate-500" />
                          {m.label}
                        </span>
                      </td>
                      
                      {/* College metric details */}
                      {[0, 1, 2].map((idx) => {
                        const col = compareList[idx];
                        return (
                          <td key={idx} className="p-4 border-r border-slate-900/60 last:border-r-0 text-sm text-slate-300">
                            {col ? m.getValue(col) : <span className="text-slate-700">-</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/colleges"
              className="rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              Browse more colleges
            </Link>
          </div>
        </div>
      )}

      {/* Dynamic Adding Loading Overlay */}
      {isAddingDynamic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full mx-4 rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center space-y-6 shadow-2xl shadow-indigo-500/15">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin animate-duration-1000 animate-reverse" />
              <Shuffle className="h-5 w-5 text-indigo-400 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Searching the Web</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Crawling educational directories, fetching tuition fees, placement records, and course details for <span className="font-semibold text-indigo-400">"{dynamicAddingName}"</span>...
              </p>
            </div>
            
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              Adding to database...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
