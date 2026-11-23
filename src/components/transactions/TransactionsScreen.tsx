"use client";

import React, { useState } from "react";
import { StatusBar } from "@/components/ui/StatusBar";
import { FinoraAppState, Transaction } from "@/types";

interface TransactionsScreenProps {
  appState: FinoraAppState;
  onBack: () => void;
  onNavigateTab?: (tab: "home" | "transactions" | "savings" | "cards" | "more") => void;
}

type FilterType = "all" | "income" | "expense";

export function TransactionsScreen({
  appState,
  onBack,
  onNavigateTab,
}: TransactionsScreenProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState(false);

  // Filter transactions based on selected pill
  const filteredTransactions = appState.transactions.filter((tx) => {
    if (filter === "income") return tx.type === "income";
    if (filter === "expense") return tx.type === "expense" || tx.type === "transfer";
    return true;
  });

  const getTransactionIcon = (tx: Transaction) => {
    const isIncome = tx.type === "income";

    // Electricity Bill
    if (tx.title.toLowerCase().includes("electricity") || tx.category.toLowerCase().includes("electricity")) {
      return (
        <div className="w-12 h-12 rounded-full bg-[#FEECEC] text-[#E5484D] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      );
    }

    // Airtime Purchase
    if (tx.title.toLowerCase().includes("airtime") || tx.category.toLowerCase().includes("airtime")) {
      return (
        <div className="w-12 h-12 rounded-full bg-[#EBF5FF] text-[#2563EB] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="3" />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
          </svg>
        </div>
      );
    }

    // DSTV / Cable TV
    if (tx.title.toLowerCase().includes("dstv") || tx.title.toLowerCase().includes("subscription") || tx.category.toLowerCase().includes("entertainment")) {
      return (
        <div className="w-12 h-12 rounded-full bg-[#EBF5FF] text-[#2563EB] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="15" rx="3" />
            <polyline points="17 2 12 7 7 2" />
            <circle cx="8" cy="14" r="1.5" fill="currentColor" />
          </svg>
        </div>
      );
    }

    // Money Received / Income (Mint Green)
    if (isIncome) {
      return (
        <div className="w-12 h-12 rounded-full bg-[#E8F8F0] text-[#16A36A] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      );
    }

    // Default Expense (Red)
    return (
      <div className="w-12 h-12 rounded-full bg-[#FEECEC] text-[#E5484D] flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="17" y1="7" x2="7" y2="17" />
          <polyline points="17 17 7 17 7 7" />
        </svg>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-white text-[#17142B] font-sans no-scrollbar">
      {/* Top Status Bar (Dark text/icons on light background) */}
      <StatusBar variant="dark" time="9:41" className="relative z-20" />

      {/* Top Navigation Bar: Back Arrow, Title, Calendar Icon */}
      <header className="relative z-20 w-full px-5 pt-1 pb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to dashboard"
          className="w-10 h-10 -ml-2 rounded-full hover:bg-purple-50 active:scale-95 text-[#17142B] flex items-center justify-center transition-all cursor-pointer"
        >
          <svg className="w-6 h-6 text-[#17142B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <h1 className="text-lg sm:text-xl font-extrabold text-[#17142B] tracking-tight">
          Transactions
        </h1>

        <button
          type="button"
          onClick={() => setSelectedDateFilter(!selectedDateFilter)}
          aria-label="Filter by date"
          className="w-10 h-10 -mr-2 rounded-full hover:bg-purple-50 active:scale-95 text-[#17142B] flex items-center justify-center transition-all cursor-pointer"
        >
          <svg className="w-5 h-5 text-[#17142B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <circle cx="8" cy="14" r="1" fill="currentColor" />
            <circle cx="12" cy="14" r="1" fill="currentColor" />
            <circle cx="16" cy="14" r="1" fill="currentColor" />
            <circle cx="8" cy="18" r="1" fill="currentColor" />
            <circle cx="12" cy="18" r="1" fill="currentColor" />
          </svg>
        </button>
      </header>

      {/* Date Filter Notification Banner (if clicked) */}
      {selectedDateFilter && (
        <div className="mx-5 mb-2 p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-[#4010D8] flex items-center justify-between animate-fadeIn">
          <span>Showing all dates (October 2026)</span>
          <button
            type="button"
            onClick={() => setSelectedDateFilter(false)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Segmented Filter Pills: All | Income | Expense */}
      <div className="w-full px-5 pt-1 pb-3 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer text-center ${
            filter === "all"
              ? "bg-[#6D3BF5] text-white shadow-md shadow-purple-900/15"
              : "bg-[#FAF9FF] hover:bg-[#F3E8FF] text-slate-700 border border-purple-100/70"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter("income")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer text-center ${
            filter === "income"
              ? "bg-[#6D3BF5] text-white shadow-md shadow-purple-900/15"
              : "bg-[#FAF9FF] hover:bg-[#F3E8FF] text-slate-700 border border-purple-100/70"
          }`}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => setFilter("expense")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer text-center ${
            filter === "expense"
              ? "bg-[#6D3BF5] text-white shadow-md shadow-purple-900/15"
              : "bg-[#FAF9FF] hover:bg-[#F3E8FF] text-slate-700 border border-purple-100/70"
          }`}
        >
          Expense
        </button>
      </div>

      {/* Main Transactions List (strictly NO scrollbar) */}
      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-5 pt-2 pb-6">
        <div className="flex flex-col gap-5">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === "income";
            const formattedAmount = `${isIncome ? "+" : "-"}₦${tx.amount.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}`;

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between transition-all"
              >
                {/* Left: Icon + Text Info */}
                <div className="flex items-center gap-3.5">
                  {getTransactionIcon(tx)}
                  <div>
                    <h2 className="text-sm sm:text-[15px] font-bold text-[#17142B] leading-snug">
                      {tx.title}
                    </h2>
                    {tx.description && (
                      <p
                        className={`text-xs mt-0.5 ${
                          tx.description.startsWith("080") || tx.description.startsWith("090")
                            ? "font-semibold text-[#1E40AF]"
                            : "font-medium text-slate-500"
                        }`}
                      >
                        {tx.description}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {tx.createdAt}
                    </p>
                  </div>
                </div>

                {/* Right: Amount */}
                <div className="text-right pl-3 shrink-0">
                  <span
                    className={`text-sm sm:text-base font-black tracking-tight ${
                      isIncome ? "text-[#16A36A]" : "text-[#E5484D]"
                    }`}
                  >
                    {formattedAmount}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              No {filter} transactions found.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar (Home, Transactions active, Savings, Cards, More) */}
      {onNavigateTab && (
        <nav
          className="w-full bg-white border-t border-slate-100/90 px-3 py-2 flex items-center justify-around shrink-0 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]"
          aria-label="Main Navigation"
        >
          {/* Home Tab */}
          <button
            type="button"
            onClick={() => {
              onNavigateTab("home");
              onBack();
            }}
            className="flex flex-col items-center gap-1 transition-all text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </button>

          {/* Transactions Tab (Active) */}
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-[#4010D8] cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56M21 3v6h-6" />
            </svg>
            <span className="text-[10px] font-bold">Transactions</span>
          </button>

          {/* Savings Tab */}
          <button
            type="button"
            onClick={() => onNavigateTab("savings")}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 11V9a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <rect x="3" y="11" width="18" height="9" rx="3" />
              <circle cx="12" cy="15" r="1.5" />
            </svg>
            <span className="text-[10px] font-medium">Savings</span>
          </button>

          {/* Cards Tab */}
          <button
            type="button"
            onClick={() => onNavigateTab("cards")}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span className="text-[10px] font-medium">Cards</span>
          </button>

          {/* More Tab */}
          <button
            type="button"
            onClick={() => onNavigateTab("more")}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
            <span className="text-[10px] font-medium">More</span>
          </button>
        </nav>
      )}
    </div>
  );
}
