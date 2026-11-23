"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { SecureAuthScreen } from "@/components/onboarding/SecureAuthScreen";
import { AuthScreen } from "@/components/auth/AuthScreen";

export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState<"secure" | "form">("secure");
  const [mode, setMode] = useState<"signup" | "signin">("signup");

  const handleBackFromSecure = () => {
    router.push("/");
  };

  const handleSelectAuth = (selectedMode: "signup" | "signin") => {
    setMode(selectedMode);
    setView("form");
  };

  const handleBackFromForm = () => {
    setView("secure");
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return (
    <MobileShell>
      {view === "secure" ? (
        <SecureAuthScreen
          onBack={handleBackFromSecure}
          onSelectAuth={handleSelectAuth}
          onComplete={handleComplete}
        />
      ) : (
        <AuthScreen
          initialMode={mode}
          onBack={handleBackFromForm}
          onSuccess={handleComplete}
        />
      )}
    </MobileShell>
  );
}

