"use client";

import React, { useState, useEffect } from "react";
import { StatusBar } from "@/components/ui/StatusBar";
import { FinoraLogo } from "@/components/ui/FinoraLogo";
import { loadAppState, saveAppState } from "@/lib/storage/storage";
import { FinoraAppState } from "@/types";

interface AuthScreenProps {
  initialMode?: "signup" | "signin";
  onBack?: () => void;
  onSuccess?: (profile: { displayName: string }) => void;
}

export function AuthScreen({
  initialMode = "signup",
  onBack,
  onSuccess,
}: AuthScreenProps) {
  const [mode, setMode] = useState<"signup" | "signin">(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [returningUser, setReturningUser] = useState<string>("Daniel");
  const [demoFeedback, setDemoFeedback] = useState<string | null>(null);

  // Sync mode if initialMode changes
  useEffect(() => {
    setMode(initialMode);
    setErrors({});
    setDemoFeedback(null);
  }, [initialMode]);

  // Load existing profile name for personalized sign-in experience
  useEffect(() => {
    const state = loadAppState();
    if (state.profile?.displayName) {
      setReturningUser(state.profile.displayName);
    }
  }, []);

  // Compute password strength for Sign Up
  const getPasswordStrength = (pass: string): { level: number; text: string; color: string } => {
    if (!pass) return { level: 0, text: "", color: "bg-slate-200" };
    if (pass.length < 6) return { level: 1, text: "Too short", color: "bg-rose-500" };
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);

    if (pass.length >= 8 && hasLetters && hasNumbers && hasSpecial) {
      return { level: 3, text: "Strong", color: "bg-emerald-500" };
    }
    if (pass.length >= 6 && ((hasLetters && hasNumbers) || hasSpecial)) {
      return { level: 2, text: "Good", color: "bg-amber-500" };
    }
    return { level: 1, text: "Basic", color: "bg-amber-400" };
  };

  const strength = getPasswordStrength(password);

  const validate = (): boolean => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      password?: string;
    } = {};

    if (mode === "signup") {
      if (!firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else {
      // Sign In requires Password only
      if (!password) {
        newErrors.password = "Please enter your password";
      } else if (password.length < 4) {
        newErrors.password = "Password must be at least 4 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setDemoFeedback(null);

    // Simulate secure authentication (per AGENTS.md, passwords are never stored in localStorage)
    setTimeout(() => {
      const currentState = loadAppState();
      const resolvedDisplayName =
        mode === "signup"
          ? `${firstName.trim()} ${lastName.trim()}`
          : currentState.profile.displayName || returningUser || "Daniel";

      const updatedState: FinoraAppState = {
        ...currentState,
        profile: {
          ...currentState.profile,
          displayName: resolvedDisplayName,
        },
        onboardingComplete: true,
      };

      // Non-sensitive data persists safely
      saveAppState(updatedState);
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess({ displayName: resolvedDisplayName });
      }
    }, 600);
  };

  const userInitials = (returningUser || "Daniel")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#F5F3FF] text-[#17142B] font-sans">
      {/* Top Subtle Ambient Lighting */}
      <div
        className="absolute top-0 left-0 right-0 h-80 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(109, 59, 245, 0.22) 0%, rgba(245, 243, 255, 0.6) 65%, transparent 100%)",
        }}
      />

      {/* Top Status Bar */}
      <StatusBar variant="dark" time="9:41" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full px-5 pt-1 pb-2 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white active:scale-95 text-[#17142B] flex items-center justify-center transition-all cursor-pointer shadow-sm border border-purple-100"
          >
            <svg
              className="w-5 h-5 text-[#17142B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}

        {/* Center Finora Brand Icon */}
        <div className="flex items-center gap-1.5">
          <FinoraLogo size="sm" showWordmark={true} />
        </div>

        {/* Right Balance / Security Badge */}
        <div className="w-10 flex items-center justify-end">
          <div
            className="w-8 h-8 rounded-full bg-purple-100/70 text-[#4010D8] flex items-center justify-center"
            title="Bank-grade 256-bit simulated protection"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Form Card Container */}
      <div className="relative z-10 flex-1 flex flex-col px-5 py-1.5 sm:py-2 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Sleek Segmented Mode Switcher */}
        <div className="w-full max-w-sm mx-auto bg-purple-100/70 p-1.5 rounded-2xl flex items-center mb-3 sm:mb-4 border border-purple-200/60 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrors({});
              setDemoFeedback(null);
            }}
            aria-selected={mode === "signup"}
            className={`flex-1 py-2 sm:py-2.5 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              mode === "signup"
                ? "bg-white text-[#4010D8] shadow-md shadow-purple-900/10 scale-[1.01]"
                : "text-slate-600 hover:text-[#17142B]"
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrors({});
              setDemoFeedback(null);
            }}
            aria-selected={mode === "signin"}
            className={`flex-1 py-2 sm:py-2.5 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              mode === "signin"
                ? "bg-white text-[#4010D8] shadow-md shadow-purple-900/10 scale-[1.01]"
                : "text-slate-600 hover:text-[#17142B]"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Card Surface */}
        <div className="w-full max-w-sm mx-auto bg-white rounded-[28px] p-5 sm:p-6 shadow-[0_12px_36px_rgba(64,16,216,0.08)] border border-purple-100/90 flex flex-col my-auto">
          {/* Header Typography */}
          <div className="text-center mb-4 sm:mb-5">
            <h1 className="text-2xl font-extrabold text-[#17142B] tracking-tight">
              {mode === "signup" ? "Create Your Account" : "Welcome Back"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
              {mode === "signup"
                ? "Get started with your personal smart finance dashboard."
                : "Enter your password to securely access your Finora account."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-3.5" noValidate>
            {/* SIGN UP INPUTS: First Name, Last Name, and Password */}
            {mode === "signup" ? (
              <>
                {/* First Name Field */}
                <div>
                  <label
                    htmlFor="signup-firstname"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <input
                      id="signup-firstname"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
                      }}
                      placeholder="e.g. Alex"
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3.5 rounded-xl border text-sm text-[#17142B] bg-[#FAF9FF] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.firstName
                          ? "border-rose-400 focus:ring-rose-400/30"
                          : "border-[#E7E5EF] focus:border-[#4010D8] focus:ring-[#4010D8]/15"
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name Field */}
                <div>
                  <label
                    htmlFor="signup-lastname"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <input
                      id="signup-lastname"
                      type="text"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
                      }}
                      placeholder="e.g. Morgan"
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3.5 rounded-xl border text-sm text-[#17142B] bg-[#FAF9FF] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.lastName
                          ? "border-rose-400 focus:ring-rose-400/30"
                          : "border-[#E7E5EF] focus:border-[#4010D8] focus:ring-[#4010D8]/15"
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="signup-password"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Password
                    </label>
                    {password && (
                      <span className="text-[11px] font-semibold text-slate-500">
                        {strength.text}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="At least 6 characters"
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-11 py-2.5 sm:py-3.5 rounded-xl border text-sm text-[#17142B] bg-[#FAF9FF] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.password
                          ? "border-rose-400 focus:ring-rose-400/30"
                          : "border-[#E7E5EF] focus:border-[#4010D8] focus:ring-[#4010D8]/15"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="mt-1.5 flex items-center gap-1.5" aria-hidden="true">
                      <div className={`h-1 flex-1 rounded-full transition-all ${strength.level >= 1 ? strength.color : "bg-slate-200"}`} />
                      <div className={`h-1 flex-1 rounded-full transition-all ${strength.level >= 2 ? strength.color : "bg-slate-200"}`} />
                      <div className={`h-1 flex-1 rounded-full transition-all ${strength.level >= 3 ? strength.color : "bg-slate-200"}`} />
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>
              </>
            ) : (
              /* SIGN IN INPUT: Password ONLY */
              <>
                {/* Returning User Profile Chip */}
                <div className="w-full bg-[#FAF9FF] p-2.5 sm:p-3 rounded-2xl border border-purple-100 flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#4010D8] to-[#7C3AED] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {userInitials}
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-medium">Signing in as</p>
                      <p className="text-sm font-bold text-[#17142B]">{returningUser}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setErrors({});
                    }}
                    className="text-xs font-semibold text-[#4010D8] hover:text-[#30078F] underline cursor-pointer"
                  >
                    Switch
                  </button>
                </div>

                {/* Password Only Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="signin-password"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setDemoFeedback("Demo reset: Enter any password to continue.")}
                      className="text-[11px] font-semibold text-[#4010D8] hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="Enter your password"
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-11 py-2.5 sm:py-3.5 rounded-xl border text-sm text-[#17142B] bg-[#FAF9FF] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.password
                          ? "border-rose-400 focus:ring-rose-400/30"
                          : "border-[#E7E5EF] focus:border-[#4010D8] focus:ring-[#4010D8]/15"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Simulated Demo Feedback Message */}
            {demoFeedback && (
              <div className="p-2.5 rounded-xl bg-purple-50 text-[#4010D8] text-xs text-center border border-purple-200">
                {demoFeedback}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-1.5 sm:mt-2 py-3 sm:py-4 px-6 bg-[#4010D8] hover:bg-[#3209B0] active:scale-[0.98] text-white font-bold text-base rounded-full shadow-[0_10px_24px_rgba(64,16,216,0.35)] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{mode === "signup" ? "Create Account" : "Sign In"}</span>
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Reassurance Footer per AGENTS.md */}
          <div className="mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              {mode === "signup"
                ? "Simulated demo banking. Passwords are never stored on device."
                : "Protected with end-to-end simulated encryption."}
            </p>
          </div>
        </div>

        {/* Bottom Mode Switch helper */}
        <div className="text-center py-2 sm:py-3">
          {mode === "signup" ? (
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrors({});
                setDemoFeedback(null);
              }}
              className="text-xs text-slate-600 hover:text-[#4010D8] cursor-pointer"
            >
              Already have an account? <span className="font-bold text-[#4010D8] underline">Sign In</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrors({});
                setDemoFeedback(null);
              }}
              className="text-xs text-slate-600 hover:text-[#4010D8] cursor-pointer"
            >
              Don&apos;t have an account? <span className="font-bold text-[#4010D8] underline">Create one</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
