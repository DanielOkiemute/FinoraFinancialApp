"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { TransactionsScreen } from "@/components/transactions/TransactionsScreen";
import { loadAppState } from "@/lib/storage/storage";
import { FinoraAppState } from "@/types";

export default function TransactionsPage() {
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
    } else if (tab === "savings") {
      router.push("/savings");
    } else if (tab === "analytics") {
      router.push("/analytics");
    }
  };

  if (!appState) {
    return (
      <MobileShell>
        <div className="w-full h-full flex items-center justify-center bg-white">
          <span className="w-8 h-8 border-3 border-[#4010D8]/20 border-t-[#4010D8] rounded-full animate-spin" />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <TransactionsScreen
        appState={appState}
        onBack={handleBack}
        onNavigateTab={handleNavigateTab}
      />
    </MobileShell>
  );
}
