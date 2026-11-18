# AGENTS.md --- Finora

## 1. Project mission

Build **Finora**, a polished, mobile-first personal finance dashboard
and money-management app.

The application should feel trustworthy, modern, calm, and easy to use.
Prioritize clarity, accessibility, responsive behavior, maintainable
code, and reliable local persistence.

### Core product areas

Implement the screens and flows that are in the product brief/designs,
which may include:

-   Splash and onboarding
-   Dashboard / financial overview
-   Transactions and transaction details
-   Send money
-   Pay bills
-   Savings goals
-   Cards
-   Profile
-   Settings

Do not invent real banking integrations. Unless the project brief
explicitly provides a legitimate integration, all balances, transfers,
bills, cards, and transactions are **demo data and simulated actions**.

## 2. Required technology

-   **Language:** TypeScript
-   **Framework:** Next.js using the App Router
-   **Styling:** Tailwind CSS
-   **Layout strategy:** Mobile-first responsive design
-   **Persistence:** Browser `localStorage` for non-sensitive app/demo
    data
-   **Package manager:** Follow the lockfile already present in the
    repository. Do not replace package managers or regenerate lockfiles
    without a clear need.

Use the versions and conventions already established by the repository.
Do not upgrade major dependencies just to match this document.

## 3. Working principles

1.  Inspect the existing project structure before changing files.
2.  Preserve working code and established conventions.
3.  Build complete, connected user flows---not isolated decorative
    screens.
4.  Keep components small, typed, reusable, and easy to test.
5.  Prefer native platform features and existing dependencies over
    adding packages.
6.  Never claim a transfer, payment, or banking action has reached a
    real financial institution.
7.  Do not add a backend, authentication provider, database, or external
    API unless requested.
8.  When a requirement is ambiguous, choose the simplest safe
    implementation and document the assumption.
9.  After meaningful changes, run the available lint, type-check, and
    build commands. Fix errors introduced by the change.

## 4. Next.js and TypeScript conventions

-   Use the **App Router** and organize routes under `src/app` if that
    structure already exists; otherwise follow the repository's current
    structure.
-   Use Server Components by default.
-   Add `"use client"` only to components that need browser APIs, React
    state, event handlers, or client-side effects.
-   Never access `window`, `document`, or `localStorage` during server
    rendering or at module scope.
-   Use TypeScript strict typing. Avoid `any`; use `unknown` and narrow
    it when the shape is not known.
-   Define shared domain types in a clear location such as `src/types`.
-   Use named exports for reusable components and utilities unless the
    existing project convention differs.
-   Keep route-level files focused on composing page sections. Move
    reusable UI and business logic into separate modules.
-   Use semantic HTML and accessible labels.
-   Do not use a client component for an entire page when only a small
    child component needs interactivity.

Suggested structure (adapt to the existing repository rather than
forcing a restructure):

``` text
src/
  app/
    layout.tsx
    page.tsx
    dashboard/
    transactions/
    transfer/
    bills/
    savings/
    cards/
    profile/
    settings/
    globals.css
  components/
    layout/
    navigation/
    dashboard/
    transactions/
    forms/
    ui/
  features/
    transactions/
    transfers/
    savings/
    bills/
  lib/
    storage/
    formatters/
    validation/
    constants/
  types/
```

## 5. Mobile-first responsive design

Design for a small phone viewport first, then progressively enhance for
larger screens.

-   Start with the narrow-screen layout and Tailwind base classes.
-   Add `sm:`, `md:`, `lg:`, and larger breakpoints only when the layout
    needs them.
-   Prevent horizontal overflow at every supported viewport.
-   Use a mobile bottom navigation where appropriate; use a sidebar or
    wider navigation on desktop where it improves usability.
-   Ensure important actions remain reachable and visible on mobile.
-   Use flexible widths, sensible max-widths, and responsive grids
    rather than fixed page widths.
-   Respect safe areas on mobile devices where fixed navigation or
    bottom sheets are used.
-   Keep touch targets comfortably large (aim for at least 44 × 44 CSS
    pixels).
-   Test at approximately 320px, 375px, 390px, 768px, 1024px, and 1440px
    widths.

## 6. Finora visual system

Use the supplied Figma file or approved design references as the source
of truth. If a design reference conflicts with this section, follow the
approved design and update this document when appropriate.

Starting design tokens:

  Token            Value
  ---------------- --------------------------------------------
  Primary          `#4010D8`
  Primary accent   `#6D3BF5`
  App background   `#F5F3FF`
  Main text        `#17142B`
  Success          `#16A36A`
  Error            `#E5484D`
  Warning          `#F2A900`
  Border           `#E7E5EF`
  Font             Inter, with a sensible sans-serif fallback

Typography guidance:

-   Display: 32px / bold
-   Page heading: 24px / semibold
-   Section heading: 18px / semibold
-   Body: 14--16px / regular
-   Caption: 12px / regular

