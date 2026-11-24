"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { IncomeExpenseScreen } from "@/components/savings/IncomeExpenseScreen";
import { loadAppState } from "@/lib/storage/storage";
import { FinoraAppState } from "@/types";

export default function SavingsPage() {
  const router = useRouter();
  const [appState, setAppState] = useState<FinoraAppState | null>(null);

  useEffect(() => {
    const state = loadAppState();
    setAppState(state);
  }, []);

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleNavigateTab = (tab: "home" | "transactions" | "savings" | "analytics" | "more") => {
    if (tab === "home") {
      router.push("/dashboard");
    } else if (tab === "transactions") {
      router.push("/transactions");
    } else if (tab === "analytics") {
      router.push("/analytics");
    }
  };

  if (!appState) {
    return (
      <MobileShell>
        <div className="w-full h-full flex items-center justify-center bg-[#F7F6FD]">
          <span className="w-8 h-8 border-3 border-[#4010D8]/20 border-t-[#4010D8] rounded-full animate-spin" />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <IncomeExpenseScreen
        appState={appState}
        onStateUpdate={setAppState}
        onBack={handleBack}
        onNavigateTab={handleNavigateTab}
      />
    </MobileShell>
  );
}
