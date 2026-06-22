'use client';

import React, { useState, useMemo } from 'react';

// Generate a deterministic hash from a string for consistent colors
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate a beautiful color palette based on college name
function getCollegePalette(name: string) {
  const hash = hashString(name);
  const palettes = [
    { from: '#1e3a5f', via: '#2d5a8e', to: '#1a1a2e', accent: '#4fc3f7' },   // Ocean Blue
    { from: '#1b5e20', via: '#2e7d32', to: '#1a2e1a', accent: '#66bb6a' },   // Forest Green
    { from: '#4a148c', via: '#6a1b9a', to: '#1a1a2e', accent: '#ce93d8' },   // Royal Purple
    { from: '#b71c1c', via: '#c62828', to: '#2e1a1a', accent: '#ef9a9a' },   // Crimson
    { from: '#e65100', via: '#f57c00', to: '#2e2a1a', accent: '#ffb74d' },   // Sunset Orange
    { from: '#01579b', via: '#0277bd', to: '#1a1a2e', accent: '#4dd0e1' },   // Teal Sky
    { from: '#283593', via: '#3949ab', to: '#1a1a2e', accent: '#7986cb' },   // Indigo Night
    { from: '#004d40', via: '#00695c', to: '#1a2e2a', accent: '#80cbc4' },   // Deep Teal
    { from: '#880e4f', via: '#ad1457', to: '#2e1a24', accent: '#f48fb1' },   // Rose
    { from: '#33691e', via: '#558b2f', to: '#1a2e1a', accent: '#aed581' },   // Lime Forest
    { from: '#0d47a1', via: '#1565c0', to: '#1a1a2e', accent: '#64b5f6' },   // Deep Blue
    { from: '#4e342e', via: '#5d4037', to: '#2e1a1a', accent: '#bcaaa4' },   // Warm Earth
  ];
  return palettes[hash % palettes.length];
}

interface CollegeLogoProps {
  src?: string;
  name: string;
  className?: string;
}

export function CollegeLogo({ src, name, className = "h-10 w-10 rounded-lg object-cover border border-slate-800 bg-slate-950 shadow-md flex-shrink-0" }: CollegeLogoProps) {
  const [error, setError] = useState(false);

  const initials = useMemo(() => {
    if (!name) return 'C';
    const noise = ['of', 'in', 'and', 'the', 'for', 'group', 'institutions', 'institutes', 'technology', 'science', 'institute', 'college', 'university', 'deemed', 'be', 'to', 'national'];
    const parts = name
      .split(/[\s,.-]+/)
      .filter(w => w && !noise.includes(w.toLowerCase()));
    
    if (parts.length === 0) return name.substring(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return parts.map(w => w[0]).join('').substring(0, 3).toUpperCase();
  }, [name]);

  const palette = useMemo(() => getCollegePalette(name), [name]);

  if (error || !src) {
    return (
      <div 
        className={className}
        style={{ 
          background: `linear-gradient(135deg, ${palette.from}, ${palette.via})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: palette.accent,
          fontWeight: 800,
          letterSpacing: '0.5px',
          fontSize: '0.7em',
          border: `1px solid ${palette.via}`,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} Logo`}
      onError={() => setError(true)}
      className={className}
    />
  );
}

interface CollegeBannerProps {
  src?: string;
  name: string;
  className?: string;
}

export function CollegeBanner({ src, name, className = "h-full w-full object-cover" }: CollegeBannerProps) {
  const [error, setError] = useState(false);

  const palette = useMemo(() => getCollegePalette(name), [name]);
  const hash = useMemo(() => hashString(name), [name]);

  if (error || !src) {
    // Generate unique geometric pattern positions based on name hash
    const circleX1 = 10 + (hash % 30);
    const circleY1 = 20 + (hash % 40);
    const circleX2 = 60 + (hash % 30);
    const circleY2 = 50 + (hash % 30);
    const circleR1 = 80 + (hash % 120);
    const circleR2 = 60 + (hash % 100);
    const lineAngle = hash % 360;

    return (
      <div 
        className={className}
        style={{ 
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(${135 + (hash % 90)}deg, ${palette.from} 0%, ${palette.via} 50%, ${palette.to} 100%)`,
        }}
      >
        {/* SVG geometric pattern overlay */}
        <svg 
          width="100%" 
          height="100%" 
          style={{ position: 'absolute', inset: 0, opacity: 0.12 }}
          preserveAspectRatio="none"
          viewBox="0 0 400 200"
        >
          {/* Grid pattern */}
          <defs>
            <pattern id={`grid-${hash}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <pattern id={`dots-${hash}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="white"/>
            </pattern>
          </defs>
          <rect width="400" height="200" fill={`url(#${hash % 2 === 0 ? `grid-${hash}` : `dots-${hash}`})`} />
          
          {/* Decorative circles */}
          <circle cx={circleX1 + '%'} cy={circleY1 + '%'} r={circleR1} fill="white" opacity="0.05" />
          <circle cx={circleX2 + '%'} cy={circleY2 + '%'} r={circleR2} fill="white" opacity="0.04" />
          
          {/* Diagonal accent line */}
          <line 
            x1="0" y1="200" 
            x2="400" y2={50 + (hash % 100)} 
            stroke={palette.accent} 
            strokeWidth="1" 
            opacity="0.15"
          />
          <line 
            x1="0" y1={180 - (hash % 80)} 
            x2="400" y2="0" 
            stroke="white" 
            strokeWidth="0.5" 
            opacity="0.08"
          />
        </svg>

        {/* Gradient glow accent */}
        <div 
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '60%',
            height: '80%',
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${palette.accent}15, transparent 70%)`,
          }}
        />
        
        {/* Top-left glow */}
        <div 
          style={{
            position: 'absolute',
            top: '-30%',
            left: '-15%',
            width: '50%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${palette.via}20, transparent 70%)`,
          }}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setError(true)}
      className={className}
    />
  );
}
