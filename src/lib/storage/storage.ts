import { FinoraAppState } from "@/types";
import { APP_STATE_KEY, STORAGE_VERSION } from "./keys";
import { createInitialSeedState } from "./seed";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCurrency(value: unknown): value is "NGN" | "USD" {
  return value === "NGN" || value === "USD";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isTransaction(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.title) &&
    (value.description === undefined || typeof value.description === "string") &&
    typeof value.amount === "number" &&
    Number.isFinite(value.amount) &&
    isCurrency(value.currency) &&
    (value.type === "income" || value.type === "expense" || value.type === "transfer") &&
    isNonEmptyString(value.category) &&
    (value.status === "completed" || value.status === "pending" || value.status === "failed") &&
    typeof value.createdAt === "string"
  );
}

function isSavingsGoal(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    typeof value.targetAmount === "number" &&
    Number.isFinite(value.targetAmount) &&
    typeof value.currentAmount === "number" &&
    Number.isFinite(value.currentAmount) &&
    isCurrency(value.currency) &&
    (value.targetDate === undefined ||
      (typeof value.targetDate === "string" && !Number.isNaN(Date.parse(value.targetDate)))) &&
    typeof value.createdAt === "string"
  );
}

export function isAppStateValid(data: unknown): data is FinoraAppState {
  if (!isRecord(data)) return false;
  const { profile, balance, transactions, savingsGoals, preferences } = data;
  return (
    data.version === STORAGE_VERSION &&
    isRecord(profile) &&
    isNonEmptyString(profile.displayName) &&
    (profile.email === undefined || typeof profile.email === "string") &&
    (profile.avatarUrl === undefined || typeof profile.avatarUrl === "string") &&
    isRecord(balance) &&
    typeof balance.available === "number" &&
    Number.isFinite(balance.available) &&
    isCurrency(balance.currency) &&
    Array.isArray(transactions) &&
    transactions.every(isTransaction) &&
    Array.isArray(savingsGoals) &&
    savingsGoals.every(isSavingsGoal) &&
    typeof data.onboardingComplete === "boolean" &&
    isRecord(preferences) &&
    isCurrency(preferences.currency) &&
    typeof preferences.hideBalances === "boolean" &&
    (preferences.theme === "light" || preferences.theme === "dark" || preferences.theme === "system")
  );
}

export function loadAppState(): FinoraAppState {
  if (typeof window === "undefined") {
    return createInitialSeedState();
  }

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(APP_STATE_KEY);
  } catch (error) {
    console.error("Failed to read Finora state from localStorage:", error);
    return createInitialSeedState();
  }

  if (raw === null) {
    const seed = createInitialSeedState();
    saveAppState(seed);
    return seed;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    console.warn("Finora state contained malformed JSON. Reinitializing with seed state.", error);
    const seed = createInitialSeedState();
    saveAppState(seed);
    return seed;
  }

  if (isAppStateValid(parsed)) {
    return parsed;
  }

  console.warn("Finora state was invalid or outdated. Reinitializing with seed state.");
  const seed = createInitialSeedState();
  saveAppState(seed);
  return seed;
}

export function saveAppState(state: FinoraAppState): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error("Failed to save Finora state to localStorage:", error);
    return false;
  }
}

export function resetAppState(): FinoraAppState {
  if (typeof window === "undefined") {
    throw new Error("Demo data can only be reset in a browser.");
  }

  try {
    window.localStorage.removeItem(APP_STATE_KEY);
  } catch (error) {
    console.error("Failed to clear Finora state:", error);
    throw error;
  }
  return createInitialSeedState();
}
