import React from 'react';
import Link from 'next/link';
import { BookOpen, Globe, Link as LinkIcon, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 p-1.5 shadow-lg shadow-indigo-500/20">
                <BookOpen className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-100 tracking-tight">
                UniDiscover
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Discover, evaluate, and compare top-tier universities and colleges across India. Making higher education search simple, objective, and data-driven.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-indigo-400 transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                <LinkIcon className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                <BookOpen className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colleges" className="hover:text-white transition-colors">
                  All Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Compare Tool
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-white transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Category Filter shortcut */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Popular Tags
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colleges?type=IIT" className="hover:text-white transition-colors">
                  IIT Bombay / Delhi
                </Link>
              </li>
              <li>
                <Link href="/colleges?type=NIT" className="hover:text-white transition-colors">
                  Top NITs
                </Link>
              </li>
              <li>
                <Link href="/colleges?type=Private" className="hover:text-white transition-colors">
                  Deemed Universities
                </Link>
              </li>
              <li>
                <Link href="/colleges?type=Government" className="hover:text-white transition-colors">
                  State Colleges
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Stats */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform Stats
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                  50+
                </div>
                <div className="text-xs text-slate-500 uppercase font-semibold">
                  Seeded Colleges
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                  150+
                </div>
                <div className="text-xs text-slate-500 uppercase font-semibold">
                  Course Offerings
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {currentYear} UniDiscover Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            Built with <Heart className="h-3 w-3 text-indigo-500 fill-indigo-500" /> by Antigravity
          </div>
        </div>
      </div>
    </footer>
  );
}
