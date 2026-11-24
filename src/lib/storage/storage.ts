import { FinoraAppState } from "@/types";
import { APP_STATE_KEY, STORAGE_VERSION } from "./keys";
import { initialSeedState } from "./seed";

export function isAppStateValid(data: unknown): data is FinoraAppState {
  if (!data || typeof data !== "object") return false;
  const candidate = data as Partial<FinoraAppState>;
  return (
    candidate.version === STORAGE_VERSION &&
    typeof candidate.profile === "object" &&
    candidate.profile !== null &&
    typeof candidate.profile.displayName === "string" &&
    typeof candidate.balance === "object" &&
    candidate.balance !== null &&
    typeof candidate.balance.available === "number" &&
    Array.isArray(candidate.transactions) &&
    Array.isArray(candidate.savingsGoals) &&
    typeof candidate.onboardingComplete === "boolean" &&
    typeof candidate.preferences === "object" &&
    candidate.preferences !== null
  );
}

export function loadAppState(): FinoraAppState {
  if (typeof window === "undefined") {
    return initialSeedState;
  }

  try {
    const raw = window.localStorage.getItem(APP_STATE_KEY);
    if (!raw) {
      // First launch, save initial seed state
      saveAppState(initialSeedState);
      return initialSeedState;
    }

    const parsed = JSON.parse(raw);
    if (isAppStateValid(parsed)) {
      // Migrate legacy default seed state or update transactions list to full 5 items
      if (
        parsed.profile.displayName === "Alex Morgan" ||
        parsed.balance.currency === "USD" ||
        parsed.transactions.length < 5
      ) {
        const migrated: FinoraAppState = {
          ...parsed,
          profile: {
            ...parsed.profile,
            displayName: parsed.profile.displayName === "Alex Morgan" ? initialSeedState.profile.displayName : parsed.profile.displayName,
            avatarUrl: initialSeedState.profile.avatarUrl,
          },
          balance: {
            available: initialSeedState.balance.available,
            currency: "NGN",
          },
          transactions: initialSeedState.transactions,
          preferences: {
            ...parsed.preferences,
            currency: "NGN",
          },
        };
        saveAppState(migrated);
        return migrated;
      }
      return parsed;
    }

    // If corrupted or mismatched version, restore clean seed
    console.warn("Finora state was invalid or outdated. Reinitializing with seed state.");
    saveAppState(initialSeedState);
    return initialSeedState;
  } catch (error) {
    console.error("Failed to read Finora state from localStorage:", error);
    return initialSeedState;
  }
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
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(APP_STATE_KEY);
    } catch (error) {
      console.error("Failed to clear Finora state:", error);
    }
  }
  return initialSeedState;
}
