import React from "react";

export function BackgroundWaves() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* Primary Radial Glow */}
      <div
        className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[140%] h-[60%] rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(109, 59, 245, 0.45) 0%, rgba(64, 16, 216, 0.15) 60%, transparent 80%)",
        }}
      />

      {/* Top-Right Ambient Swoop */}
      <svg
        className="absolute -top-10 -right-20 w-[320px] h-[320px] opacity-40"
        viewBox="0 0 300 300"
        fill="none"
      >
        <path
          d="M300 0 C220 50 180 140 220 240 C240 290 280 320 300 330 Z"
          fill="url(#top-wave-grad)"
        />
        <defs>
          <linearGradient id="top-wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4010D8" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Lower Flowing Organic Wave 1 (Midground) */}
      <svg
        className="absolute bottom-[110px] left-0 w-full h-[180px] overflow-visible"
        viewBox="0 0 390 180"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="wave-mid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D3BF5" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#5111B8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#30078F" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path
          d="M0 120 C90 140 160 85 250 50 C320 20 360 30 390 40 V180 H0 Z"
          fill="url(#wave-mid-grad)"
        />
      </svg>

      {/* Lower Flowing Organic Wave 2 (Foreground behind CTA) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[190px] overflow-visible"
        viewBox="0 0 390 190"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="wave-fg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5512CE" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#3D0CA8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#250568" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M0 110 C80 90 180 150 280 120 C340 100 370 80 390 70 V190 H0 Z"
          fill="url(#wave-fg-grad)"
        />
      </svg>

      {/* Subtle Bottom Ambient Glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none opacity-30"
        style={{
          background:
            "linear-gradient(to top, rgba(32, 6, 88, 0.8) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
