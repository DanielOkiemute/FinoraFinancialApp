"use client";

import React, { useState } from "react";
import { StatusBar } from "@/components/ui/StatusBar";
import { FinoraAppState, Transaction, TransactionType } from "@/types";
import { saveAppState } from "@/lib/storage/storage";

interface IncomeExpenseScreenProps {
  appState: FinoraAppState;
  onStateUpdate: (newState: FinoraAppState) => void;
  onBack: () => void;
  onNavigateTab?: (tab: "home" | "transactions" | "savings" | "analytics") => void;
}

interface CategoryOption {
  id: string;
  name: string;
  defaultTitle: string;
  icon: (className?: string) => React.ReactNode;
}

const EXPENSE_CATEGORIES: CategoryOption[] = [
  {
    id: "food",
    name: "Food & Dining",
    defaultTitle: "Lunch & Groceries",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: "utility",
    name: "Electricity & Bill",
    defaultTitle: "Electricity Bill Payment",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "airtime",
    name: "Airtime & Data",
    defaultTitle: "Airtime Purchase",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="3" />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: "shopping",
    name: "Shopping",
    defaultTitle: "Store Purchase",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: "transport",
    name: "Transport",
    defaultTitle: "Ride & Fuel",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M7 16v4" />
        <path d="M17 16v4" />
        <circle cx="7.5" cy="11.5" r="1.5" fill="currentColor" />
        <circle cx="16.5" cy="11.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "entertainment",
    name: "Entertainment",
    defaultTitle: "DSTV Subscription",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="3" />
        <polyline points="17 2 12 7 7 2" />
        <circle cx="8" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "health",
    name: "Healthcare",
    defaultTitle: "Pharmacy & Health",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    id: "other_expense",
    name: "Other",
    defaultTitle: "General Expense",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

const INCOME_CATEGORIES: CategoryOption[] = [
  {
    id: "salary",
    name: "Salary",
    defaultTitle: "Monthly Salary",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: "transfer",
    name: "Transfer",
    defaultTitle: "Money Received",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    ),
  },
  {
    id: "freelance",
    name: "Freelance",
    defaultTitle: "Project Payment",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "investment",
    name: "Investment",
    defaultTitle: "Dividend / ROI",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    id: "gift",
    name: "Gift / Support",
    defaultTitle: "Gift Received",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    id: "other_income",
    name: "Other Income",
    defaultTitle: "Extra Inflow",
    icon: (cls = "w-4 h-4") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
];

export function IncomeExpenseScreen({
  appState,
  onStateUpdate,
  onBack,
  onNavigateTab,
}: IncomeExpenseScreenProps) {
  const [entryType, setEntryType] = useState<"expense" | "income">("expense");
  const [amountStr, setAmountStr] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("food");
  const [customTitle, setCustomTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Available categories depending on active tab
  const categories = entryType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Selected category object
  const activeCategory =
    categories.find((c) => c.id === selectedCategoryId) || categories[0];

  // Quick preset amount buttons
  const presetAmounts =
    entryType === "expense"
      ? [1000, 2500, 5000, 10000, 20000]
      : [5000, 10000, 20000, 50000, 100000];

  // Calculate total monthly stats from appState transactions
  const totalIncome = appState.transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = appState.transactions
    .filter((tx) => tx.type === "expense" || tx.type === "transfer")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Format currency
  const formatNaira = (val: number) =>
    `₦${val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  const handleTypeChange = (type: "expense" | "income") => {
    setEntryType(type);
    setErrorMessage(null);
    if (type === "expense") {
      setSelectedCategoryId("food");
      setCustomTitle("");
    } else {
      setSelectedCategoryId("salary");
      setCustomTitle("");
    }
  };

  const handleCategorySelect = (cat: CategoryOption) => {
    setSelectedCategoryId(cat.id);
    setErrorMessage(null);
    if (!customTitle || categories.some((c) => c.defaultTitle === customTitle)) {
      setCustomTitle(cat.defaultTitle);
    }
  };

  const handlePresetAmount = (preset: number) => {
    setAmountStr(preset.toString());
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedAmount = parseFloat(amountStr.replace(/,/g, ""));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid amount greater than 0");
      return;
    }

    if (entryType === "expense" && parsedAmount > appState.balance.available) {
      setErrorMessage(
        `Amount exceeds available balance (${formatNaira(appState.balance.available)})`
      );
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    const timeString = `Today, ${formattedHour}:${minutes} ${ampm}`;

    const finalTitle = customTitle.trim() || activeCategory.defaultTitle;
    const finalDescription = description.trim() || activeCategory.name;

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      title: finalTitle,
      description: finalDescription,
      amount: parsedAmount,
      currency: "NGN",
      type: entryType as TransactionType,
      category: activeCategory.name,
      status: "completed",
      createdAt: timeString,
    };

    // Calculate new balance
    const updatedBalance =
      entryType === "income"
        ? appState.balance.available + parsedAmount
        : appState.balance.available - parsedAmount;

    const updatedState: FinoraAppState = {
      ...appState,
      balance: {
        ...appState.balance,
        available: updatedBalance,
      },
      transactions: [newTransaction, ...appState.transactions],
    };

    // Persist to localStorage
    saveAppState(updatedState);
    onStateUpdate(updatedState);

    // Provide user feedback
    const actionLabel = entryType === "income" ? "Income added" : "Expense recorded";
    setToastMessage(`✓ ${actionLabel}: ${formatNaira(parsedAmount)}`);

    // Reset input fields
    setAmountStr("");
    setDescription("");
    setCustomTitle("");
    setIsSubmitting(false);

    // Auto dismiss toast after 3.5s
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#F7F6FD] text-[#17142B] font-sans no-scrollbar">
      {/* Top Status Bar (Dark text on light surface) */}
      <StatusBar variant="dark" time="9:41" className="relative z-20 shrink-0" />

      {/* Header Bar */}
      <header className="relative z-20 w-full px-5 pt-0.5 pb-1.5 flex items-center justify-between shrink-0">
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
            Income & Expenses
          </h1>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500">
            Cashflow & Savings Manager
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab("transactions")}
          aria-label="View transaction history"
          className="w-9 h-9 -mr-1.5 rounded-full hover:bg-purple-100/60 active:scale-95 text-[#6D3BF5] flex items-center justify-center transition-all cursor-pointer"
          title="View all transactions"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56M21 3v6h-6" />
          </svg>
        </button>
      </header>

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="absolute top-14 left-5 right-5 z-40 bg-[#17142B] text-white px-3.5 py-2 rounded-xl shadow-xl flex items-center justify-between text-xs font-semibold animate-fadeIn border border-white/10">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-purple-300 hover:text-white ml-2 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area (Fills space cleanly without scrolling) */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-4 sm:px-5 pb-1.5 min-h-0 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Top Summary & Mode Switcher */}
        <div className="flex flex-col gap-2 shrink-0">
          {/* 1. Sleek Cashflow Overview Bar */}
          <section className="w-full bg-white rounded-2xl px-3 py-2 sm:py-2.5 shadow-xs border border-purple-100/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                netSavings >= 0 ? "bg-[#E8F8F0] text-[#16A36A]" : "bg-[#FEECEC] text-[#E5484D]"
              }`}>
                {netSavings >= 0 ? (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="17" y1="7" x2="7" y2="17" />
                    <polyline points="17 17 7 17 7 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 leading-none">Net Savings</p>
                <p className={`text-xs sm:text-sm font-extrabold tracking-tight mt-0.5 ${
                  netSavings >= 0 ? "text-[#16A36A]" : "text-[#E5484D]"
                }`}>
                  {netSavings >= 0 ? "+" : "-"}{formatNaira(Math.abs(netSavings))}
                </p>
              </div>
            </div>

            {/* Income & Expense Mini Badges */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold">
              <span className="px-2 py-0.5 rounded-lg bg-[#E8F8F0] text-[#16A36A]">
                +{formatNaira(totalIncome)}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-[#FEECEC] text-[#E5484D]">
                -{formatNaira(totalExpense)}
              </span>
            </div>
          </section>

          {/* 2. Type Selector Tabs (Expense vs Income) */}
          <div className="w-full flex items-center bg-[#EAE7FC] p-1 rounded-2xl shadow-inner">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`flex-1 py-1.5 sm:py-2 flex items-center justify-center gap-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                entryType === "expense"
                  ? "bg-[#E5484D] text-white shadow-sm shadow-rose-900/20"
                  : "text-slate-600 hover:text-[#17142B]"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="17" y1="7" x2="7" y2="17" />
                <polyline points="17 17 7 17 7 7" />
              </svg>
              <span>Record Expense</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`flex-1 py-1.5 sm:py-2 flex items-center justify-center gap-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                entryType === "income"
                  ? "bg-[#16A36A] text-white shadow-sm shadow-emerald-900/20"
                  : "text-slate-600 hover:text-[#17142B]"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
              <span>Add Income</span>
            </button>
          </div>
        </div>

        {/* 3. Form Input Card (Structured compactly) */}
        <form onSubmit={handleSubmit} className="mt-2 bg-white rounded-2xl p-3 sm:p-3.5 shadow-xs border border-purple-100/70 flex flex-col justify-between gap-2.5 flex-1 min-h-0">
          
          {/* Amount Section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="amount-input" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {entryType === "expense" ? "Expense Amount" : "Income Amount"}
              </label>
              <span className="text-[10px] font-medium text-slate-400">
                Bal: {formatNaira(appState.balance.available)}
              </span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-3 text-lg sm:text-xl font-black text-[#6D3BF5]">
                ₦
              </span>
              <input
                id="amount-input"
                type="number"
                step="any"
                min="1"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => {
                  setAmountStr(e.target.value);
                  setErrorMessage(null);
                }}
                className={`w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl bg-[#F8F7FD] border ${
                  errorMessage
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-purple-100 focus:border-[#6D3BF5] focus:ring-purple-100"
                } text-lg sm:text-xl font-black text-[#17142B] placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all`}
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto no-scrollbar py-0.5">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetAmount(preset)}
                  className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full bg-purple-50 hover:bg-purple-100 active:scale-95 text-[#6D3BF5] border border-purple-200/60 transition-all shrink-0 cursor-pointer"
                >
                  +{formatNaira(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Note (Side-by-side) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="title-input" className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                Title / Subject
              </label>
              <input
                id="title-input"
                type="text"
                placeholder={activeCategory.defaultTitle}
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F8F7FD] border border-purple-100 text-xs font-semibold text-[#17142B] placeholder:text-slate-400 focus:outline-none focus:border-[#6D3BF5] focus:ring-1 focus:ring-purple-100 transition-all"
              />
            </div>

            <div>
              <label htmlFor="description-input" className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                Note (Optional)
              </label>
              <input
                id="description-input"
                type="text"
                placeholder="e.g. Market, Adekunle"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F8F7FD] border border-purple-100 text-xs font-semibold text-[#17142B] placeholder:text-slate-400 focus:outline-none focus:border-[#6D3BF5] focus:ring-1 focus:ring-purple-100 transition-all"
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-[#E5484D] font-semibold flex items-center gap-1.5 animate-fadeIn">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Category Picker (Compact Grid) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Select Category
              </span>
              <span className="text-[10px] font-bold text-[#6D3BF5]">
                {activeCategory.name}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-lg transition-all cursor-pointer border ${
                      isSelected
                        ? entryType === "income"
                          ? "bg-[#E8F8F0] border-[#16A36A] text-[#16A36A] shadow-xs font-bold scale-[1.02]"
                          : "bg-[#FEECEC] border-[#E5484D] text-[#E5484D] shadow-xs font-bold scale-[1.02]"
                        : "bg-[#F8F7FD] border-purple-100/60 text-slate-600 hover:bg-purple-50"
                    }`}
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      {cat.icon("w-3.5 h-3.5 sm:w-4 sm:h-4")}
                    </div>
                    <span className="text-[9px] sm:text-[10px] mt-0.5 text-center truncate w-full">
                      {cat.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-sm active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-auto ${
              entryType === "income"
                ? "bg-gradient-to-r from-[#16A36A] to-[#10B981] hover:brightness-105 shadow-emerald-900/15"
                : "bg-gradient-to-r from-[#4010D8] via-[#6D3BF5] to-[#E5484D] hover:brightness-105 shadow-purple-900/15"
            }`}
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>
                  {entryType === "income" ? "Add Income to Balance" : "Record Expense"}
                </span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Navigation Bar with Savings Active */}
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

        {/* Savings Tab (ACTIVE) */}
        <button
          type="button"
          className="flex flex-col items-center gap-1 text-[#4010D8] cursor-pointer"
          aria-current="page"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 11V9a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <rect x="3" y="11" width="18" height="9" rx="3" />
            <circle cx="12" cy="15" r="1.5" />
          </svg>
          <span className="text-[10px] font-bold">Savings</span>
        </button>

        {/* Analytics Tab */}
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab("analytics")}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 cursor-pointer"
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
