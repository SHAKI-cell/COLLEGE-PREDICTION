'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Mail, Lock, User, ArrowRight, ShieldAlert, Sparkles, BookOpen, GraduationCap, TrendingUp, Star, Building2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center bg-slate-950">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
            <div className="absolute inset-0 h-12 w-12 rounded-full bg-indigo-500/10 blur-xl" />
          </div>
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Check for NextAuth URL errors
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      if (error === 'CredentialsSignin') {
        setErrorMsg('Invalid email or password.');
      } else {
        setErrorMsg(error);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('All fields are required.');
      setIsLoading(false);
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your name.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        // Register user
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password })
        });
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || 'Registration failed');
          setIsLoading(false);
          return;
        }

        toast('Registration successful! Logging you in...', 'success');
      }

      // Log in user
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false
      });

      if (result?.error) {
        setErrorMsg(result.error === 'CredentialsSignin' ? 'Invalid email or password.' : result.error);
        setIsLoading(false);
      } else {
        toast('Logged in successfully', 'success');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const brandFeatures = [
    { icon: GraduationCap, text: '50+ Premier Colleges' },
    { icon: TrendingUp, text: 'Real Placement Data' },
    { icon: Star, text: 'Verified Student Reviews' },
    { icon: Building2, text: 'Compare Institutions' }
  ];

  return (
    <div className="flex-grow flex min-h-screen bg-slate-950 relative overflow-hidden">

      {/* ===== LEFT PANEL — Branding (desktop only) ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950" />

        {/* Decorative glow blobs */}
        <div className="absolute top-[15%] left-[20%] w-[400px] h-[400px] bg-indigo-500/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-violet-500/15 blur-[130px] rounded-full" />
        <div className="absolute top-[60%] left-[50%] w-[250px] h-[250px] bg-blue-500/10 blur-[120px] rounded-full" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-indigo-400/40 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-[40%] left-[75%] w-1 h-1 rounded-full bg-violet-400/50 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute top-[70%] left-[25%] w-1 h-1 rounded-full bg-blue-400/30 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
          <div className="absolute top-[30%] left-[60%] w-0.5 h-0.5 rounded-full bg-indigo-300/50 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4.2s' }} />
          <div className="absolute top-[80%] left-[70%] w-1 h-1 rounded-full bg-violet-300/30 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.8s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 p-2.5 shadow-xl shadow-indigo-500/30">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">UniDiscover</span>
          </div>
        </div>

        {/* Center illustration area */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12 space-y-10">
          <div className="space-y-5">
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
              Your Journey to the{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 30%, #c084fc 60%, #818cf8 100%)',
                  backgroundSize: '200% auto',
                  animation: 'gradient-shift 4s ease infinite'
                }}
              >
                Perfect College
              </span>
              {' '}Starts Here
            </h2>
            <p className="text-slate-400 text-base xl:text-lg max-w-md leading-relaxed font-light">
              Join thousands of students making smarter college decisions with verified data and real student insights.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {brandFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 group-hover:bg-indigo-500/15 group-hover:border-indigo-500/30 transition-all duration-300">
                    <Icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors duration-300">{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative z-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 space-y-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              &ldquo;UniDiscover helped me compare IIT Bombay and IIT Delhi on actual placement data. Saved me weeks of research. Highly recommend for every aspirant.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                RS
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Rohan Sharma</p>
                <p className="text-xs text-slate-500">Engineering Aspirant, Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Auth Form ===== */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative">

        {/* Background glows for the right panel */}
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-indigo-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-violet-500/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-8">

          {/* Mobile header — only on smaller screens */}
          <div className="lg:hidden text-center space-y-3">
            <div className="inline-flex rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 p-3 shadow-xl shadow-indigo-500/25">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">UniDiscover</h1>
          </div>

          {/* Mode toggle tabs */}
          <div className="relative flex rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-1">
            {/* Sliding indicator */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 transition-all duration-500 ease-out"
              style={{ left: mode === 'login' ? '4px' : 'calc(50% + 0px)' }}
            />
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300 ${mode === 'login' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300 ${mode === 'register' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Create Account
            </button>
          </div>

          {/* Glassmorphic form card */}
          <div className="relative">
            {/* Card glow border effect */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-indigo-500/20 via-transparent to-violet-500/10 opacity-60" />

            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-indigo-500/5 space-y-6">

              {/* Card header */}
              <div className="space-y-1.5">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
                </h2>
                <p className="text-sm text-slate-400 font-light">
                  {mode === 'login'
                    ? 'Sign in to access your saved colleges and post reviews.'
                    : 'Join to discover and evaluate top Indian universities.'}
                </p>
              </div>

              {/* Error message */}
              {errorMsg && (
                <div className="flex items-start gap-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 p-4 animate-[fade-in_0.3s_ease-out]">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-rose-500/15 flex-shrink-0">
                    <ShieldAlert className="h-4 w-4 text-rose-400" />
                  </div>
                  <div className="text-sm text-rose-300 font-medium pt-1">{errorMsg}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name field — register only */}
                {mode === 'register' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-violet-500/0 group-focus-within:from-indigo-500/30 group-focus-within:via-violet-500/20 group-focus-within:to-indigo-500/30 transition-all duration-500" />
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 h-4 w-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors duration-300" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Rohan Sharma"
                          className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 placeholder-slate-600 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-violet-500/0 group-focus-within:from-indigo-500/30 group-focus-within:via-violet-500/20 group-focus-within:to-indigo-500/30 transition-all duration-500" />
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 h-4 w-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors duration-300" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 placeholder-slate-600 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="h-3 w-3" />
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-violet-500/0 group-focus-within:from-indigo-500/30 group-focus-within:via-violet-500/20 group-focus-within:to-indigo-500/30 transition-all duration-500" />
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4 w-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors duration-300" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500/50 text-sm text-slate-200 rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 placeholder-slate-600 transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-slate-600 hover:text-slate-300 transition-colors duration-200"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full mt-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  {/* Button gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-600 transition-opacity duration-300" />
                  {/* Hover lighter gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 shadow-lg shadow-indigo-500/25 group-hover:shadow-xl group-hover:shadow-indigo-500/40 rounded-xl transition-shadow duration-300" />

                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Divider with mode toggle */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-slate-900/60 text-slate-500">
                    {mode === 'login' ? 'New to UniDiscover?' : 'Already registered?'}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrorMsg(''); }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-300 group"
                >
                  {mode === 'login' ? 'Create a free account' : 'Sign in to your account'}
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500/10 via-transparent to-violet-500/10 opacity-50" />
            <div className="relative rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm p-5 flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 flex-shrink-0">
                <Sparkles className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-300">Demo Credentials</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  For testing, register a new account or use{' '}
                  <code className="px-1.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-[11px] font-mono">rohan@example.com</code>
                  {' '}with password{' '}
                  <code className="px-1.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-[11px] font-mono">password123</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