Spacing scale: `4, 8, 12, 16, 24, 32, 40, 48px`.

Shape guidance:

-   Cards: approximately 20px radius
-   Buttons: approximately 14px radius
-   Inputs: approximately 12px radius

Implementation rules:

-   Centralize reusable colors and design tokens using CSS variables
    and/or Tailwind theme configuration appropriate to the installed
    Tailwind version.
-   Avoid scattering arbitrary hex values throughout components.
-   Maintain consistent spacing, radii, typography, shadows, and icon
    sizes.
-   Use icons consistently. Do not use emoji as substitutes for
    interface icons.
-   Use subtle shadows and borders; avoid excessive gradients, glass
    effects, and visual clutter.
-   Ensure text and controls have sufficient contrast.
-   Do not use color alone to communicate transaction status.

## 7. Local data persistence --- required

Persist the app's demo state in the browser's `localStorage` so that
data remains after a page refresh or browser restart on the same
browser/device.

### 7.1 What may be persisted

Persist only non-sensitive demo/application data, for example:

-   User display name and non-sensitive profile preferences
-   Theme or selected display preferences
-   Demo account labels and demo balances
-   Demo transactions
-   Savings goals and their progress
-   Demo bill-payment history
-   App onboarding completion state
-   User-selected filters or settings, if useful

Use a single, documented storage layer rather than calling
`localStorage` directly from many components.

### 7.2 What must never be persisted

Do **not** store any of the following in `localStorage`:

-   Passwords, PINs, OTPs, recovery codes, or authentication tokens
-   Real card numbers, CVVs, bank account credentials, or security
    answers
-   Real banking credentials or sensitive identity documents
-   Any real payment authorization data

This project uses local storage for a prototype/demo experience.
`localStorage` is not encrypted, is accessible to scripts running on the
origin, and is not suitable for secrets or regulated financial records.
Do not describe the app as production-secure banking software.

### 7.3 Storage implementation requirements

Create a small typed storage module, for example:

``` text
src/lib/storage/
  keys.ts
  storage.ts
  app-store.ts
```

The implementation should:

-   Guard all browser storage access with
    `typeof window !== "undefined"`.
-   Handle unavailable storage, malformed JSON, quota errors, and
    read/write failures without crashing the app.
-   Validate parsed values before trusting them. Use a schema validation
    library only if one is already installed or clearly justified;
    otherwise write small type guards.
-   Include a storage schema version, such as `version: 1`, so future
    data migrations can be added safely.
-   Use namespaced keys, for example `finora:app-state`.
-   Provide typed read, write, update, and reset functions.
-   Avoid writing to storage on every render.
-   Keep React state and persisted state synchronized through a clear
    provider, hook, or repository pattern.
-   Initialize client state without causing server/client hydration
    mismatches.
-   Show a loading/initialization state if persisted data must be read
    before rendering data-dependent UI.
-   Handle multiple tabs gracefully where practical, using the browser
    `storage` event to refresh state when another tab changes the app
    data.
-   Provide a reset-demo-data action in an appropriate development/demo
    setting.

### 7.4 Recommended data flow

Use this flow consistently:

``` text
User interaction
      |
      v
Feature action / handler
      |
      v
Validate and update typed app state
      |
      +------> Update visible UI state
      |
      v
Persist updated state through storage module
      |
      v
localStorage (browser only)
```

Components should not each implement their own storage logic. Keep
persistence behind a small API so it can later be replaced by a backend.

### 7.5 Example state model

Adapt the model to the actual screens and designs. Keep it typed and
avoid storing duplicate derived values.

``` ts
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
```

Use integer minor units (for example, kobo/cents) for monetary
arithmetic if the app needs accurate calculations. If the UI stores
decimal amounts for demo simplicity, centralize parsing and formatting
and avoid floating-point accumulation for financial calculations.

### 7.6 Demo data and reset behavior

-   Provide realistic but clearly fictional seed data for first launch.
-   Seed data should be created only when no valid saved state exists.
-   Do not overwrite a user's saved demo state on every reload.
-   A reset action should ask for confirmation before deleting the
    current demo state.
-   Make it clear that reset affects only this browser's local demo
    data.
-   Do not imply that deleting local data reverses a real payment.

## 8. Finance-specific behavior and calculations

-   Keep all demo monetary actions clearly simulated.
-   Validate amount inputs: amount must be a finite positive number and
    within any configured demo limits.
-   Prevent accidental duplicate submissions while an action is being
    processed.
-   Show a clear success, pending, or failure state after simulated
    actions.
-   Record successful simulated actions in the transaction history.
-   Update balances and related views from one consistent source of
    truth.
-   Do not calculate displayed totals independently in multiple
    components.
-   Centralize currency formatting with `Intl.NumberFormat`.
-   Store dates in ISO format and format them for display at the UI
    boundary.
