"use client";

import React, { useState } from "react";
import { loadAppState, saveAppState } from "@/lib/storage/storage";
import { FinoraAppState } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: "signup" | "signin";
  onClose: () => void;
  onSuccess: (userProfile: { displayName: string; email: string }) => void;
}

export function AuthModal({
  isOpen,
  initialMode = "signup",
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signup" | "signin">(initialMode);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ displayName?: string; email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode when initialMode changes or modal opens
  React.useEffect(() => {
    setMode(initialMode);
    setErrors({});
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { displayName?: string; email?: string; password?: string } = {};

    if (mode === "signup" && !displayName.trim()) {
      newErrors.displayName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate authenticating safely (per AGENTS.md demo rules, no real secrets stored)
    setTimeout(() => {
      const currentState = loadAppState();
      const updatedState: FinoraAppState = {
        ...currentState,
        profile: {
          ...currentState.profile,
          displayName: mode === "signup" ? displayName.trim() : (currentState.profile.displayName || "Alex Rivera"),
          email: email.trim(),
        },
        onboardingComplete: true,
      };

      saveAppState(updatedState);
      setIsSubmitting(false);
      onSuccess({
        displayName: updatedState.profile.displayName,
        email: updatedState.profile.email || email,
      });
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const currentState = loadAppState();
      const updatedState: FinoraAppState = {
        ...currentState,
        profile: {
          ...currentState.profile,
          displayName: currentState.profile.displayName || "Alex Rivera",
          email: currentState.profile.email || "alex.rivera@example.com",
        },
        onboardingComplete: true,
      };

      saveAppState(updatedState);
      setIsSubmitting(false);
      onSuccess({
        displayName: updatedState.profile.displayName,
        email: updatedState.profile.email || "alex.rivera@example.com",
      });
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Surface */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl border border-slate-100 flex flex-col text-[#17142B] font-sans max-h-[90vh] overflow-y-auto">
        {/* Top Handle / Close Button */}
        <div className="w-full flex items-center justify-between pb-2">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden mb-2" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication dialog"
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher: Sign Up vs Sign In */}
        <div className="flex bg-[#F5F3FF] p-1 rounded-2xl mb-5 mt-1 border border-purple-100">
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrors({});
            }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              mode === "signup"
                ? "bg-white text-[#4010D8] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrors({});
            }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              mode === "signin"
                ? "bg-white text-[#4010D8] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Header */}
        <div className="mb-5 text-center">
          <h2 id="auth-modal-title" className="text-2xl font-bold tracking-tight text-[#17142B]">
            {mode === "signup" ? "Create an account" : "Welcome back"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {mode === "signup"
              ? "Experience seamless banking and smart finance tracking."
              : "Enter your credentials to access your Finora dashboard."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
          {/* Full Name Field (Sign Up Only) */}
          {mode === "signup" && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Rivera"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#17142B] bg-slate-50/50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.displayName
                    ? "border-red-400 focus:ring-red-400/40"
                    : "border-slate-200 focus:border-[#4010D8] focus:ring-[#4010D8]/20"
                }`}
              />
              {errors.displayName && (
                <p className="mt-1 text-xs text-red-500">{errors.displayName}</p>
              )}
            </div>
          )}

          {/* Email Address Field */}
          <div>
            <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@finora.bank"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#17142B] bg-slate-50/50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.email
                  ? "border-red-400 focus:ring-red-400/40"
                  : "border-slate-200 focus:border-[#4010D8] focus:ring-[#4010D8]/20"
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              {mode === "signin" && (
                <span className="text-[11px] text-[#4010D8] font-medium hover:underline cursor-pointer">
                  Forgot password?
                </span>
              )}
            </div>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#17142B] bg-slate-50/50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.password
                  ? "border-red-400 focus:ring-red-400/40"
                  : "border-slate-200 focus:border-[#4010D8] focus:ring-[#4010D8]/20"
              }`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-6 bg-[#4010D8] hover:bg-[#3409B8] active:scale-[0.98] text-white font-bold text-base rounded-full shadow-[0_8px_20px_rgba(64,16,216,0.35)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{mode === "signup" ? "Create Account" : "Sign In"}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-slate-400 uppercase tracking-wider">
            or instant demo
          </span>
        </div>

        {/* Quick Demo One-Click Access */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#F5F3FF] hover:bg-[#EDE9FE] active:scale-[0.98] text-[#4010D8] font-semibold text-xs sm:text-sm rounded-full border border-purple-200/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#4010D8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
          </svg>
          <span>Continue as Demo User (Alex Rivera)</span>
        </button>

        {/* Security / Privacy notice adhering to AGENTS.md */}
        <p className="mt-4 text-center text-[11px] text-slate-400">
          Demo Prototype. Non-sensitive profile data persists locally in browser.
        </p>
      </div>
    </div>
  );
}
