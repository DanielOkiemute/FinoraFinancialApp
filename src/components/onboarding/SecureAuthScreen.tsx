"use client";

import React, { useState } from "react";
import { StatusBar } from "@/components/ui/StatusBar";
import { SecureIllustration } from "@/components/ui/SecureIllustration";
import { AuthModal } from "@/components/auth/AuthModal";

interface SecureAuthScreenProps {
  onBack?: () => void;
  onComplete?: () => void;
  onSelectAuth?: (mode: "signup" | "signin") => void;
}

export function SecureAuthScreen({
  onBack,
  onComplete,
  onSelectAuth,
}: SecureAuthScreenProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [activeDot, setActiveDot] = useState<number>(0);

  const handleOpenSignUp = () => {
    if (onSelectAuth) {
      onSelectAuth("signup");
      return;
    }
    setAuthMode("signup");
    setIsAuthOpen(true);
  };

  const handleOpenSignIn = () => {
    if (onSelectAuth) {
      onSelectAuth("signin");
      return;
    }
    setAuthMode("signin");
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-white text-main-text font-sans">
      {/* Top Subtle Ambient Glow */}
      <div
        className="absolute top-0 left-0 right-0 h-72 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(221, 214, 254, 0.45) 0%, rgba(245, 243, 255, 0.2) 60%, transparent 100%)",
        }}
      />

      {/* Top Status Bar (Dark Variant for Light Background) */}
      <StatusBar variant="dark" time="9:41" />

      {/* Back Button (If navigating from Welcome Screen) */}
      {onBack && (
        <div className="relative z-10 px-6 pt-1">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back to previous screen"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-main-text flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <svg
              className="w-5 h-5 text-main-text"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between px-6 pt-2 pb-6">
        {/* Hero 3D Security Illustration */}
        <div className="w-full flex items-center justify-center my-auto py-2">
          <SecureIllustration className="w-full max-w-67.5 sm:max-w-75 transition-transform duration-500 hover:scale-105" />
        </div>

        {/* Value Proposition Headline & Description */}
        <div className="w-full text-center mt-2 mb-4">
          <h2 className="text-[26px] sm:text-[28px] font-bold text-main-text tracking-tight leading-snug">
            Secure & Reliable
          </h2>
          <p className="mt-2 text-sm sm:text-base font-normal text-slate-500 leading-relaxed max-w-62.5 sm:max-w-67.5 mx-auto">
            Your money is safe with bank-grade security.
          </p>
        </div>

        {/* Carousel Pagination Dots */}
        <div
          className="flex items-center justify-center gap-2 pt-1 pb-4"
          role="tablist"
          aria-label="Security Onboarding Dots"
        >
          <button
            type="button"
            onClick={() => setActiveDot(0)}
            aria-label="Slide 1 active"
            aria-selected={activeDot === 0}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              activeDot === 0
                ? "w-2.5 h-2.5 bg-primary"
                : "w-2.5 h-2.5 bg-[#DDD6FE] hover:bg-[#C4B5FD]"
            }`}
          />
          <button
            type="button"
            onClick={() => setActiveDot(1)}
            aria-label="Slide 2"
            aria-selected={activeDot === 1}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              activeDot === 1
                ? "w-2.5 h-2.5 bg-primary"
                : "w-2.5 h-2.5 bg-[#DDD6FE] hover:bg-[#C4B5FD]"
            }`}
          />
          <button
            type="button"
            onClick={() => setActiveDot(2)}
            aria-label="Slide 3"
            aria-selected={activeDot === 2}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              activeDot === 2
                ? "w-2.5 h-2.5 bg-primary"
                : "w-2.5 h-2.5 bg-[#DDD6FE] hover:bg-[#C4B5FD]"
            }`}
          />
        </div>

        {/* Bottom Actions: Sign Up (replacing "Next") & Sign In (removing "Skip") */}
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-3">
          {/* Primary Action Button: "Sign Up" replacing "Next" */}
          <button
            type="button"
            onClick={handleOpenSignUp}
            className="group w-full py-4 px-6 bg-primary hover:bg-[#3409B8] active:scale-[0.98] text-white rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_12px_24px_rgba(64,16,216,0.3)] transition-all duration-200 cursor-pointer"
            aria-label="Sign Up for Finora"
          >
            <span>Sign Up</span>
            <svg
              className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Secondary Action: "Sign In" (Replaces and removes the word "Skip") */}
          <button
            type="button"
            onClick={handleOpenSignIn}
            className="py-2.5 px-4 text-sm font-semibold text-primary hover:text-[#2E07A0] transition-colors cursor-pointer flex items-center justify-center gap-1"
            aria-label="Sign In to existing Finora account"
          >
            <span className="text-slate-500 font-normal">Already have an account?</span>
            <span className="font-bold underline underline-offset-2">Sign In</span>
          </button>
        </div>
      </div>

      {/* Sign Up / Sign In Modal Sheet */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