-   Do not use a transaction's display label as its unique identifier;
    generate a stable ID.
-   Clearly label demo accounts, cards, recipients, and transactions as
    fictional where confusion with real financial activity is possible.

## 9. Forms, validation, and feedback

-   Use controlled inputs when form state needs to be validated or
    submitted.
-   Give every input a visible label or accessible name.
-   Validate on submit and, where helpful, provide inline feedback.
-   Preserve user input when validation fails.
-   Disable submit buttons while a submission is in progress.
-   Provide clear empty, loading, success, and error states.
-   Use confirmation dialogs for destructive or consequential demo
    actions.
-   Never rely on placeholder text as the only label.
-   Ensure keyboard navigation and visible focus styles work.

## 10. Component architecture

Build reusable components around consistent visual and behavioral
patterns.

Likely shared components include:

-   `AppShell`
-   `MobileHeader`
-   `BottomNavigation`
-   `DesktopSidebar`
-   `PageHeader`
-   `BalanceCard`
-   `TransactionItem`
-   `TransactionList`
-   `AmountInput`
-   `PrimaryButton`
-   `SecondaryButton`
-   `TextField`
-   `SearchField`
-   `StatusBadge`
-   `SavingsGoalCard`
-   `EmptyState`
-   `ConfirmDialog`
-   `Toast` or equivalent feedback component

Guidelines:

-   Keep components focused on one responsibility.
-   Separate reusable presentation from feature-specific business logic.
-   Avoid giant page components containing all UI and state logic.
-   Avoid premature abstraction: share a component when it genuinely has
    repeated behavior or styling.
-   Keep props explicit and typed.
-   Use composition rather than deeply nested boolean props.

## 11. Accessibility

-   Use semantic landmarks (`header`, `nav`, `main`, `section`,
    `footer`) appropriately.
-   Maintain logical heading order.
-   Associate form labels and validation messages with inputs.
-   Add accessible names to icon-only buttons.
-   Ensure interactive elements work with a keyboard.
-   Use visible focus indicators.
-   Announce important dynamic feedback accessibly where appropriate.
-   Respect reduced-motion preferences.
-   Do not communicate status using color alone.

## 12. Performance and maintainability

-   Avoid unnecessary client-side JavaScript.
-   Use Next.js image and font features where appropriate.
-   Keep large lists efficient; use pagination or virtualization only
    when needed.
-   Avoid unnecessary dependencies.
-   Avoid duplicating state that can be derived.
-   Keep formatting, validation, storage, and domain logic out of visual
    components.
-   Do not suppress TypeScript or lint errors just to make a build pass.
-   Remove dead code, unused imports, and temporary debugging logs
    before completion.

## 13. Testing and quality checks

Use the scripts already defined in `package.json`. At minimum, run the
available checks after implementation:

``` bash
npm run lint
npx tsc --noEmit
npm run build
```

If the repository uses another package manager, use its equivalent
commands.

Manually verify:

-   First visit loads sensible demo data.
-   Refresh preserves changes.
-   A new tab reflects storage changes where supported.
-   Invalid or corrupted stored JSON does not crash the app.
-   Reset clears the demo state and restores seed data.
-   No browser storage access occurs during server rendering.
-   Navigation and primary flows work on mobile and desktop.
-   Forms validate and show useful feedback.
-   No page has horizontal overflow at common mobile widths.
-   Keyboard focus and labels are usable.

Add tests for storage parsing, migrations, validation, and important
financial calculations when a test framework is available.

## 14. Definition of done

A feature is complete only when:

-   It matches the approved design direction.
-   It works at mobile and desktop sizes.
-   It uses TypeScript types without avoidable `any`.
-   It has accessible labels and interaction states.
-   Its state updates consistently across relevant screens.
-   Required non-sensitive demo data persists through `localStorage`.
-   It handles storage failures safely.
-   It does not store secrets or real payment credentials.
-   Relevant lint, type-check, and build commands pass.
-   Any assumptions, limitations, or incomplete work are clearly
    reported.

## 15. Instructions to the coding agent

Before implementing a task:

1.  Read this file and inspect the repository.
2.  Identify the affected routes, components, types, and state flows.
3.  Check the installed Next.js and Tailwind versions before using
    version-specific APIs.
4.  Reuse existing components and patterns where they are sound.
5.  Plan the smallest coherent implementation.

While implementing:

1.  Keep changes focused on the requested feature.
2.  Follow the mobile-first and accessibility rules.
3.  Route all persistence through the typed storage layer.
4.  Keep demo behavior clearly distinct from real financial services.
5.  Do not add dependencies without explaining why they are needed.

After implementing:

1.  Run the relevant checks.
2.  Review the changes for hydration issues and unsafe browser API
    access.
3.  Verify local persistence and reset behavior where relevant.
4.  Summarize what changed, what was tested, and any known limitations.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
