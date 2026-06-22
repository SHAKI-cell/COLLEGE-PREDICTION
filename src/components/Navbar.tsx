'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, BookOpen, User, LogOut, LayoutDashboard, Shuffle, Compass } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navLinks = [
    { href: '/colleges', label: 'Discover', icon: Compass },
    { href: '/compare', label: 'Compare', icon: Shuffle },
    { href: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 p-2 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                UniDiscover
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-indigo-400 py-1 ${
                    isActive(link.href)
                      ? 'text-indigo-400 border-b-2 border-indigo-500'
                      : 'text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth State Button */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-800" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 p-1 pr-3 hover:bg-slate-800 transition-colors focus:outline-none"
                >
                  {session.user?.image && !avatarError ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      onError={() => setAvatarError(true)}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-xs font-bold text-white uppercase">
                      {session.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </button>

                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-20">
                      <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-800 mb-1">
                        Signed in as <span className="font-semibold text-slate-300">{session.user?.email}</span>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                        My Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleSignOut();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-violet-700 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-slate-900 text-indigo-400 border border-slate-800'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-900 pt-3">
            {status === 'loading' ? (
              <div className="h-10 w-full animate-pulse rounded-xl bg-slate-900" />
            ) : session ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 px-4 py-1.5">
                  {session.user?.image && !avatarError ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      onError={() => setAvatarError(true)}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-xs font-bold text-white uppercase">
                      {session.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-200">{session.user?.name}</div>
                    <div className="text-xs text-slate-500 max-w-[180px] truncate">{session.user?.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 text-center text-sm font-semibold text-white shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
