"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { FinoraLogo } from "@/components/ui/FinoraLogo";
import { BankIllustration } from "@/components/ui/BankIllustration";
import { BackgroundWaves } from "@/components/ui/BackgroundWaves";
import { loadAppState, resetAppState } from "@/lib/storage/storage";
import { FinoraAppState } from "@/types";

interface WelcomeScreenProps {
  onNext?: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps = {}) {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [appState, setAppState] = useState<FinoraAppState | null>(null);

  // Safely hydrate from localStorage on mount (prevents SSR mismatch)
  useEffect(() => {
    const state = loadAppState();
    setAppState(state);
    if (state.onboardingComplete) {
      // Keep track of onboarding state
      setIsStarted(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (onNext) {
      onNext();
    }
    router.push("/auth");
  };

  const handleResetDemo = () => {
    const defaultState = resetAppState();
    setAppState(defaultState);
    setIsStarted(false);
    setActiveSlide(0);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden text-white font-sans">
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
              Your Trusted <br />
              <span className="font-extrabold bg-linear-to-r from-[#D8B4FE] to-[#C084FC] bg-clip-text text-transparent">
                Financial
              </span>{" "}
              Partner
            </h2>
            <p className="mt-2 text-sm sm:text-base font-normal text-purple-200/80 tracking-normal">
              Simple. Secure. Smart.
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
            className="group w-full py-4 px-6 bg-white text-primary hover:text-[#30078F] rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_12px_28px_rgba(23,4,79,0.35)] hover:bg-[#FAF9FF] active:scale-[0.98] transition-all duration-200 cursor-pointer"
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

          {/* Pagination Carousel Dots */}
          <div
            className="flex items-center justify-center gap-2 pt-1"
            role="tablist"
            aria-label="Onboarding Slides"
          >
            <button
              type="button"
              onClick={() => setActiveSlide(0)}
              aria-label="Slide 1"
              aria-selected={activeSlide === 0}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeSlide === 0
                  ? "w-6 h-2 bg-white shadow-sm shadow-white/40"
                  : "w-2 h-2 bg-white/35 hover:bg-white/55"
              }`}
            />
            <button
              type="button"
              onClick={() => setActiveSlide(1)}
              aria-label="Slide 2"
              aria-selected={activeSlide === 1}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeSlide === 1
                  ? "w-6 h-2 bg-white shadow-sm shadow-white/40"
                  : "w-2 h-2 bg-white/35 hover:bg-white/55"
              }`}
            />
            <button
              type="button"
              onClick={() => setActiveSlide(2)}
              aria-label="Slide 3"
              aria-selected={activeSlide === 2}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeSlide === 2
                  ? "w-6 h-2 bg-white shadow-sm shadow-white/40"
                  : "w-2 h-2 bg-white/35 hover:bg-white/55"
              }`}
            />
          </div>

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
        </div>
      </div>
    </div>
  );
}
