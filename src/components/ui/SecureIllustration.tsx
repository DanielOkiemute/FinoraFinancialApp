import React from "react";

interface SecureIllustrationProps {
  className?: string;
}

export function SecureIllustration({ className = "" }: SecureIllustrationProps) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 320 320"
        className="w-full h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Illustration of fictional finance demo features"
      >
        <defs>
          {/* Ambient Ground Shadow */}
          <radialGradient id="sec-ground-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4010D8" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#6D3BF5" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#6D3BF5" stopOpacity="0" />
          </radialGradient>

          {/* Smartphone Bezel & Shadow */}
          <filter id="phone-drop-shadow" x="-20%" y="-15%" width="140%" height="135%">
            <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#1e105a" floodOpacity="0.18" />
          </filter>

          {/* Phone Screen Gradient */}
          <linearGradient id="phone-screen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FAF9FF" />
            <stop offset="100%" stopColor="#EDE9FE" />
          </linearGradient>

          {/* Shield 3D Gradient */}
          <linearGradient id="shield-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="shield-grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Credit Card Gradient */}
          <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="45%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          {/* Card Shadow */}
          <filter id="card-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="4" dy="14" stdDeviation="10" floodColor="#2e1065" floodOpacity="0.32" />
          </filter>

          {/* Gold Coin Gradient */}
          <linearGradient id="coin-gold-grad" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="coin-face-grad" x1="20%" y1="15%" x2="80%" y2="85%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="60%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Purple Capsule Accent Gradient */}
          <linearGradient id="purple-capsule-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          {/* Coin Dropshadow */}
          <filter id="coin-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#78350f" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. Ground Ambient Glow / Floor Shadow */}
        <ellipse cx="160" cy="275" rx="100" ry="22" fill="url(#sec-ground-shadow)" />

        {/* 2. Floating Purple Capsule / Cylinder (Left background) */}
        <g transform="translate(48, 122) rotate(-35)" filter="url(#phone-drop-shadow)">
          <rect x="0" y="0" width="22" height="64" rx="11" fill="url(#purple-capsule-grad)" />
          {/* Subtle 3D highlight */}
          <rect x="3" y="4" width="6" height="56" rx="3" fill="#FFFFFF" fillOpacity="0.2" />
        </g>

        {/* 3. Top-Right Floating Gold Coin (Background) */}
        <g transform="translate(232, 68) rotate(18)" filter="url(#coin-shadow)">
          <ellipse cx="16" cy="16" rx="16" ry="12" fill="url(#coin-gold-grad)" />
          <ellipse cx="15.5" cy="15" rx="13" ry="9.5" fill="url(#coin-face-grad)" />
          <text x="15.5" y="19" fontSize="12" fontWeight="bold" fill="#B45309" textAnchor="middle" fontFamily="sans-serif">
            $
          </text>
        </g>

        {/* 4. Main 3D Smartphone Frame */}
        <g filter="url(#phone-drop-shadow)">
          {/* Outer Bezel (Dark navy frame with rounded corners) */}
          <rect
            x="100"
            y="48"
            width="120"
            height="188"
            rx="24"
            fill="#FFFFFF"
            stroke="#17142B"
            strokeWidth="6.5"
          />

          {/* Screen Area */}
          <rect
            x="104.5"
            y="52.5"
            width="111"
            height="179"
            rx="19"
            fill="url(#phone-screen-grad)"
          />

          {/* Speaker / Camera Notch */}
          <path
            d="M 136 52.5 L 184 52.5 C 184 58, 180 61, 175 61 L 145 61 C 140 61, 136 58, 136 52.5 Z"
            fill="#17142B"
          />

          {/* Shield Illustration on Phone Screen */}
          <g transform="translate(130, 84)">
            {/* Shield Left Half */}
            <path
              d="M 30 0 
                 L 4 8 
                 C 4 34, 18 48, 30 54 
                 L 30 0 Z"
              fill="url(#shield-grad-left)"
            />
            {/* Shield Right Half (Lighter for 3D depth) */}
            <path
              d="M 30 0 
                 L 56 8 
                 C 56 34, 42 48, 30 54 
                 L 30 0 Z"
              fill="url(#shield-grad-right)"
            />

            {/* Checkmark inside Shield */}
            <path
              d="M 19 25 L 26 33 L 42 16"
              stroke="#FFFFFF"
              strokeWidth="4.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Soft placeholder rounded bars on phone screen */}
          <rect x="126" y="156" width="68" height="6.5" rx="3.25" fill="#DDD6FE" fillOpacity="0.75" />
          <rect x="126" y="169" width="46" height="6.5" rx="3.25" fill="#DDD6FE" fillOpacity="0.5" />
        </g>

        {/* 5. Top-Left Floating Gold Coin */}
        <g transform="translate(68, 66) rotate(-22)" filter="url(#coin-shadow)">
          <ellipse cx="17" cy="17" rx="17" ry="13" fill="url(#coin-gold-grad)" />
          <ellipse cx="16.5" cy="16" rx="13.5" ry="10" fill="url(#coin-face-grad)" />
          <text x="16.5" y="20" fontSize="13" fontWeight="bold" fill="#B45309" textAnchor="middle" fontFamily="sans-serif">
            $
          </text>
        </g>

        {/* 6. Bottom-Left Larger Floating Gold Coin */}
        <g transform="translate(46, 172) rotate(12)" filter="url(#coin-shadow)">
          <ellipse cx="23" cy="23" rx="23" ry="18" fill="url(#coin-gold-grad)" />
          <ellipse cx="22" cy="21.5" rx="18.5" ry="14" fill="url(#coin-face-grad)" />
          <text x="22" y="27" fontSize="17" fontWeight="bold" fill="#B45309" textAnchor="middle" fontFamily="sans-serif">
            $
          </text>
        </g>

        {/* 7. Floating 3D Purple Credit Card (Right foreground) */}
        <g transform="translate(182, 106) rotate(-16)" filter="url(#card-shadow)">
          {/* Card Body */}
          <rect
            x="0"
            y="0"
            width="106"
            height="66"
            rx="10"
            fill="url(#card-grad)"
          />

          {/* EMV Chip */}
          <rect x="14" y="16" width="16" height="13" rx="3" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1" />
          <line x1="14" y1="22.5" x2="30" y2="22.5" stroke="#D97706" strokeWidth="0.8" />
          <line x1="22" y1="16" x2="22" y2="29" stroke="#D97706" strokeWidth="0.8" />

          {/* Contactless Wave Icon */}
          <path
            d="M 68 18 C 70 20, 70 24, 68 26 M 72 15 C 75 19, 75 25, 72 29"
            stroke="#DDD6FE"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Card Number Line Placers */}
          <rect x="14" y="38" width="56" height="4.5" rx="2.25" fill="#DDD6FE" fillOpacity="0.85" />

          {/* Card Holder & Expiry Placers */}
          <rect x="14" y="48" width="30" height="3.5" rx="1.75" fill="#DDD6FE" fillOpacity="0.6" />
          <rect x="68" y="48" width="18" height="3.5" rx="1.75" fill="#DDD6FE" fillOpacity="0.6" />

          {/* Top highlight shine */}
          <path
            d="M 0 10 C 0 4.5, 4.5 0, 10 0 L 96 0 C 101.5 0, 106 4.5, 106 10 L 106 20 L 0 35 Z"
            fill="#FFFFFF"
            fillOpacity="0.12"
          />
        </g>
      </svg>
    </div>
  );
}
