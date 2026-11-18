"use client";

import React from "react";

interface StatusBarProps {
  time?: string;
  className?: string;
  variant?: "light" | "dark"; // "light" = white text/icons on dark bg, "dark" = dark text/icons on light bg
}

export function StatusBar({
  time = "9:41",
  className = "",
  variant = "light",
}: StatusBarProps) {
  const isDarkText = variant === "dark";
  const textColor = isDarkText ? "text-[#17142B]" : "text-white";
  const barBg = isDarkText ? "bg-[#17142B]" : "bg-white";
  const borderColor = isDarkText ? "border-[#17142B]/90" : "border-white/90";
  const fillSvg = isDarkText ? "fill-[#17142B]" : "fill-white";

  return (
    <header
      className={`w-full flex items-center justify-between px-7 pt-3.5 pb-2 ${textColor} select-none z-20 ${className}`}
      aria-label="Status Bar"
    >
      {/* Time */}
      <span className="text-sm font-semibold tracking-tight">{time}</span>

      {/* Status Icons: Cellular, Wifi, Battery */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {/* Cellular Signal Bars (4 ascending bars) */}
        <div className="flex items-end gap-0.5 h-3">
          <span className={`w-0.5 h-1 ${barBg} rounded-full`} />
          <span className={`w-0.5 h-1.5 ${barBg} rounded-full`} />
          <span className={`w-0.5 h-2.5 ${barBg} rounded-full`} />
          <span className={`w-0.5 h-3 ${barBg} rounded-full`} />
        </div>

        {/* Wi-Fi Icon */}
        <svg
          className={`w-4 h-4 ml-0.5 ${fillSvg}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.32c3.84 0 7.32 1.54 9.87 4.04L12 18.66 2.13 11.36C4.68 8.86 8.16 7.32 12 7.32z" />
        </svg>

        {/* Battery Icon */}
        <div className="flex items-center ml-0.5">
          <div className={`w-5 h-2.5 rounded-[3px] border ${borderColor} p-[1.5px] flex items-center`}>
            <div className={`h-full w-3.5 ${barBg} rounded-[1.5px]`} />
          </div>
          <div className={`w-[1px] h-1 ${barBg} rounded-r-sm ml-[0.5px]`} />
        </div>
      </div>
    </header>
  );
}
