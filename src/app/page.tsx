"use client";

import React, { useState, useEffect } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { SecureAuthScreen } from "@/components/onboarding/SecureAuthScreen";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { loadAppState, resetAppState } from "@/lib/storage/storage";
import { FinoraAppState } from "@/types";

type ScreenStage = "welcome" | "secure-auth" | "dashboard";

export default function Home() {
  const [appState, setAppState] = useState<FinoraAppState | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenStage>("welcome");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const state = loadAppState();
    setAppState(state);
    setIsHydrated(true);

    if (state.onboardingComplete) {
      setCurrentScreen("dashboard");
    } else {
      setCurrentScreen("welcome");
    }
  }, []);

  const handleNextFromWelcome = () => {
    setCurrentScreen("secure-auth");
  };

  const handleBackToWelcome = () => {
    setCurrentScreen("welcome");
  };

  const handleCompleteAuth = () => {
    const updated = loadAppState();
    setAppState(updated);
    setCurrentScreen("dashboard");
  };

  const handleResetDemo = () => {
    const freshState = resetAppState();
    setAppState(freshState);
    setCurrentScreen("welcome");
  };

  // While hydrating, render the clean WelcomeScreen as SSR baseline
  if (!isHydrated || !appState) {
    return (
      <MobileShell>
        <WelcomeScreen />
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      {currentScreen === "welcome" && (
        <WelcomeScreen onNext={handleNextFromWelcome} />
      )}

      {currentScreen === "secure-auth" && (
        <SecureAuthScreen
          onBack={handleBackToWelcome}
          onComplete={handleCompleteAuth}
        />
      )}

      {currentScreen === "dashboard" && (
        <DashboardOverview
          appState={appState}
          onStateUpdate={setAppState}
          onReset={handleResetDemo}
        />
      )}
    </MobileShell>
  );
}
