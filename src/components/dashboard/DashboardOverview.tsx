"use client";

import React, { useState } from "react";
import { StatusBar } from "@/components/ui/StatusBar";
import { FinoraLogo } from "@/components/ui/FinoraLogo";
import { FinoraAppState } from "@/types";
import { resetAppState, saveAppState } from "@/lib/storage/storage";

interface DashboardOverviewProps {
  appState: FinoraAppState;
  onStateUpdate: (newState: FinoraAppState) => void;
  onReset: () => void;
}

export function DashboardOverview({
  appState,
  onStateUpdate,
  onReset,
}: DashboardOverviewProps) {
  const [hideBalance, setHideBalance] = useState(appState.preferences.hideBalances);
  const [activeTab, setActiveTab] = useState<"home" | "transactions" | "cards" | "profile">("home");

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

  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: appState.balance.currency || "USD",
  }).format(appState.balance.available);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#F5F3FF] text-[#17142B] font-sans">
      {/* Top Status Bar */}
      <StatusBar variant="dark" time="9:41" />

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24">
        {/* Top Header / Profile Bar */}
        <header className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4010D8] to-[#7C3AED] text-white font-bold flex items-center justify-center text-sm shadow-md">
              {appState.profile.displayName?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Welcome back,</p>
              <h2 className="text-base font-bold text-[#17142B] leading-tight">
                {appState.profile.displayName || "Alex Rivera"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] font-semibold text-purple-700 bg-purple-100/70 hover:bg-purple-200 px-2.5 py-1.5 rounded-full transition-colors"
              title="Reset demo onboarding"
            >
              Reset Demo
            </button>
          </div>
        </header>

        {/* Balance Card */}
        <div className="mt-3 w-full p-5 rounded-3xl bg-gradient-to-br from-[#4010D8] via-[#5213E8] to-[#6D3BF5] text-white shadow-[0_16px_32px_rgba(64,16,216,0.28)] relative overflow-hidden">
          {/* Subtle background curved glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between text-purple-200 text-xs font-medium">
            <span>Total Available Balance</span>
            <button
              type="button"
              onClick={toggleHideBalance}
              aria-label={hideBalance ? "Show balance" : "Hide balance"}
              className="hover:text-white p-1 transition-colors"
            >
              {hideBalance ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight">
              {hideBalance ? "••••••••" : formattedBalance}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-purple-200">
            <span>Demo Checking •••• 4289</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
              Active
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-5 grid grid-cols-4 gap-3">
          {[
            {
              label: "Send",
              icon: (
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              ),
            },
            {
              label: "Pay Bills",
              icon: (
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              ),
            },
            {
              label: "Top Up",
              icon: (
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              ),
            },
            {
              label: "Cards",
              icon: (
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
              ),
            },
          ].map((action, i) => (
            <button
              key={i}
              type="button"
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 transition-all shadow-sm border border-slate-100"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#4010D8] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  {action.icon}
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Transactions Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#17142B]">Recent Activity</h3>
            <span className="text-xs font-semibold text-[#4010D8] hover:underline cursor-pointer">
              See All
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {appState.transactions.map((tx) => {
              const isIncome = tx.type === "income";
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isIncome ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-[#4010D8]"
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isIncome ? (
                          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                          <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#17142B]">{tx.title}</p>
                      <p className="text-[11px] text-slate-400">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        isIncome ? "text-emerald-600" : "text-[#17142B]"
                      }`}
                    >
                      {isIncome ? "+" : "-"}${tx.amount.toFixed(2)}
                    </p>
                    <span className="text-[10px] text-slate-400">Completed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav
        className="absolute bottom-0 left-0 right-0 h-18 bg-white border-t border-slate-100 px-6 flex items-center justify-between z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
        aria-label="Main Navigation"
      >
        {[
          {
            id: "home",
            label: "Home",
            icon: (
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="2" />
            ),
          },
          {
            id: "transactions",
            label: "Activity",
            icon: (
              <path d="M21 12a9 9 0 1 1-6.219-8.56M21 3v6h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ),
          },
          {
            id: "cards",
            label: "Cards",
            icon: (
              <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            ),
          },
          {
            id: "profile",
            label: "Profile",
            icon: (
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="none" stroke="currentColor" strokeWidth="2" />
            ),
          },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-[#4010D8]" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <svg className="w-5 h-5">{item.icon}</svg>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
