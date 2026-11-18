import React from "react";

interface BankIllustrationProps {
  className?: string;
}

export function BankIllustration({ className = "" }: BankIllustrationProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      aria-label="Secure Banking Illustration"
    >
      <svg
        viewBox="0 0 280 200"
        className="w-full max-w-[280px] h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Bank Building Gradients */}
          <linearGradient id="bank-roof-grad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="bank-beam-grad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="bank-column-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#C4B5FD" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="bank-base-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.7" />
          </linearGradient>

          {/* Shield Gradients & Glow */}
          <linearGradient id="shield-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5B21B6" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="shield-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
          </linearGradient>

          {/* Soft Glow Filters */}
          <filter id="shield-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6D3BF5" floodOpacity="0.45" />
          </filter>

          <filter id="subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#1e0b57" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* --- BANK BUILDING --- */}
        <g filter="url(#subtle-shadow)" transform="translate(15, 20)">
          {/* Triangular Pediment (Roof) */}
          <polygon
            points="110,25 35,62 185,62"
            fill="url(#bank-roof-grad)"
          />
          {/* Roof Ridge Highlight */}
          <polygon
            points="110,25 35,62 42,62 110,28 178,62 185,62"
            fill="#FFFFFF"
            fillOpacity="0.35"
          />

          {/* Architrave / Upper Cornice Beam */}
          <rect
            x="30"
            y="62"
            width="160"
            height="12"
            rx="3"
            fill="url(#bank-beam-grad)"
          />

          {/* 4 Classical Columns */}
          {/* Column 1 */}
          <g transform="translate(42, 74)">
            <rect x="0" y="0" width="16" height="4" rx="1.5" fill="#DDD6FE" />
            <rect x="2" y="4" width="12" height="48" rx="2" fill="url(#bank-column-grad)" />
            <rect x="0" y="52" width="16" height="5" rx="1.5" fill="#DDD6FE" />
          </g>

          {/* Column 2 */}
          <g transform="translate(76, 74)">
            <rect x="0" y="0" width="16" height="4" rx="1.5" fill="#DDD6FE" />
            <rect x="2" y="4" width="12" height="48" rx="2" fill="url(#bank-column-grad)" />
            <rect x="0" y="52" width="16" height="5" rx="1.5" fill="#DDD6FE" />
          </g>

          {/* Column 3 */}
          <g transform="translate(110, 74)">
            <rect x="0" y="0" width="16" height="4" rx="1.5" fill="#DDD6FE" />
            <rect x="2" y="4" width="12" height="48" rx="2" fill="url(#bank-column-grad)" />
            <rect x="0" y="52" width="16" height="5" rx="1.5" fill="#DDD6FE" />
          </g>

          {/* Column 4 */}
          <g transform="translate(144, 74)">
            <rect x="0" y="0" width="16" height="4" rx="1.5" fill="#DDD6FE" />
            <rect x="2" y="4" width="12" height="48" rx="2" fill="url(#bank-column-grad)" />
            <rect x="0" y="52" width="16" height="5" rx="1.5" fill="#DDD6FE" />
          </g>

          {/* Stepped Podium (Base Tier 1) */}
          <rect
            x="24"
            y="131"
            width="172"
            height="10"
            rx="2.5"
            fill="url(#bank-base-grad)"
          />
          {/* Stepped Podium (Base Tier 2 - Lower plinth) */}
          <rect
            x="16"
            y="141"
            width="188"
            height="12"
            rx="3"
            fill="url(#bank-base-grad)"
          />
        </g>

        {/* --- SECURITY SHIELD WITH PADLOCK --- */}
        <g filter="url(#shield-glow)" transform="translate(182, 102)">
          {/* Shield Outer Shape */}
          <path
            d="M38 4 C58 4 72 10 74 15 C74 38 64 62 38 76 C12 62 2 38 2 15 C4 10 18 4 38 4 Z"
            fill="url(#shield-bg-grad)"
            stroke="url(#shield-border-grad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Shield Gloss Reflection */}
          <path
            d="M38 7 C53 7 67 12 70 16 C70 34 62 54 38 69 C37 68 36 68 38 7 Z"
            fill="#FFFFFF"
            fillOpacity="0.12"
          />

          {/* White Padlock */}
          <g transform="translate(23, 22)">
            {/* Padlock Arch / Shackle */}
            <path
              d="M8 17 V9 C8 4.5 11 1 15 1 C19 1 22 4.5 22 9 V17"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Padlock Body */}
            <rect
              x="3"
              y="15"
              width="24"
              height="20"
              rx="5"
              fill="#FFFFFF"
            />
            {/* Keyhole Cutout */}
            <circle cx="15" cy="23" r="2.5" fill="#5B21B6" />
            <path
              d="M13.8 24.5 L13 29.5 H17 L16.2 24.5 Z"
              fill="#5B21B6"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
