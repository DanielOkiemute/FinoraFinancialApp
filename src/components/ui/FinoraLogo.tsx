import React from "react";

interface FinoraLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  showTagline?: boolean;
}

export function FinoraLogo({
  className = "",
  size = "md",
  showWordmark = true,
  showTagline = true,
}: FinoraLogoProps) {
  const iconDimensions = {
    sm: "w-14 h-14",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  }[size];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Finora 3D Ribbon "F" Emblem */}
      <div className={`relative ${iconDimensions} flex items-center justify-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Finora Logo Emblem"
        >
          <defs>
            {/* Top Wing Gradient: Crisp pure white with soft lilac under-curve */}
            <linearGradient id="finora-top-wing-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#FFFFFF" />
              <stop offset="90%" stopColor="#F5F3FF" />
              <stop offset="100%" stopColor="#EDE9FE" />
            </linearGradient>

            {/* Purple Bird Head / Body: Vibrant royal violet */}
            <linearGradient id="finora-purple-body-grad" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#6D28D9" />
              <stop offset="100%" stopColor="#581C87" />
            </linearGradient>

            {/* Middle Wing Gradient: White to soft lilac seam */}
            <linearGradient id="finora-mid-wing-grad" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#FAF8FF" />
              <stop offset="100%" stopColor="#E4DAFD" />
            </linearGradient>

            {/* Lower Feather: Soft lilac translucent glow to crisp white tail */}
            <linearGradient id="finora-lower-feather-grad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#EDE9FE" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Clean soft ambient glow / elevation */}
            <filter id="finora-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0d0233" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Finora Bird "F" Emblem */}
          <g filter="url(#finora-shadow)">
            {/* 1. Purple Bird Body / Head Base */}
            <path
              d="M 33 42 
                 L 49 42 
                 C 47.5 50, 45.8 59, 44 66.5 
                 C 40 76, 33 83.5, 26.5 88.5 
                 C 25.8 82, 26 70, 26 60 
                 C 26 53, 28.5 46, 33 42 Z"
              fill="url(#finora-purple-body-grad)"
            />

            {/* 2. Lower Feather / Breast Highlight Overlay */}
            <path
              d="M 26 69.5 
                 C 29 69, 36.5 68.5, 44 66.5 
                 C 40 76, 33 83.5, 26.5 88.5 
                 C 25.8 82, 25.9 76, 26 69.5 Z"
              fill="url(#finora-lower-feather-grad)"
            />

            {/* 3. Bird Eye (Crisp Indigo Dot) */}
            <circle cx="34.8" cy="54.2" r="1.4" fill="#14064a" />

            {/* 4. Middle Wing (Crossbar of 'F') */}
            <path
              d="M 49 42 
                 L 64 42 
                 C 65.5 42.5, 65.8 45.5, 64.2 49 
                 C 61 56, 52.5 63.5, 44 66.5 
                 C 45.8 59, 47.5 50, 49 42 Z"
              fill="url(#finora-mid-wing-grad)"
            />

            {/* 5. Top Wing (Upper Sweeping Arc of 'F') */}
            <path
              d="M 33 42 
                 C 33.5 31, 39 17, 51 10 
                 C 60 4.5, 71 5.5, 75 9 
                 C 77 11, 76 14.5, 72.5 16.5 
                 C 64 22.5, 53.5 30.5, 49 42 
                 L 33 42 Z"
              fill="url(#finora-top-wing-grad)"
            />
          </g>
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showWordmark && (
        <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight text-white font-sans drop-shadow-sm">
          Finora
        </h1>
      )}

      {/* Tagline */}
      {showTagline && (
        <p className="mt-1 text-sm md:text-base font-medium text-purple-100/90 tracking-wide">
          Bank <span className="text-purple-300 font-bold mx-0.5">•</span> Pay{" "}
          <span className="text-purple-300 font-bold mx-0.5">•</span> Save{" "}
          <span className="text-purple-300 font-bold mx-0.5">•</span> Grow
        </p>
      )}
    </div>
  );
}
