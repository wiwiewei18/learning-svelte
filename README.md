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

### 3. Unit Testing with Vitest

Writing unit tests for stores, utility functions, and context helpers using **Vitest** with a multi-project setup to handle different environments:

- **`unit` project** — runs in a real **Chromium browser** (via `@vitest/browser-playwright`) for files that use Svelte runes (`$state`, `$derived`). Pattern: `*.svelte.unit.test.ts`
- **`node` project** — runs in **Node.js** for pure TypeScript files that don't require a browser. Pattern: `*.unit.test.ts`

Each test file is **co-located** next to the source file it tests.

**Implementation:**

- Base store tests: [`src/lib/components/DataTable/stores/dataTable.svelte.unit.test.ts`](./src/lib/components/DataTable/stores/dataTable.svelte.unit.test.ts)
- Client-side store tests: [`src/lib/components/DataTable/stores/clientSideDataTable.svelte.unit.test.ts`](./src/lib/components/DataTable/stores/clientSideDataTable.svelte.unit.test.ts)
- Context helper tests: [`src/lib/components/DataTable/context.svelte.unit.test.ts`](./src/lib/components/DataTable/context.svelte.unit.test.ts)
- Type helper tests: [`src/lib/components/DataTable/types.unit.test.ts`](./src/lib/components/DataTable/types.unit.test.ts)

---

### 4. Component Testing with Vitest Browser

Writing **component tests** that render Svelte components in a real **Chromium browser** using [vitest-browser-svelte](https://github.com/vitest-dev/vitest-browser-svelte). These tests sit between unit tests and E2E tests: they verify that components render correctly and respond to user interactions, without requiring a running dev server.

Because child components like `Filters` and `ManageColumns` rely on Svelte's Context API (set up by `DataTable`), they are tested by rendering the full `DataTable` as the host — making these tests closer to **integration tests** in practice.

Libraries used: [Vitest](https://vitest.dev/) + [@vitest/browser](https://vitest.dev/guide/browser/) + [vitest-browser-svelte](https://github.com/vitest-dev/vitest-browser-svelte)

- **`component` project** — runs in a real **Chromium browser**. Pattern: `*.svelte.component.test.ts`

**Implementation:**

- `Table` component tests: [`src/lib/components/DataTable/components/Table.svelte.component.test.ts`](./src/lib/components/DataTable/components/Table.svelte.component.test.ts)
- `DataTable` component tests: [`src/lib/components/DataTable/components/DataTable.svelte.component.test.ts`](./src/lib/components/DataTable/components/DataTable.svelte.component.test.ts)
- `Filters` component tests: [`src/lib/components/DataTable/components/Filters.svelte.component.test.ts`](./src/lib/components/DataTable/components/Filters.svelte.component.test.ts)
- `ManageColumns` component tests: [`src/lib/components/DataTable/components/ManageColumns.svelte.component.test.ts`](./src/lib/components/DataTable/components/ManageColumns.svelte.component.test.ts)

---

### 5. UAT-based E2E Testing with Playwright + BDD

Writing end-to-end tests using the **BDD (Behavior-Driven Development)** approach with **Gherkin** syntax (`Given / When / Then`). Each scenario is written from the user's perspective as a _user story_, aligning with **User Acceptance Testing (UAT)**.

Libraries used: [Playwright](https://playwright.dev/) + [playwright-bdd](https://github.com/vitalets/playwright-bdd)

**Implementation:**

- View user list scenarios: [`tests/e2e/viewUserList.feature`](./tests/e2e/viewUserList.feature)
- Filter user list scenarios: [`tests/e2e/filterUserList.feature`](./tests/e2e/filterUserList.feature)
- Manage column visibility scenarios: [`tests/e2e/manageColumnVisibility.feature`](./tests/e2e/manageColumnVisibility.feature)
- Shared step definitions: [`tests/e2e/shared.e2e.test.ts`](./tests/e2e/shared.e2e.test.ts)

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

Run component tests:

```sh
npm run test:component
```

Run component tests in watch mode:

```sh
npm run test:component:dev
```

Run e2e tests:

```sh
npm run test:e2e
```

View the test report:

```sh
npm run test:e2e:report
```
