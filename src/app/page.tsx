import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/db';
import CollegeCard from '@/components/CollegeCard';
import HomeSearch from '@/components/HomeSearch';
import { ArrowRight, Award, TrendingUp, Bookmark, Shuffle, GraduationCap, Users, Building2, Star, Sparkles, CheckCircle } from 'lucide-react';

export const revalidate = 3600;

async function getFeaturedColleges() {
  try {
    const topRated = await prisma.college.findMany({
      take: 3,
      orderBy: { rating: 'desc' },
      include: {
        _count: {
          select: { courses: true, reviews: true }
        }
      }
    });

    const topPlacement = await prisma.college.findMany({
      take: 3,
      orderBy: { placementAverage: 'desc' },
      include: {
        _count: {
          select: { courses: true, reviews: true }
        }
      }
    });
    
    const parseFacilities = (colleges: any[]) => colleges.map(c => ({
      ...c,
      facilities: (() => {
        try {
          return typeof c.facilities === 'string' ? JSON.parse(c.facilities) : c.facilities;
        } catch (e) {
          return [];
        }
      })()
    }));

    return { topRated: parseFacilities(topRated), topPlacement: parseFacilities(topPlacement) };
  } catch (error) {
    console.error('Error fetching landing page colleges:', error);
    return { topRated: [], topPlacement: [] };
  }
}

