"use client";

import React, { useState } from "react";
import { StatusBar } from "@/components/ui/StatusBar";
import { FinoraAppState } from "@/types";
import { saveAppState } from "@/lib/storage/storage";
import { TransactionsScreen } from "@/components/transactions/TransactionsScreen";
import { IncomeExpenseScreen } from "@/components/savings/IncomeExpenseScreen";
import { AnalyticsScreen } from "@/components/analytics/AnalyticsScreen";

interface DashboardOverviewProps {
  appState: FinoraAppState;
  onStateUpdate: (newState: FinoraAppState) => void;
  onReset?: () => void;
}

function UserAvatar({ displayName, avatarUrl }: { displayName: string; avatarUrl?: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 shadow-sm shrink-0 bg-linear-to-tr from-[#3108A4] to-primary-accent flex items-center justify-center">
      {!imgError && avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={displayName}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="#EAE7FC" />
          <circle cx="24" cy="19" r="9.5" fill="#8D5524" />
          <path d="M15 17c0-5.5 4-9.5 9-9.5s9 4 9 9.5c0 1-1 2-1 2s0-3-8-3-8 3-8 3-1-1-1-2z" fill="#181210" />
          <path d="M17.5 21.5c0 4.5 2.5 7.5 6.5 7.5s6.5-3 6.5-7.5c0 1-1.5 4.5-6.5 4.5s-6.5-3.5-6.5-4.5z" fill="#181210" />
          <path d="M21 23.5c1 1.2 5 1.2 6 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 44c0-7.5 6.5-12.5 15-12.5s15 5 15 12.5z" fill="#FFFFFF" />
          <path d="M22 31.5l2 4 2-4" stroke="#CBD5E1" strokeWidth="1" />
        </svg>
      )}
    </div>
  );
}

