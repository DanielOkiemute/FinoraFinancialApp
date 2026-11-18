import React from "react";

interface MobileShellProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileShell({ children, className = "" }: MobileShellProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070314] p-0 sm:p-4 md:p-6 lg:p-8">
      {/* Background ambient lighting for desktop view */}
      <div
        className="fixed inset-0 pointer-events-none hidden sm:block opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(109, 59, 245, 0.25) 0%, rgba(64, 16, 216, 0.08) 50%, transparent 75%)",
        }}
      />

      {/* Main Mobile App Frame */}
      <main
        className={`relative w-full sm:max-w-[420px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] sm:rounded-[44px] overflow-hidden flex flex-col justify-between shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] sm:border-[7px] sm:border-slate-800/80 bg-gradient-to-b from-[#2B0786] via-[#3C0CA8] to-[#17044F] ${className}`}
      >
        {children}
      </main>
    </div>
  );
}
