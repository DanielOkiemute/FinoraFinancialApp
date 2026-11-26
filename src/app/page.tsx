"use client";

import React, { useState, useEffect } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { SecureAuthScreen } from "@/components/onboarding/SecureAuthScreen";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { APP_STATE_KEY } from "@/lib/storage/keys";
import { loadAppState, resetAppState } from "@/lib/storage/storage";
import { createInitialSeedState } from "@/lib/storage/seed";
import { FinoraAppState } from "@/types";

type ScreenStage = "welcome" | "secure-auth" | "auth-screen" | "dashboard";

export default function Home() {
  const [appState, setAppState] = useState<FinoraAppState | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenStage>("welcome");
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let storageUpdated = false;
    let cancelled = false;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== APP_STATE_KEY) return;
      storageUpdated = true;
      try {
        setAppState(loadAppState());
        if (event.newValue === null) {
          setCurrentScreen("welcome");
        }
      } catch (error) {
        console.error("Failed to refresh Finora state after a storage update:", error);
      }
    };

    window.addEventListener("storage", handleStorage);
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        if (!storageUpdated) {
          const state = loadAppState();
          setAppState(state);
          setCurrentScreen(state.onboardingComplete ? "dashboard" : "welcome");
        }
      } catch (error) {
        console.error("Failed to initialize Finora state:", error);
        setAppState(createInitialSeedState());
        setCurrentScreen("welcome");
      } finally {
        setIsHydrated(true);
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener("storage", handleStorage);
    };
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

  if (!isHydrated || !appState) {
    return (
      <MobileShell>
        <div role="status" aria-label="Loading Finora" className="flex h-full items-center justify-center bg-app-bg text-main-text">
          <span>Loading Finora…</span>
        </div>
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
