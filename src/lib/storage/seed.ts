import { FinoraAppState } from "@/types";

export const initialSeedState: FinoraAppState = {
  version: 1,
  profile: {
    displayName: "Alex Morgan",
    email: "alex.morgan@example.com",
  },
  balance: {
    available: 12450.80,
    currency: "USD",
  },
  transactions: [
    {
      id: "tx-1",
      title: "Grocery Market",
      description: "Weekly groceries",
      amount: 85.5,
      currency: "USD",
      type: "expense",
      category: "Groceries",
      status: "completed",
      createdAt: new Date().toISOString(),
    },
    {
      id: "tx-2",
      title: "Salary Deposit",
      description: "Monthly payroll",
      amount: 4500.0,
      currency: "USD",
      type: "income",
      category: "Salary",
      status: "completed",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "tx-3",
      title: "Savings Transfer",
      description: "Emergency fund savings",
      amount: 250.0,
      currency: "USD",
      type: "transfer",
      category: "Savings",
      status: "completed",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
  ],
  savingsGoals: [
    {
      id: "goal-1",
      name: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 6500,
      currency: "USD",
      targetDate: "2026-12-31",
      createdAt: new Date().toISOString(),
    },
  ],
  onboardingComplete: false,
  preferences: {
    currency: "USD",
    hideBalances: false,
    theme: "light",
  },
};
