export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: "NGN" | "USD";
  type: TransactionType;
  category: string;
  status: "completed" | "pending" | "failed";
  createdAt: string; // ISO date string
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: "NGN" | "USD";
  targetDate?: string;
  createdAt: string;
}

export interface FinoraProfile {
  displayName: string;
  email?: string;
  avatarUrl?: string;
}

export interface FinoraAppState {
  version: 1;
  profile: FinoraProfile;
  balance: {
    available: number;
    currency: "NGN" | "USD";
  };
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  onboardingComplete: boolean;
  preferences: {
    currency: "NGN" | "USD";
    hideBalances: boolean;
    theme: "light" | "dark" | "system";
  };
}
