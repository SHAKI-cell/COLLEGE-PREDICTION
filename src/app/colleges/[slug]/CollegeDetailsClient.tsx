'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Star, MapPin, IndianRupee, Briefcase, Bookmark, Shuffle, Check, Info, ShieldCheck, Award, MessageSquare, Plus, CheckCircle, Flame, Calendar, GraduationCap, Shield } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useCompare, CollegeCompareItem } from '@/components/CompareContext';
import { CollegeLogo, CollegeBanner } from '@/components/SafeImage';

interface Course {
  id: string;
  name: string;
  duration: number;
  feesAnnual: number;
  eligibility: string;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  studentName: string;
  stream: string;
  graduationYear: number;
  createdAt: string;
}

interface CollegeDetailsClientProps {
  college: CollegeCompareItem & {
    description: string;
    locationCity: string;
    locationState: string;
    courses: Course[];
    reviews: Review[];
    admissionInfo: string;
    isSaved: boolean;
  };
}

export default function CollegeDetailsClient({ college }: CollegeDetailsClientProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { addToCompare, removeFromCompare, isCompared } = useCompare();

  const [isSaved, setIsSaved] = useState(college.isSaved);
  const [isSaving, setIsSaving] = useState(false);
  
  // Reviews state for instant client-side update
  const [reviews, setReviews] = useState<Review[]>(college.reviews);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews' | 'facilities' | 'admission'>('overview');

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [studentName, setStudentName] = useState(session?.user?.name || '');
  const [stream, setStream] = useState('');
  const [gradYear, setGradYear] = useState(new Date().getFullYear());
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const compared = isCompared(college.id);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'placements', label: 'Placements' },
    { id: 'reviews', label: `Reviews (${college.reviews.length})` },
    { id: 'facilities', label: 'Facilities' },
    { id: 'admission', label: 'Admission' }
  ];

  const handleSaveToggle = async () => {
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

  const handleCompareToggle = () => {
    if (compared) {
      removeFromCompare(college.id);
    } else {
      addToCompare(college as any);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast('Please sign in to submit a review', 'warning');
      return;
    }

    if (!reviewTitle.trim() || !reviewContent.trim() || !studentName.trim() || !stream.trim()) {
      toast('Please fill out all fields in the review form', 'warning');
      return;
    }

    if (reviewContent.trim().length < 10) {
      toast('Review text must be at least 10 characters', 'warning');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/colleges/${college.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          title: reviewTitle.trim(),
          content: reviewContent.trim(),
          studentName: studentName.trim(),
          stream: stream.trim(),
          graduationYear: Number(gradYear)
        })
      });
      const data = await res.json();

      if (res.ok) {
        toast('Review submitted successfully!', 'success');
        setReviews([data.review, ...reviews]);
        
        // Reset form
        setReviewTitle('');
        setReviewContent('');
        setStream('');
        setShowReviewForm(false);
      } else {
        toast(data.message || 'Could not post review', 'error');
      }
    } catch (error) {
      console.error(error);
      toast('Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `\u20B9${(amount / 100000).toFixed(2)} Lakh / year`;
    }
    return `\u20B9${amount.toLocaleString('en-IN')} / year`;
  };

  return (
    <div className="flex-grow bg-slate-950 pb-20">
      {/* HERO SECTION */}
      <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden bg-slate-900 border-b border-slate-900">
        <CollegeBanner
          src={college.banner}
          name={college.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/44 to-transparent" />
        
        {/* Banner Details Overlay */}
        <div className="absolute bottom-6 left-0 right-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-start md:items-end gap-4 md:gap-5">
              <CollegeLogo
                src={college.logo}
                name={college.name}
                className="h-16 w-16 md:h-24 md:w-24 rounded-2xl object-cover border-2 border-slate-800 bg-slate-950 shadow-2xl flex-shrink-0"
              />
              <div className="space-y-1.5 md:pb-2">
                <span className="inline-flex rounded-lg bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  {college.type}
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {college.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-350">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {college.locationCity}, {college.locationState}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-700" />
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Star className="h-4 w-4 fill-current" />
                    {college.rating.toFixed(1)} / 5.0 Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex gap-3 md:pb-2">
              <button
                onClick={handleCompareToggle}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                  compared
                    ? 'bg-indigo-500 text-white shadow-indigo-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Shuffle className="h-4 w-4" />
                {compared ? 'Comparing' : 'Compare'}
              </button>
              
              <button
                onClick={handleSaveToggle}
                disabled={isSaving}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                  isSaved
                    ? 'bg-rose-500 text-white shadow-rose-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save College'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK HIGHLIGHTS GRID */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/20 border border-slate-900 rounded-2xl p-5">
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Average Package</p>
            <p className="text-xl font-bold text-slate-200 flex items-center gap-1">
              <Briefcase className="h-4.5 w-4.5 text-indigo-400" />
              {college.placementAverage.toFixed(1)} LPA
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Highest Package</p>
            <p className="text-xl font-bold text-slate-200 flex items-center gap-1">
              <Flame className="h-4.5 w-4.5 text-orange-400 animate-pulse" />
              {college.placementHighest.toFixed(1)} LPA
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Annual Fees (Min)</p>
            <p className="text-xl font-bold text-slate-200 flex items-center gap-1">
              <IndianRupee className="h-4.5 w-4.5 text-emerald-400" />
              {formatFees(college.feesMin).split('/')[0]}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Total Courses</p>
            <p className="text-xl font-bold text-slate-200 flex items-center gap-1">
              <GraduationCap className="h-4.5 w-4.5 text-indigo-400" />
              {college.courses.length} Streams
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex border-b border-slate-900 overflow-x-auto scrollbar-none gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="mt-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-4">
                  <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <Info className="h-5 w-5 text-indigo-400" />
                    About {college.name}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                    {college.description}
                  </p>
                </div>

                {/* Admission Brief */}
                <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-4">
                  <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-400" />
                    Admission Information Summary
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {college.admissionInfo}
                  </p>
                </div>
              </div>

              {/* SIDE METADATA */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Quick Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-450">Institution Type</span>
                      <span className="font-semibold text-slate-200">{college.type}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-450">City</span>
                      <span className="font-semibold text-slate-200">{college.locationCity}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-450">State</span>
                      <span className="font-semibold text-slate-200">{college.locationState}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-450">Average Fee Range</span>
                      <span className="font-semibold text-emerald-400">
                        {college.feesMin >= 100000 ? `${(college.feesMin / 100000).toFixed(1)}L - ${(college.feesMax / 100000).toFixed(1)}L` : `${college.feesMin.toLocaleString()} - ${college.feesMax.toLocaleString()}`} / Yr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455">Highest Package</span>
                      <span className="font-bold text-indigo-400">{college.placementHighest} LPA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-200">Offered Programs & Fees</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-450 font-bold uppercase tracking-wider text-xs">
                      <th className="pb-3">Course Stream</th>
                      <th className="pb-3">Duration</th>
                      <th className="pb-3">Eligibility</th>
                      <th className="pb-3 text-right">Annual Fees</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {college.courses.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="py-4 font-semibold text-slate-200">{course.name}</td>
                        <td className="py-4">{course.duration} Years</td>
                        <td className="py-4 text-slate-400">{course.eligibility}</td>
                        <td className="py-4 text-right font-bold text-slate-200">{formatFees(course.feesAnnual)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PLACEMENTS TAB */}
          {activeTab === 'placements' && (
            <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-400" />
                Placement Analysis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stats */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-center items-center text-center space-y-3">
                  <div className="text-5xl font-extrabold text-white tracking-tight bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                    {college.placementAverage.toFixed(1)} LPA
                  </div>
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Average Placement Package</div>
                  <p className="text-xs text-slate-400 max-w-xs">Aggregated average compensation packages received by students in the previous academic calendar.</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-center items-center text-center space-y-3">
                  <div className="text-5xl font-extrabold text-white tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                    {college.placementHighest.toFixed(1)} LPA
                  </div>
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Highest Placement Package</div>
                  <p className="text-xs text-slate-400 max-w-xs">Topmost annual compensation packages extended by premium global corporate recruiters.</p>
                </div>
              </div>

              {/* Placement Details Description */}
              <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-800/50">
                <h3 className="text-sm font-bold text-slate-350 mb-2 uppercase tracking-wide">Recruitment Insights</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The campus hosts recruiters from top conglomerates including Google, Microsoft, Amazon, Tata Consultancy Services, Infosys, and key engineering giants. Standard placement rate stands at over 90% across core engineering and software branches.
                </p>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Header and Add Review Button */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <h2 className="text-lg font-bold text-slate-200">Student Reviews ({reviews.length})</h2>
                
                {session ? (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Write a Review
                  </button>
                ) : (
                  <p className="text-xs text-slate-450 bg-slate-900/40 border border-slate-900 px-3 py-2 rounded-xl">
                    <span className="font-semibold text-indigo-400 cursor-pointer hover:underline" onClick={() => router.push('/auth')}>Sign In</span> to write a review.
                  </p>
                )}
              </div>

              {/* Write Review Form Overlay */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4"
                >
                  <h3 className="text-sm font-bold text-slate-200">Share Your Experience</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-450 uppercase">Student Name</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Rohan Sharma"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-450 uppercase">Course Stream</label>
                      <input
                        type="text"
                        value={stream}
                        onChange={(e) => setStream(e.target.value)}
                        placeholder="e.g. Computer Science / BCA"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-450 uppercase">Graduation Year</label>
                      <select
                        value={gradYear}
                        onChange={(e) => setGradYear(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-350 rounded-xl px-3 py-2 focus:outline-none"
                      >
                        {Array.from({ length: 15 }).map((_, i) => {
                          const year = new Date().getFullYear() + 4 - i;
                          return <option key={year} value={year}>{year}</option>;
                        })}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-450 uppercase">Rating Score</label>
                      <div className="flex items-center gap-1.5 py-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setReviewRating(num)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                num <= reviewRating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-650'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase">Review Header (Title)</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Excellent placement records and helpful faculty"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase">Full Review Content</label>
                    <textarea
                      rows={4}
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Write your detailed experience here (min 10 characters)..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="rounded-xl bg-indigo-500 hover:bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/10 disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="text-center py-12 border border-slate-900 rounded-2xl bg-slate-900/10">
                  <p className="text-sm text-slate-500">No student reviews posted yet. Be the first one to share an experience!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-200">{rev.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-300">{rev.studentName}</span>
                            <span>&bull;</span>
                            <span>{rev.stream} ({rev.graduationYear} Grad)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
                          <Star className="h-3 w-3 fill-current" />
                          {rev.rating}
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed font-light">
                        {rev.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FACILITIES TAB */}
          {activeTab === 'facilities' && (
            <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-200">Campus Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {college.facilities.map((fac) => (
                  <div
                    key={fac}
                    className="flex items-center gap-3 rounded-xl bg-slate-950 p-4 border border-slate-900"
                  >
                    <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADMISSION TAB */}
          {activeTab === 'admission' && (
            <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <GraduationCap className="h-5.5 w-5.5 text-indigo-400" />
                Admission & Selection Criteria
              </h2>
              <div className="prose prose-invert text-sm text-slate-400 leading-relaxed space-y-4">
                <p>
                  {college.admissionInfo}
                </p>
                <div className="rounded-xl bg-slate-950 border border-slate-900 p-4 mt-6">
                  <h3 className="text-xs font-bold text-slate-350 uppercase mb-2">Key Documents Required</h3>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-400">
                    <li>10th & 12th Marks Sheets (original and copies)</li>
                    <li>National Entrance Exam Rank Cards (e.g. JEE Main, JEE Advanced, GATE, CUET)</li>
                    <li>Government issued ID (Aadhar Card, PAN Card, passport)</li>
                    <li>Migration Certificate and Transfer Certificate</li>
                    <li>Passport size photographs (recent)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
