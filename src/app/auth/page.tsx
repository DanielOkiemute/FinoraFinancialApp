"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { SecureAuthScreen } from "@/components/onboarding/SecureAuthScreen";

export default function AuthPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return (
    <MobileShell>
      <SecureAuthScreen onBack={handleBack} onComplete={handleComplete} />
    </MobileShell>
  );
}
