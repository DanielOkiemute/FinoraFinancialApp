"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { loadAppState, resetAppState } from "@/lib/storage/storage";
import { createInitialSeedState } from "@/lib/storage/seed";
import { FinoraAppState } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [appState, setAppState] = useState<FinoraAppState | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        setAppState(loadAppState());
      } catch (error) {
        console.error("Failed to initialize dashboard state:", error);
        setAppState(createInitialSeedState());
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleReset = () => {
    const fresh = resetAppState();
    setAppState(fresh);
    router.push("/");
  };

  if (!appState) {
    return (
      <MobileShell>
        <div role="status" aria-label="Loading dashboard" className="w-full h-full flex items-center justify-center bg-app-bg">
          <span className="sr-only">Loading dashboard</span>
          <span aria-hidden="true" className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
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
