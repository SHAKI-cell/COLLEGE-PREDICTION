'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard, User, Mail, Bookmark, Shield, Trash2, Shuffle, Link as LinkIcon, Compass, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { CollegeLogo } from '@/components/SafeImage';

interface College {
  id: string;
  name: string;
  slug: string;
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
}

interface SavedCollegeItem {
  id: string;
  collegeId: string;
  college: College;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  // Fetch saved colleges
  const { data: savedColleges, isLoading } = useQuery<College[]>({
    queryKey: ['saved-colleges'],
    queryFn: async () => {
      const res = await fetch('/api/saved');
      if (!res.ok) throw new Error('Failed to fetch bookmarks');
      const data = await res.json();
      return data;
    },
    enabled: status === 'authenticated'
  });

  // Toggle save mutation (unsave from dashboard)
  const unsaveMutation = useMutation({
    mutationFn: async (collegeId: string) => {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId })
      });
      if (!res.ok) throw new Error('Unsave request failed');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['saved-colleges'] });
      toast(data.message || 'Removed from saved', 'info');
    },
    onError: () => {
      toast('Failed to unsave college', 'error');
    }
  });

  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `\u20B9${(amount / 100000).toFixed(1)} L/Yr`;
    }
    return `\u20B9${amount.toLocaleString('en-IN')}/Yr`;
  };

  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Loading your profile & saved colleges...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow flex flex-col bg-slate-950">
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Profile Sidebar Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'Student'}
                    className="h-20 w-20 rounded-2xl object-cover border border-slate-800"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-3xl font-extrabold text-white uppercase">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="absolute -bottom-1.5 -right-1.5 rounded-xl bg-slate-950 border border-slate-800 p-1 text-slate-400" title="Student Account">
                  <User className="h-4 w-4" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{session?.user?.name || 'Rohan Sharma'}</h3>
                <span className="inline-flex rounded-lg bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1.5">
                  {(session?.user as any)?.role || 'STUDENT'}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-6 space-y-3.5">
              <div className="flex items-center gap-3 text-xs">
                <Mail className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="text-slate-350 truncate">{session?.user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Bookmark className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="text-slate-350">{savedColleges?.length || 0} Saved Universities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Saved List Dashboard Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-900 pb-5">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Bookmark className="h-6 w-6 text-indigo-500" />
                Saved Colleges
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Your personal shortlist of institutions for quick evaluation.</p>
            </div>
          </div>

          {!savedColleges || savedColleges.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-900 rounded-3xl bg-slate-900/10">
              <div className="rounded-2xl bg-slate-900 border border-slate-850 p-4 mb-4">
                <Bookmark className="h-6 w-6 text-slate-650" />
              </div>
              <h4 className="text-base font-bold text-slate-400">No saved colleges found</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">Browse our listing directory to search, evaluate, and save colleges to your shortlist dashboard.</p>
              <Link
                href="/colleges"
                className="mt-6 rounded-xl bg-indigo-500 hover:bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors shadow-lg shadow-indigo-500/10"
              >
                Explore Colleges
              </Link>
            </div>
          ) : (
            // Bookmarks Grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedColleges?.map((college) => (
                <div
                  key={college.id}
                  className="group relative rounded-2xl border border-slate-900 bg-slate-900/40 p-4 space-y-4 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-200"
                >
                  <div className="flex gap-3">
                    <CollegeLogo
                      src={college.logo}
                      name={college.name}
                      className="h-12 w-12 rounded-xl object-cover border border-slate-800 bg-slate-950"
                    />
                    <div className="min-w-0 flex-grow">
                      <h4 className="line-clamp-2 text-sm font-bold text-slate-200 hover:text-indigo-400">
                        <Link href={`/colleges/${college.slug}`}>
                          {college.name}
                        </Link>
                      </h4>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">{college.locationCity}, {college.locationState}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-900 py-3">
                    <div>
                      <p className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Fees</p>
                      <p className="font-semibold text-slate-300">{formatFees(college.feesMin)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Avg Package</p>
                      <p className="font-semibold text-slate-300">{college.placementAverage} LPA</p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => unsaveMutation.mutate(college.id)}
                      disabled={unsaveMutation.isPending}
                      className="rounded-xl bg-slate-950 hover:bg-rose-950/30 border border-slate-850 hover:border-rose-900/30 p-2 text-slate-450 hover:text-rose-455 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/colleges/${college.slug}`}
                      className="flex-grow flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 py-2 text-center text-xs font-semibold text-slate-350 hover:text-slate-200 transition-colors"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

