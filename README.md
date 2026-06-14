# Learning Svelte

This repository is my personal learning notes on **Svelte**, **SvelteKit**, and frontend development concepts that I explore through hands-on implementation.

---

## What I've Learned

### 1. Reusable Component — DataTable

Building a generic, reusable `DataTable` component that can be used across different contexts. The component supports:

- Displaying data in a table
- Per-column filtering
- Column visibility management (show/hide columns)

**Implementation:**

- Main component: [`src/lib/components/DataTable/`](./src/lib/components/DataTable/)
- Entry point & public API: [`src/lib/components/DataTable/index.ts`](./src/lib/components/DataTable/index.ts)
- Column & row type definitions: [`src/lib/components/DataTable/types.ts`](./src/lib/components/DataTable/types.ts)
- Usage example: [`src/routes/+page.svelte`](./src/routes/+page.svelte)

---

### 2. Dependency Injection — Switching Between Client-side & Server-side DataTable

Using the **dependency injection** pattern via Svelte's Context API to decouple data logic from the UI. A store is injected into the component, making it easy to swap between a client-side and a server-side implementation without touching the UI components.

**Implementation:**

- Context provider: [`src/lib/components/DataTable/context.ts`](./src/lib/components/DataTable/context.ts)
- Client-side store: [`src/lib/components/DataTable/stores/clientSideDataTable.svelte.ts`](./src/lib/components/DataTable/stores/clientSideDataTable.svelte.ts)
- Base store interface: [`src/lib/components/DataTable/stores/dataTable.svelte.ts`](./src/lib/components/DataTable/stores/dataTable.svelte.ts)

---

### 3. UAT-based E2E Testing with Playwright + BDD

Writing end-to-end tests using the **BDD (Behavior-Driven Development)** approach with **Gherkin** syntax (`Given / When / Then`). Each scenario is written from the user's perspective as a _user story_, aligning with **User Acceptance Testing (UAT)**.

Libraries used: [Playwright](https://playwright.dev/) + [playwright-bdd](https://github.com/vitalets/playwright-bdd)

**Implementation:**

- View user list scenarios: [`tests/e2e/viewUserList.feature`](./tests/e2e/viewUserList.feature)
- Filter user list scenarios: [`tests/e2e/filterUserList.feature`](./tests/e2e/filterUserList.feature)
- Manage column visibility scenarios: [`tests/e2e/manageColumnVisibility.feature`](./tests/e2e/manageColumnVisibility.feature)
- Shared step definitions: [`tests/e2e/shared.e2e.test.ts`](./tests/e2e/shared.e2e.test.ts)

---

### 4. Unit Testing with Vitest

Writing unit tests for stores, utility functions, and context helpers using **Vitest** with a multi-project setup to handle different environments:

- **`unit` project** — runs in a real **Chromium browser** (via `@vitest/browser-playwright`) for files that use Svelte runes (`$state`, `$derived`). Pattern: `*.svelte.unit.test.ts`
- **`server` project** — runs in **Node.js** for pure TypeScript files that don't require a browser. Pattern: `*.unit.test.ts`

Each test file is **co-located** next to the source file it tests.

**Implementation:**

- Base store tests: [`src/lib/components/DataTable/stores/dataTable.svelte.unit.test.ts`](./src/lib/components/DataTable/stores/dataTable.svelte.unit.test.ts)
- Client-side store tests: [`src/lib/components/DataTable/stores/clientSideDataTable.svelte.unit.test.ts`](./src/lib/components/DataTable/stores/clientSideDataTable.svelte.unit.test.ts)
- Context helper tests: [`src/lib/components/DataTable/context.svelte.unit.test.ts`](./src/lib/components/DataTable/context.svelte.unit.test.ts)
- Type helper tests: [`src/lib/components/DataTable/types.unit.test.ts`](./src/lib/components/DataTable/types.unit.test.ts)

---

## Getting Started

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

## Testing

Run unit tests:

```sh
npm run test:unit
```

Run unit tests in watch mode:

```sh
npm run test:unit:dev
```

Run e2e tests:

```sh
npm run test:e2e
```

View the test report:

```sh
npm run test:e2e:report
```