export function DashboardOverview({
  appState,
  onStateUpdate,
  onReset,
}: DashboardOverviewProps) {
  const [hideBalance, setHideBalance] = useState(appState.preferences.hideBalances);
  const [activeTab, setActiveTab] = useState<"home" | "transactions" | "savings" | "analytics" | "more">("home");
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const toggleHideBalance = () => {
    const updated: FinoraAppState = {
      ...appState,
      preferences: {
        ...appState.preferences,
        hideBalances: !hideBalance,
      },
    };
    setHideBalance(!hideBalance);
    saveAppState(updated);
    onStateUpdate(updated);
  };

  const displayName = appState.profile.displayName || "Daniel";

  // Format Nigerian Naira balance accurately matching ₦842,750.00
  const formattedBalance = appState.balance.currency === "NGN"
    ? `₦${appState.balance.available.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : new Intl.NumberFormat("en-US", { style: "currency", currency: appState.balance.currency }).format(appState.balance.available);

  // If user tapped 'Transactions' or 'See all', show the dedicated Transactions Screen
  if (activeTab === "transactions") {
    return (
      <TransactionsScreen
        appState={appState}
        onBack={() => setActiveTab("home")}
        onNavigateTab={setActiveTab}
      />
    );
  }

  // If user tapped 'Savings' tab, show the dedicated Income & Expenses screen
  if (activeTab === "savings") {
    return (
      <IncomeExpenseScreen
        appState={appState}
        onStateUpdate={onStateUpdate}
        onBack={() => setActiveTab("home")}
        onNavigateTab={setActiveTab}
      />
    );
  }

  // If user tapped 'Analytics' tab, show the dedicated Analytics Screen
  if (activeTab === "analytics") {
    return (
      <AnalyticsScreen
        appState={appState}
        onBack={() => setActiveTab("home")}
        onNavigateTab={setActiveTab}
      />
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#F7F6FD] text-main-text font-sans no-scrollbar">
      {/* Top Deep Purple Gradient Background Header */}
      <div className="absolute top-0 left-0 right-0 h-61.25 sm:h-66.25 bg-linear-to-b from-[#2E0796] via-[#3F10D8] to-[#5916E6] pointer-events-none" />
      <div
        className="absolute top-0 left-0 right-0 h-66.25 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse at 85% 10%, rgba(167, 139, 250, 0.45) 0%, transparent 60%)",
        }}
      />

      {/* Top Status Bar (White Icons & Text over Dark Header) */}
      <StatusBar variant="light" time="9:41" className="relative z-20" />

      {/* Scrollable Content Container (NO Scroll Bar) */}
      <div className="relative z-10 flex-1 flex flex-col px-5 pt-1 pb-3 overflow-y-auto no-scrollbar scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* User Greeting & Notification Bell Header */}
        <header className="flex items-center justify-between pt-1 pb-3">
          <div className="flex items-center gap-3">
            <UserAvatar displayName={displayName} avatarUrl={appState.profile.avatarUrl} />
            <div>
              <p className="text-xs sm:text-sm text-purple-200/90 font-medium">Hello,</p>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>{displayName}</span>
                <span className="text-xl">👋</span>
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            aria-label="View notifications"
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all shadow-sm cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </header>

        {/* Optional Notification Toast */}
        {showNotificationToast && (
          <div className="mb-2 p-2.5 rounded-2xl bg-white/95 text-main-text text-xs shadow-lg border border-purple-100 flex items-center justify-between animate-fadeIn">
            <span>All accounts are secure. 2 recent simulated actions.</span>
            <button
              type="button"
              onClick={() => setShowNotificationToast(false)}
              className="text-primary-accent font-bold ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Total Balance Card */}
        <div className="mt-2.5 w-full bg-white rounded-[26px] p-5 shadow-[0_12px_32px_rgba(40,10,180,0.08)] border border-purple-100/70 relative overflow-hidden">
          {/* Top Row: Label & Eye Icon + Conversion Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-slate-500">Total Balance</span>
              <button
                type="button"
                onClick={toggleHideBalance}
                aria-label={hideBalance ? "Show balance" : "Hide balance"}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
              >
                {hideBalance ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="button"
              className="text-primary-accent hover:text-primary p-1 transition-colors cursor-pointer"
              title="Currency details"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* Amount & Percentage Gain Pill */}
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[26px] sm:text-[30px] font-extrabold text-main-text tracking-tight">
              {hideBalance ? "••••••••" : formattedBalance}
            </div>
            <div className="inline-flex items-center gap-1 bg-[#E8F8F0] text-success px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-100/80">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <span>+5.2%</span>
            </div>
          </div>

          {/* Smooth Organic Wave Chart */}
          <div className="mt-2.5 w-full h-12 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 320 50" preserveAspectRatio="none">
              <defs>
                <linearGradient id="balanceWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6D3BF5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6D3BF5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 34 C 40 34, 60 40, 95 32 C 130 24, 155 42, 195 30 C 235 18, 265 28, 290 14 C 305 6, 315 8, 320 10 L 320 50 L 0 50 Z"
                fill="url(#balanceWaveGrad)"
              />
              <path
                d="M0 34 C 40 34, 60 40, 95 32 C 130 24, 155 42, 195 30 C 235 18, 265 28, 290 14 C 305 6, 315 8, 320 10"
                fill="none"
                stroke="#6D3BF5"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Quick Action Buttons (4 Columns) */}
        <div className="mt-4 sm:mt-5 grid grid-cols-4 gap-2.5 sm:gap-3">
          {/* Send Money */}
          <button
            type="button"
            className="flex flex-col items-center justify-center p-2.5 rounded-[22px] bg-white hover:bg-purple-50/50 active:scale-95 transition-all shadow-sm border border-purple-100/60 min-h-21 cursor-pointer"
          >
            <div className="w-7 h-7 flex items-center justify-center text-primary-accent">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-main-text mt-1.5 leading-tight text-center">
              Send<br />Money
            </span>
          </button>

          {/* Top Up */}
          <button
            type="button"
            className="flex flex-col items-center justify-center p-2.5 rounded-[22px] bg-white hover:bg-purple-50/50 active:scale-95 transition-all shadow-sm border border-purple-100/60 min-h-21 cursor-pointer"
          >
            <div className="w-7 h-7 flex items-center justify-center text-primary-accent">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-main-text mt-1.5 leading-tight text-center">
              Top Up
            </span>
          </button>

          {/* Pay Bills */}
          <button
            type="button"
            className="flex flex-col items-center justify-center p-2.5 rounded-[22px] bg-white hover:bg-purple-50/50 active:scale-95 transition-all shadow-sm border border-purple-100/60 min-h-21 cursor-pointer"
          >
            <div className="w-7 h-7 flex items-center justify-center text-primary-accent">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-main-text mt-1.5 leading-tight text-center">
              Pay Bills
            </span>
          </button>

          {/* More */}
          <button
            type="button"
            className="flex flex-col items-center justify-center p-2.5 rounded-[22px] bg-white hover:bg-purple-50/50 active:scale-95 transition-all shadow-sm border border-purple-100/60 min-h-21 cursor-pointer"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#6D3BF5">
                <circle cx="7" cy="7" r="2.5" />
                <circle cx="17" cy="7" r="2.5" />
                <circle cx="7" cy="17" r="2.5" />
                <circle cx="17" cy="17" r="2.5" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-main-text mt-1.5 leading-tight text-center">
              More
            </span>
          </button>
        </div>

        {/* Recent Transactions Section */}
        <section className="mt-5 sm:mt-6">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-base font-bold text-main-text">Recent Transactions</h2>
            <button
              type="button"
              onClick={() => setActiveTab("transactions")}
              className="text-xs font-semibold text-primary-accent hover:text-primary inline-flex items-center gap-1 cursor-pointer"
            >
              <span>See all</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {appState.transactions.slice(0, 2).map((tx) => {
              const isIncome = tx.type === "income";
              const formattedAmount = `${isIncome ? "+" : "-"}₦${tx.amount.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}`;

              return (
                <div key={tx.id} className="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-sm border border-purple-100/60">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                      isIncome ? "bg-[#E8F8F0] text-success" : "bg-[#FEECEC] text-error"
                    }`}>
                      {isIncome ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="17" y1="7" x2="7" y2="17" />
                          <polyline points="17 17 7 17 7 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-main-text leading-tight">{tx.title}</p>
                      {tx.description && (
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{tx.description}</p>
                      )}
                      <p className="text-[11px] text-slate-400 mt-0.5">{tx.createdAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm sm:text-base font-extrabold ${isIncome ? "text-success" : "text-error"}`}>
                      {formattedAmount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Demo Data Reset Trigger (per AGENTS.md requirement) */}
        {onReset && (
          <div className="mt-4 pt-2 text-center">
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] text-purple-700/60 hover:text-purple-700 hover:underline cursor-pointer"
            >
              Reset simulated demo data
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <nav
        className="w-full bg-white border-t border-slate-100/90 px-3 py-2 flex items-center justify-around shrink-0 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]"
        aria-label="Main Navigation"
      >
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("home")}
          className="flex flex-col items-center gap-1 transition-all cursor-pointer text-primary"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="text-[10px] font-bold">Home</span>
        </button>

        {/* Transactions Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("transactions")}
          className="flex flex-col items-center gap-1 transition-all cursor-pointer text-slate-400 hover:text-slate-600"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56M21 3v6h-6" />
          </svg>
          <span className="text-[10px] font-medium">Transactions</span>
        </button>

        {/* Savings Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("savings")}
          className="flex flex-col items-center gap-1 transition-all cursor-pointer text-slate-400 hover:text-slate-600"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 11V9a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <rect x="3" y="11" width="18" height="9" rx="3" />
            <circle cx="12" cy="15" r="1.5" />
          </svg>
          <span className="text-[10px] font-medium">Savings</span>
        </button>

        {/* Analytics Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className="flex flex-col items-center gap-1 transition-all cursor-pointer text-slate-400 hover:text-slate-600"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 20V10" />
            <path d="M12 20V4" />
            <path d="M6 20v-6" />
          </svg>
          <span className="text-[10px] font-medium">Analytics</span>
        </button>

        {/* More Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("more")}
          className="flex flex-col items-center gap-1 transition-all cursor-pointer text-slate-400 hover:text-slate-600"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </div>
  );
}
