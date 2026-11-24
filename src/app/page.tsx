"use client";

import React, { useState, useEffect } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { SecureAuthScreen } from "@/components/onboarding/SecureAuthScreen";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { loadAppState, resetAppState } from "@/lib/storage/storage";
import { FinoraAppState } from "@/types";

type ScreenStage = "welcome" | "secure-auth" | "auth-screen" | "dashboard";

export default function Home() {
  const [appState, setAppState] = useState<FinoraAppState | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenStage>("welcome");
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
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

  const handleSelectAuthFromSecure = (mode: "signup" | "signin") => {
    setAuthMode(mode);
    setCurrentScreen("auth-screen");
  };

  const handleBackToSecure = () => {
    setCurrentScreen("secure-auth");
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
          onSelectAuth={handleSelectAuthFromSecure}
          onComplete={handleCompleteAuth}
        />
      )}

      {currentScreen === "auth-screen" && (
        <AuthScreen
          initialMode={authMode}
          onBack={handleBackToSecure}
          onSuccess={handleCompleteAuth}
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
