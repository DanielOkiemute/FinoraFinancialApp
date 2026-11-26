"use client";

import React, { useState, useMemo } from "react";
import { StatusBar } from "@/components/ui/StatusBar";
import { FinoraAppState, Transaction } from "@/types";

interface AnalyticsScreenProps {
  appState: FinoraAppState;
  onBack: () => void;
  onNavigateTab?: (tab: "home" | "transactions" | "savings" | "analytics") => void;
}

type ChartViewMode = "expense" | "income" | "overview";

interface CategoryStat {
  id: string;
  name: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

// Category palette tailored to Finora's modern visual identity
const CATEGORY_COLORS: Record<string, string> = {
  // Expenses
  "Food & Dining": "#F97316",
  "Lunch & Groceries": "#F97316",
  "Electricity": "#E5484D",
  "Electricity & Bill": "#E5484D",
  "Airtime": "#2563EB",
  "Airtime & Data": "#2563EB",
  "Shopping": "#EC4899",
  "Transport": "#8B5CF6",
  "Entertainment": "#06B6D4",
  "Healthcare": "#10B981",
  "Other": "#64748B",
  "General Expense": "#64748B",
  // Incomes
  "Salary": "#16A36A",
  "Transfer": "#6D3BF5",
  "Freelance": "#3B82F6",
  "Investment": "#4010D8",
  "Gift / Support": "#F59E0B",
  "Other Income": "#0D9488",
  "Extra Inflow": "#0D9488",
};

const FALLBACK_COLORS = [
  "#6D3BF5",
  "#E5484D",
  "#16A36A",
  "#F59E0B",
  "#2563EB",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#64748B",
];

// Helper to determine the month string of a transaction
function getTransactionMonth(tx: Transaction): string {
  const str = tx.createdAt.toLowerCase();
  if (str.includes("oct") || str.includes("october")) return "October 2026";
  if (str.includes("nov") || str.includes("november")) return "November 2026";
  if (str.includes("dec") || str.includes("december")) return "December 2026";
  if (str.includes("sep") || str.includes("september")) return "September 2026";
  if (str.includes("today") || str.includes("yesterday")) return "November 2026";

  const parsed = new Date(tx.createdAt);
  if (!isNaN(parsed.getTime())) {
    const month = parsed.toLocaleString("default", { month: "long" });
    const year = parsed.getFullYear();
    return `${month} ${year}`;
  }

  return "November 2026";
}

// Mathematical Donut Arc Path Generator
function describeDonutSlice(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const angleDiff = Math.max(0.01, endAngle - startAngle);
  const isFull = angleDiff >= 359.9;
  const effectiveEnd = isFull ? startAngle + 359.99 : endAngle;

  const rad = Math.PI / 180;
  const startRad = (startAngle - 90) * rad;
  const endRad = (effectiveEnd - 90) * rad;

  const x1 = cx + outerRadius * Math.cos(startRad);
  const y1 = cy + outerRadius * Math.sin(startRad);
  const x2 = cx + outerRadius * Math.cos(endRad);
  const y2 = cy + outerRadius * Math.sin(endRad);

  const x3 = cx + innerRadius * Math.cos(endRad);
  const y3 = cy + innerRadius * Math.sin(endRad);
  const x4 = cx + innerRadius * Math.cos(startRad);
  const y4 = cy + innerRadius * Math.sin(startRad);

  const largeArc = angleDiff > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}

export function AnalyticsScreen({
  appState,
  onBack,
  onNavigateTab,
}: AnalyticsScreenProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("November 2026");
  const [viewMode, setViewMode] = useState<ChartViewMode>("expense");
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

  // Available unique months extracted from transactions
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    monthsSet.add("November 2026");
    monthsSet.add("October 2026");
    appState.transactions.forEach((tx) => {
      monthsSet.add(getTransactionMonth(tx));
    });
    return Array.from(monthsSet);
  }, [appState.transactions]);

  // Transactions filtered by selected month
  const monthlyTransactions = useMemo(() => {
    if (selectedMonth === "All Months") {
      return appState.transactions;
    }
    return appState.transactions.filter(
      (tx) => getTransactionMonth(tx) === selectedMonth
    );
  }, [appState.transactions, selectedMonth]);

  // Aggregate monthly totals
  const monthlyIncome = useMemo(
    () =>
      monthlyTransactions
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [monthlyTransactions]
  );

  const monthlyExpense = useMemo(
    () =>
      monthlyTransactions
        .filter((tx) => tx.type === "expense" || tx.type === "transfer")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [monthlyTransactions]
  );

  const monthlyNet = monthlyIncome - monthlyExpense;
  const savingsRate =
    monthlyIncome > 0
      ? Math.max(0, Math.min(100, Math.round((monthlyNet / monthlyIncome) * 100)))
      : 0;

  // Breakdown by Category for current view mode
  const categoryStats: CategoryStat[] = useMemo(() => {
    if (viewMode === "overview") {
      const total = monthlyIncome + monthlyExpense;
      if (total === 0) return [];
      return [
        {
          id: "income",
          name: "Total Income",
          amount: monthlyIncome,
          count: monthlyTransactions.filter((tx) => tx.type === "income").length,
          percentage: Math.round((monthlyIncome / total) * 100),
          color: "#16A36A",
        },
        {
          id: "expense",
          name: "Total Expenses",
          amount: monthlyExpense,
          count: monthlyTransactions.filter((tx) => tx.type !== "income").length,
          percentage: Math.round((monthlyExpense / total) * 100),
          color: "#E5484D",
        },
      ];
    }

    const filtered = monthlyTransactions.filter((tx) => {
      if (viewMode === "expense") return tx.type === "expense" || tx.type === "transfer";
      return tx.type === "income";
    });

    const totalAmount = filtered.reduce((sum, tx) => sum + tx.amount, 0);
    if (totalAmount === 0) return [];

    const map = new Map<string, { amount: number; count: number }>();
    filtered.forEach((tx) => {
      const key = tx.category || tx.title || "Other";
      const current = map.get(key) || { amount: 0, count: 0 };
      map.set(key, {
        amount: current.amount + tx.amount,
        count: current.count + 1,
      });
    });

    const stats: CategoryStat[] = [];
    let colorIdx = 0;
    map.forEach((data, name) => {
      const color =
        CATEGORY_COLORS[name] ||
        FALLBACK_COLORS[colorIdx % FALLBACK_COLORS.length];
      colorIdx++;
      stats.push({
        id: name,
        name,
        amount: data.amount,
        count: data.count,
        percentage: Number(((data.amount / totalAmount) * 100).toFixed(1)),
        color,
      });
    });

    // Sort descending by amount
    return stats.sort((a, b) => b.amount - a.amount);
  }, [monthlyTransactions, viewMode, monthlyIncome, monthlyExpense]);

  // Compute angles for Pie / Donut slices
  const chartSlices = useMemo(() => {
    const total = categoryStats.reduce((sum, item) => sum + item.amount, 0);
    if (total === 0) return [];

    let currentAngle = 0;
    return categoryStats.map((item) => {
      const sliceAngle = (item.amount / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle += sliceAngle;
      return {
        ...item,
        startAngle,
        endAngle,
      };
    });
  }, [categoryStats]);

  // Active slice info for center of donut
  const activeDetail = useMemo(() => {
    if (highlightedCategory) {
      const found = categoryStats.find((c) => c.name === highlightedCategory);
      if (found) return found;
    }
    return null;
  }, [highlightedCategory, categoryStats]);

  const formatNaira = (val: number) =>
    `₦${val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  const handlePrevMonth = () => {
    const idx = availableMonths.indexOf(selectedMonth);
    if (idx < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[idx + 1]);
      setHighlightedCategory(null);
    }
  };

  const handleNextMonth = () => {
    const idx = availableMonths.indexOf(selectedMonth);
    if (idx > 0) {
      setSelectedMonth(availableMonths[idx - 1]);
      setHighlightedCategory(null);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#F7F6FD] text-[#17142B] font-sans no-scrollbar">
      {/* Top Status Bar */}
      <StatusBar variant="dark" time="9:41" className="relative z-20 shrink-0" />

      {/* Header Bar */}
      <header className="relative z-20 w-full px-5 pt-0.5 pb-2 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to dashboard"
          className="w-9 h-9 -ml-1.5 rounded-full hover:bg-purple-100/60 active:scale-95 text-[#17142B] flex items-center justify-center transition-all cursor-pointer"
        >
          <svg className="w-5 h-5 text-[#17142B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div className="text-center">
          <h1 className="text-base sm:text-lg font-extrabold text-[#17142B] tracking-tight leading-tight">
            Financial Analytics
          </h1>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500">
            Monthly Incomes & Expenses
          </p>
        </div>

        {/* Quick action to add transaction via Savings tab */}
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab("savings")}
          aria-label="Add income or expense"
          title="Add Income/Expense"
          className="w-8 h-8 -mr-1 rounded-full bg-[#6D3BF5] hover:bg-[#4010D8] active:scale-95 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4 sm:px-5 pb-3">
        {/* Month Selector Carousel */}
        <div className="w-full bg-white rounded-2xl p-2 shadow-xs border border-purple-100/70 flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={availableMonths.indexOf(selectedMonth) >= availableMonths.length - 1}
            aria-label="Previous month"
            className="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-[#6D3BF5] transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#6D3BF5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-xs sm:text-sm font-black text-[#17142B] tracking-tight">
                {selectedMonth}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {monthlyTransactions.length} recorded transaction{monthlyTransactions.length === 1 ? "" : "s"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={availableMonths.indexOf(selectedMonth) <= 0}
            aria-label="Next month"
            className="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-[#6D3BF5] transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Monthly Summary Statistics Banner */}
        <section className="w-full bg-white rounded-2xl p-3 shadow-xs border border-purple-100/70 mb-3">
          <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Income</p>
              <p className="text-xs sm:text-sm font-black text-[#16A36A] mt-0.5 truncate">
                +{formatNaira(monthlyIncome)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expenses</p>
              <p className="text-xs sm:text-sm font-black text-[#E5484D] mt-0.5 truncate">
                -{formatNaira(monthlyExpense)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Cashflow</p>
              <p className={`text-xs sm:text-sm font-black mt-0.5 truncate ${
                monthlyNet >= 0 ? "text-[#4010D8]" : "text-[#E5484D]"
              }`}>
                {monthlyNet >= 0 ? "+" : ""}{formatNaira(monthlyNet)}
              </p>
            </div>
          </div>

          {/* Savings Rate Indicator */}
          {monthlyIncome > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Monthly Savings Rate</span>
              <span className="font-bold text-[#16A36A] bg-[#E8F8F0] px-2 py-0.5 rounded-full">
                {savingsRate}% saved
              </span>
            </div>
          )}
        </section>

        {/* View Switcher: Expense Breakdown | Income Sources | Overview */}
        <div className="w-full flex items-center bg-[#EAE7FC] p-1 rounded-2xl shadow-inner mb-3">
          <button
            type="button"
            onClick={() => {
              setViewMode("expense");
              setHighlightedCategory(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              viewMode === "expense"
                ? "bg-[#E5484D] text-white shadow-xs"
                : "text-slate-600 hover:text-[#17142B]"
            }`}
          >
            Expenses
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("income");
              setHighlightedCategory(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              viewMode === "income"
                ? "bg-[#16A36A] text-white shadow-xs"
                : "text-slate-600 hover:text-[#17142B]"
            }`}
          >
            Income
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("overview");
              setHighlightedCategory(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              viewMode === "overview"
                ? "bg-[#6D3BF5] text-white shadow-xs"
                : "text-slate-600 hover:text-[#17142B]"
            }`}
          >
            Cashflow
          </button>
        </div>

        {/* Interactive Pie / Donut Chart Card */}
        <section className="w-full bg-white rounded-2xl p-4 shadow-xs border border-purple-100/70 flex flex-col items-center mb-3">
          <div className="w-full flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {viewMode === "expense"
                ? "Expense Distribution"
                : viewMode === "income"
                ? "Income Sources"
                : "Income vs. Expense Ratio"}
            </h2>
            <span className="text-[11px] font-bold text-[#6D3BF5]">
              {selectedMonth}
            </span>
          </div>

          {/* SVG Pie / Donut Chart */}
          {chartSlices.length > 0 ? (
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 my-1 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full transform transition-transform duration-300"
              >
                {chartSlices.map((slice) => {
                  const isHighlighted = highlightedCategory === slice.name;
                  const innerR = isHighlighted ? 52 : 55;
                  const outerR = isHighlighted ? 92 : 88;
                  const pathD = describeDonutSlice(
                    100,
                    100,
                    innerR,
                    outerR,
                    slice.startAngle,
                    slice.endAngle
                  );

                  return (
                    <path
                      key={slice.id}
                      d={pathD}
                      fill={slice.color}
                      onClick={() =>
                        setHighlightedCategory(
                          highlightedCategory === slice.name ? null : slice.name
                        )
                      }
                      className="cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>

              {/* Center Donut Info Display */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4"
              >
                {activeDetail ? (
                  <div className="animate-fadeIn">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate max-w-[100px]">
                      {activeDetail.name}
                    </p>
                    <p className="text-xs sm:text-sm font-black text-[#17142B] leading-tight">
                      {formatNaira(activeDetail.amount)}
                    </p>
                    <p className="text-[10px] font-extrabold text-[#6D3BF5] mt-0.5">
                      {activeDetail.percentage}%
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {viewMode === "expense"
                        ? "Total Spend"
                        : viewMode === "income"
                        ? "Total Earned"
                        : "Total Flow"}
                    </p>
                    <p className="text-xs sm:text-sm font-black text-[#17142B] leading-tight">
                      {formatNaira(
                        viewMode === "expense"
                          ? monthlyExpense
                          : viewMode === "income"
                          ? monthlyIncome
                          : monthlyIncome + monthlyExpense
                      )}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Tap slice to view</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-[#6D3BF5] flex items-center justify-center mb-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <p className="text-xs font-bold text-[#17142B]">
                No {viewMode} recorded for {selectedMonth}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px]">
                Transactions recorded on the Savings screen will automatically appear here.
              </p>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab("savings")}
                  className="mt-3 px-3 py-1.5 rounded-full bg-[#6D3BF5] text-white text-xs font-bold active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  + Add {viewMode === "income" ? "Income" : "Expense"}
                </button>
              )}
            </div>
          )}
        </section>

        {/* Category Legend & Breakdown List */}
        {categoryStats.length > 0 && (
          <section className="w-full bg-white rounded-2xl p-3.5 shadow-xs border border-purple-100/70">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Category Breakdown
            </h2>

            <div className="flex flex-col gap-2">
              {categoryStats.map((item) => {
                const isSelected = highlightedCategory === item.name;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setHighlightedCategory(
                        highlightedCategory === item.name ? null : item.name
                      )
                    }
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-purple-50 border-[#6D3BF5] shadow-xs"
                        : "bg-[#F8F7FD] border-transparent hover:bg-purple-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#17142B] truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.count} transaction{item.count === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-[#17142B]">
                        {formatNaira(item.amount)}
                      </p>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.2 rounded-md"
                        style={{
                          backgroundColor: `${item.color}20`,
                          color: item.color,
                        }}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Bottom Navigation Bar with Analytics Active */}
      <nav
        className="w-full bg-white border-t border-slate-100/90 px-3 py-2 flex items-center justify-around shrink-0 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]"
        aria-label="Main Navigation"
      >
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => {
            if (onNavigateTab) onNavigateTab("home");
            else onBack();
          }}
          className="flex flex-col items-center gap-1 transition-all text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Transactions Tab */}
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab("transactions")}
          className="flex flex-col items-center gap-1 transition-all text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56M21 3v6h-6" />
          </svg>
          <span className="text-[10px] font-medium">Transactions</span>
        </button>

        {/* Savings Tab */}
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab("savings")}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 11V9a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <rect x="3" y="11" width="18" height="9" rx="3" />
            <circle cx="12" cy="15" r="1.5" />
          </svg>
          <span className="text-[10px] font-medium">Savings</span>
        </button>

        {/* Analytics Tab (ACTIVE) */}
        <button
          type="button"
          className="flex flex-col items-center gap-1 text-[#4010D8] cursor-pointer"
          aria-current="page"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 20V10" />
            <path d="M12 20V4" />
            <path d="M6 20v-6" />
          </svg>
          <span className="text-[10px] font-bold">Analytics</span>
        </button>

        {/* More Tab */}
        <button
          type="button"
          disabled
          title="More is unavailable in this demo"
          className="flex flex-col items-center gap-1 text-slate-300 cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
          <span className="text-[10px] font-medium">More (unavailable)</span>
        </button>
      </nav>
    </div>
  );
}