export default async function Home() {
  const { topRated, topPlacement } = await getFeaturedColleges();

  const stats = [
    { value: '50+', label: 'Verified Colleges', icon: Building2 },
    { value: '250+', label: 'Course Streams', icon: GraduationCap },
    { value: '15.4 LPA', label: 'Average Package', icon: TrendingUp },
    { value: '98%', label: 'Student Satisfaction', icon: Star }
  ];

  const features = [
    {
      icon: Shuffle,
      title: 'Compare Side-by-Side',
      desc: 'Evaluate up to 3 colleges simultaneously across key metrics including fees, placements, courses, and campus facilities.',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Bookmark,
      title: 'Save & Track Colleges',
      desc: 'Bookmark your target colleges and track them in a personal dashboard to streamline your entire admission process.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: Award,
      title: 'Authentic Ratings',
      desc: 'Make informed decisions based on ratings and statistics aggregated directly from verified student feedback and alumni data.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Users,
      title: 'Real Student Reviews',
      desc: 'Read honest experiences from current students and recent alumni — unfiltered, unsponsored, and completely transparent.',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: GraduationCap,
      title: 'Placement Analytics',
      desc: 'Deep dive into placement statistics with average packages, highest offers, top recruiters, and year-over-year trends.',
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      icon: CheckCircle,
      title: 'Verified Information',
      desc: 'Every data point is cross-referenced with official sources. No misleading numbers, no inflated statistics — just facts.',
      gradient: 'from-cyan-500 to-sky-500'
    }
  ];

  const trustedBy = [
    'IIT Delhi', 'IIT Bombay', 'NIT Trichy', 'BITS Pilani', 'VIT Vellore', 'SRM Chennai'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-hidden">

      {/* ===== HERO SECTION ===== */}
      <section className="relative py-28 lg:py-40 flex items-center justify-center overflow-hidden">

        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />

        {/* Large orbiting glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/15 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-32 left-1/4 w-[400px] h-[300px] bg-violet-600/15 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-20 right-1/4 w-[350px] h-[250px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Floating particles — pure CSS decorative dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[15%] left-[10%] w-1 h-1 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-[25%] left-[85%] w-1.5 h-1.5 rounded-full bg-violet-400/50 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
          <div className="absolute top-[60%] left-[15%] w-1 h-1 rounded-full bg-blue-400/40 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
          <div className="absolute top-[70%] left-[80%] w-1.5 h-1.5 rounded-full bg-indigo-300/50 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }} />
          <div className="absolute top-[40%] left-[5%] w-0.5 h-0.5 rounded-full bg-violet-300/60 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.2s' }} />
          <div className="absolute top-[35%] left-[92%] w-1 h-1 rounded-full bg-blue-300/40 animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '3.8s' }} />
          <div className="absolute top-[80%] left-[50%] w-0.5 h-0.5 rounded-full bg-indigo-400/30 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '4.2s' }} />
          <div className="absolute top-[10%] left-[60%] w-1 h-1 rounded-full bg-violet-400/40 animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '3.6s' }} />
          <div className="absolute top-[50%] left-[30%] w-1 h-1 rounded-full bg-cyan-400/30 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '4.8s' }} />
          <div className="absolute top-[55%] left-[70%] w-0.5 h-0.5 rounded-full bg-indigo-300/50 animate-bounce" style={{ animationDelay: '1.8s', animationDuration: '3.4s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-sm shadow-lg shadow-indigo-500/5">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            India&apos;s Most Trusted College Discovery Platform
          </div>

          {/* Hero headline with animated gradient */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <span className="text-white">Find Your</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 25%, #c084fc 50%, #818cf8 75%, #a78bfa 100%)',
                backgroundSize: '200% auto',
                animation: 'gradient-shift 4s ease infinite'
              }}
            >
              Perfect College
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed font-light">
            Search, filter, and compare <span className="text-slate-300 font-medium">50+ premier Indian colleges</span> — IITs, NITs, and top Private Universities — on fees, placements, and verified student feedback.
          </p>

          {/* Glowing Search Bar Wrapper */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-60" />
            <div className="relative">
              <HomeSearch />
            </div>
          </div>

          {/* Trusted by strip */}
          <div className="pt-8 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-600 font-semibold">Featuring top institutions</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {trustedBy.map((name) => (
                <span key={name} className="text-sm text-slate-500 font-medium hover:text-slate-300 transition-colors duration-300 cursor-default">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* ===== STATS SECTION ===== */}
      <section className="relative py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="group relative text-center p-6 lg:p-8 rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all duration-500">
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p
                      className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent"
                      style={{ backgroundImage: 'linear-gradient(180deg, #e2e8f0 0%, #94a3b8 100%)' }}
                    >
                      {s.value}
                    </p>
                    <p className="text-xs uppercase font-bold text-slate-500 tracking-[0.15em]">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* ===== WHY CHOOSE US ===== */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Section background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          {/* Section header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5" />
              Why Students Choose Us
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Decide Confidently
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-light">
              Our platform empowers students with transparent data and comparison matrices that typical review sites simply don&apos;t offer.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-7 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm hover:border-slate-700/80 transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Subtle top-border gradient on hover */}
                  <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />

                  <div className="space-y-4">
                    <div className={`inline-flex rounded-xl bg-gradient-to-br ${f.gradient} p-3 shadow-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors duration-300">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* ===== TOP RATED COLLEGES ===== */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <Award className="h-3.5 w-3.5" />
                Highest Rated
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Top-Rated Institutions
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-lg">
                Colleges with the highest student rating and satisfaction scores across India.
              </p>
            </div>
            <Link
              href="/colleges?sort=highest-rated"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
            >
              View All Colleges
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {topRated.map((college: any) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* ===== TOP PLACEMENTS ===== */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <TrendingUp className="h-3.5 w-3.5" />
                Best Placements
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Excellent Placement Hubs
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-lg">
                Colleges offering the highest average placement packages across India.
              </p>
            </div>
            <Link
              href="/colleges?sort=highest-placement"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
            >
              View All Colleges
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {topPlacement.map((college: any) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        {/* CTA Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_120%,rgba(120,119,198,0.2),transparent)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />

        {/* Decorative floating elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full bg-indigo-400/20 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-20 right-[15%] w-2 h-2 rounded-full bg-violet-400/20 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/2 left-[5%] w-1.5 h-1.5 rounded-full bg-blue-400/15 animate-pulse" style={{ animationDuration: '3.5s' }} />
        <div className="absolute top-1/3 right-[8%] w-1.5 h-1.5 rounded-full bg-indigo-300/15 animate-pulse" style={{ animationDuration: '4.5s' }} />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Start Your Journey Today
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="text-white">Ready to Discover</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Your Dream College?
            </span>
          </h2>

          <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-light">
            Create a free account to save your favorite colleges, submit honest reviews, and build comparison sheets — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            {/* Primary CTA */}
            <Link
              href="/colleges"
              className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                Explore Colleges
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/auth"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-slate-200 hover:text-white hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-0.5"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <div className="flex -space-x-2">
              {[
                'bg-indigo-500', 'bg-violet-500', 'bg-blue-500', 'bg-purple-500'
              ].map((bg, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-white`}>
                  {['R', 'A', 'S', 'P'][i]}
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-400">
              <span className="text-white font-semibold">2,500+</span> students already onboard
            </div>
          </div>
        </div>
      </section>

      {/* CSS Keyframes for gradient animation */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
      `}</style>
    </div>
  );
}
