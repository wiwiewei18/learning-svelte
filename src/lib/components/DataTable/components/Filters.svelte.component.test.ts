import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import DataTable from './DataTable.svelte';
import { ClientSideDataTableStore } from '../stores/clientSideDataTable.svelte';
import type { Column, Row } from '../types';

// Filters.svelte uses context, so it must be rendered via DataTable.

const ROWS: Row[] = [
	{ name: 'Alice', email: 'alice@example.com' },
	{ name: 'Bob', email: 'bob@example.com' }
];

const FILTERABLE_COLUMNS: Column[] = [
	{ key: 'name', label: 'Name', showFilter: true },
	{ key: 'email', label: 'Email', showFilter: true }
];

const MIXED_COLUMNS: Column[] = [
	{ key: 'name', label: 'Name', showFilter: true },
	{ key: 'email', label: 'Email' }
];

function createStore(columns: Column[], rows: Row[] = ROWS) {
	const store = new ClientSideDataTableStore();
	store.init(columns, rows);
	return store;
}

describe('Filters', () => {
	describe('filter inputs', () => {
		it('should render a filter input for each column when showFilter is enabled', async () => {
			const screen = render(DataTable, { props: { store: createStore(FILTERABLE_COLUMNS) } });

			await expect.element(screen.getByPlaceholder('Filter by Name')).toBeVisible();
			await expect.element(screen.getByPlaceholder('Filter by Email')).toBeVisible();
		});

		it('should not render a filter input for a column when showFilter is not enabled', async () => {
			const screen = render(DataTable, { props: { store: createStore(MIXED_COLUMNS) } });

			await expect.element(screen.getByPlaceholder('Filter by Name')).toBeVisible();
			expect((await screen.getByPlaceholder('Filter by Email').elements()).length).toBe(0);
		});

		it('should show "No filterable columns." when no column has showFilter enabled', async () => {
			// Simulate edge case: shouldShowFilters logic bypassed by injecting a store that
			// reports shouldShowFilters=true but columns have no showFilter set.
			const store = createStore([{ key: 'name', label: 'Name' }]);
			// Override shouldShowFilters so DataTable renders Filters even without showFilter columns.
			Object.defineProperty(store, 'shouldShowFilters', { get: () => true });

			const screen = render(DataTable, { props: { store } });

			await expect.element(screen.getByText('No filterable columns.')).toBeVisible();
		});
	});

	describe('reset filters button', () => {
		it('should show the Reset Filters button when there are filterable columns', async () => {
			const screen = render(DataTable, { props: { store: createStore(FILTERABLE_COLUMNS) } });

			await expect.element(screen.getByRole('button', { name: 'Reset Filters' })).toBeVisible();
		});
	});

	describe('filtering behavior', () => {
		it('should filter rows when a value is typed into a filter input', async () => {
			const screen = render(DataTable, { props: { store: createStore(FILTERABLE_COLUMNS) } });

			await screen.getByPlaceholder('Filter by Name').fill('Alice');

			await expect.element(screen.getByRole('cell', { name: 'Alice', exact: true })).toBeVisible();
			expect((await screen.getByRole('cell', { name: 'Bob', exact: true }).elements()).length).toBe(
				0
			);
		});

		it('should restore all rows when Reset Filters is clicked after filtering', async () => {
			const screen = render(DataTable, { props: { store: createStore(FILTERABLE_COLUMNS) } });

			await screen.getByPlaceholder('Filter by Name').fill('Alice');
			await screen.getByRole('button', { name: 'Reset Filters' }).click();

			await expect.element(screen.getByRole('cell', { name: 'Alice', exact: true })).toBeVisible();
			await expect.element(screen.getByRole('cell', { name: 'Bob', exact: true })).toBeVisible();
		});

		it('should show "No data available." when the filter matches no rows', async () => {
			const screen = render(DataTable, { props: { store: createStore(FILTERABLE_COLUMNS) } });

			await screen.getByPlaceholder('Filter by Name').fill('Charlie');

			await expect.element(screen.getByText('No data available.')).toBeVisible();
		});
	});
});
