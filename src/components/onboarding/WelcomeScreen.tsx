"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { FinoraLogo } from "@/components/ui/FinoraLogo";
import { BankIllustration } from "@/components/ui/BankIllustration";
import { BackgroundWaves } from "@/components/ui/BackgroundWaves";
import { loadAppState, resetAppState } from "@/lib/storage/storage";

interface WelcomeScreenProps {
  onNext?: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps = {}) {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Safely hydrate from localStorage on mount (prevents SSR mismatch)
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const state = loadAppState();
      if (state.onboardingComplete) setIsStarted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGetStarted = () => {
    if (onNext) {
      onNext();
    } else {
      router.push("/auth");
    }
  };

  const handleResetDemo = () => {
    if (!window.confirm("Reset the demo data stored only in this browser? This clears this browser's saved demo data.")) {
      return;
    }
    try {
      resetAppState();
      setIsStarted(false);
      setResetError(null);
    } catch (error) {
      console.error("Failed to reset demo data:", error);
      setResetError("Demo data could not be reset. Please try again.");
    }
  };

  return (
    <div className="relative w-full min-h-full flex flex-col justify-between text-white font-sans">
      {/* Background Organic Wave Curves & Radiant Glow */}
      <BackgroundWaves />

      {/* Top Status Bar */}
      <StatusBar time="9:41" />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between px-6 pt-4 pb-2">
        {/* Brand Area */}
        <div className="w-full flex flex-col items-center">
          <FinoraLogo size="md" showWordmark={true} showTagline={true} />

          {/* Value Proposition Headline */}
          <div className="mt-7 text-center">
            <h2 className="text-[27px] sm:text-[30px] font-bold leading-tight tracking-tight text-white drop-shadow-sm">
              Your Personal <br />
              <span className="font-extrabold bg-linear-to-r from-[#D8B4FE] to-[#C084FC] bg-clip-text text-transparent">
                Finance
              </span>{" "}
              Demo
            </h2>
            <p className="mt-2 text-sm sm:text-base font-normal text-purple-200/80 tracking-normal">
              Fictional balances. Simulated actions.
            </p>
          </div>
        </div>

        {/* Hero Illustration: Bank Building & Security Shield */}
        <div className="w-full flex items-center justify-center my-auto py-2">
          <BankIllustration className="w-full max-w-67.5 sm:max-w-75 transition-transform duration-500 hover:scale-105" />
        </div>

        {/* Bottom Actions: CTA Button & Pagination Dots */}
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-4 mb-3">
          {/* CTA Button */}
          <button
            type="button"
            onClick={handleGetStarted}
            className="group w-full py-4 px-6 bg-white text-primary hover:text-primary-hover rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_12px_28px_rgba(23,4,79,0.35)] hover:bg-[#FAF9FF] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            aria-label="Get Started with Finora"
          >
            <span>Get Started</span>
            <svg
              className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform duration-200"
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

          {/* Reset Demo State Trigger (per AGENTS.md demo requirement) */}
          {isStarted && (
            <div className="w-full text-center mt-1">
              <button
                type="button"
                onClick={handleResetDemo}
                className="text-xs text-purple-300/60 hover:text-purple-200 underline transition-colors"
                title="Reset local demo data"
              >
                Reset demo state
              </button>
            </div>
          )}
          {resetError && (
            <p role="status" className="text-center text-xs text-red-200">
              {resetError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
