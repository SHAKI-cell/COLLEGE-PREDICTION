'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Star, MapPin, Landmark, IndianRupee, Briefcase, Bookmark, Shuffle, CheckCircle } from 'lucide-react';
import { useToast } from './Toast';
import { useCompare, CollegeCompareItem } from './CompareContext';
import { CollegeLogo, CollegeBanner } from './SafeImage';

interface CollegeCardProps {
  college: CollegeCompareItem & {
    isSavedInitially?: boolean;
  };
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { addToCompare, removeFromCompare, isCompared } = useCompare();

  const [isSaved, setIsSaved] = useState(college.isSavedInitially || false);
  const [isSaving, setIsSaving] = useState(false);

  const compared = isCompared(college.id);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast('Please sign in to save colleges', 'warning');
      router.push('/auth');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId: college.id })
      });
      const data = await res.json();
      
      if (res.ok) {
        setIsSaved(data.saved);
        toast(data.message, 'success');
      } else {
        toast(data.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to save college', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (compared) {
      removeFromCompare(college.id);
    } else {
      addToCompare(college);
    }
  };

  // Format currency in LPA or thousands
  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `\u20B9${(amount / 100000).toFixed(1)} L/Yr`;
    }
    return `\u20B9${amount.toLocaleString('en-IN')}/Yr`;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/10">
      
      {/* Banner & Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-800">
        <CollegeBanner
          src={college.banner}
          name={college.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Save & Compare Buttons */}
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            onClick={handleCompareToggle}
            className={`rounded-xl p-2.5 backdrop-blur-md transition-all duration-200 ${
              compared
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-400'
                : 'bg-slate-950/70 text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Toggle Quick Compare"
          >
            <Shuffle className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleSaveToggle}
            disabled={isSaving}
            className={`rounded-xl p-2.5 backdrop-blur-md transition-all duration-200 ${
              isSaved
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-1 ring-rose-400'
                : 'bg-slate-950/70 text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Save to Dashboard"
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''} ${isSaving ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-emerald-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
          <Star className="h-3 w-3 fill-current" />
          {college.rating.toFixed(1)}
        </div>

        {/* College Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-lg bg-slate-900/80 border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300 uppercase tracking-wider backdrop-blur-sm">
          <Landmark className="h-2.5 w-2.5" />
          {college.type}
        </div>
      </div>

      {/* Content Info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3 mb-1">
          <CollegeLogo
            src={college.logo}
            name={college.name}
            className="h-10 w-10 rounded-lg object-cover border border-slate-800 bg-slate-950 shadow-md flex-shrink-0"
          />
          <div className="min-w-0 flex-grow">
            <h3 className="line-clamp-2 text-base font-bold text-slate-100 hover:text-indigo-400 transition-colors tracking-tight">
              <Link href={`/colleges/${college.slug}`}>
                {college.name}
              </Link>
            </h3>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-slate-400 mb-4 px-1">
          <MapPin className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
          <span className="truncate">{college.locationCity}, {college.locationState}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-4 mt-auto mb-4">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900/40 p-2.5 border border-slate-850">
            <IndianRupee className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider leading-none mb-0.5">Fees Range</p>
              <p className="text-xs font-bold text-slate-200">{formatFees(college.feesMin)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-900/40 p-2.5 border border-slate-850">
            <Briefcase className="h-4 w-4 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider leading-none mb-0.5">Avg Package</p>
              <p className="text-xs font-bold text-slate-200">{college.placementAverage.toFixed(1)} LPA</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/colleges/${college.slug}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-slate-200 hover:text-white transition-all duration-200 shadow-md active:scale-[0.98]"
        >
          View College Details
        </Link>
      </div>
    </div>
  );
}
