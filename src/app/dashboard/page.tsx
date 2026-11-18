"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { loadAppState, resetAppState } from "@/lib/storage/storage";
import { FinoraAppState } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [appState, setAppState] = useState<FinoraAppState | null>(null);

  useEffect(() => {
    const state = loadAppState();
    setAppState(state);
  }, []);

  const handleReset = () => {
    const fresh = resetAppState();
    setAppState(fresh);
    router.push("/");
  };

  if (!appState) {
    return (
      <MobileShell>
        <div className="w-full h-full flex items-center justify-center bg-[#F5F3FF]">
          <span className="w-8 h-8 border-3 border-[#4010D8]/20 border-t-[#4010D8] rounded-full animate-spin" />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <DashboardOverview
        appState={appState}
        onStateUpdate={setAppState}
        onReset={handleReset}
      />
    </MobileShell>
  );
}
