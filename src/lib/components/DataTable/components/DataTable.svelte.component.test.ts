import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import DataTable from './DataTable.svelte';
import { ClientSideDataTableStore } from '../stores/clientSideDataTable.svelte';
import type { Column, Row } from '../types';

const COLUMNS: Column[] = [
	{ key: 'name', label: 'Name' },
	{ key: 'email', label: 'Email' }
];

const ROWS: Row[] = [
	{ name: 'Alice', email: 'alice@example.com' },
	{ name: 'Bob', email: 'bob@example.com' }
];

function createStore(columns: Column[] = COLUMNS, rows: Row[] = ROWS) {
	const store = new ClientSideDataTableStore();
	store.init(columns, rows);
	return store;
}

describe('DataTable', () => {
	describe('title', () => {
		it('should render "Data Table" as the default title when no title is provided', async () => {
			const screen = render(DataTable, { props: { store: createStore() } });

			await expect.element(screen.getByRole('heading', { name: 'Data Table' })).toBeVisible();
		});

		it('should render the given title when title prop is provided', async () => {
			const screen = render(DataTable, {
				props: { title: 'Users', store: createStore() }
			});

			await expect.element(screen.getByRole('heading', { name: 'Users' })).toBeVisible();
		});
	});

	describe('filters button', () => {
		it('should show the Filters button when at least one column has showFilter enabled', async () => {
			const columns: Column[] = [
				{ key: 'name', label: 'Name', showFilter: true },
				{ key: 'email', label: 'Email' }
			];
			const screen = render(DataTable, { props: { store: createStore(columns) } });

			await expect
				.element(screen.getByRole('button', { name: 'Filters', exact: true }))
				.toBeVisible();
		});

		it('should not show the Filters button when no column has showFilter enabled', async () => {
			const screen = render(DataTable, { props: { store: createStore() } });

			expect(
				(await screen.getByRole('button', { name: 'Filters', exact: true }).elements()).length
			).toBe(0);
		});
	});

	describe('manage columns button', () => {
		it('should show the Manage Columns button when at least one column has showManageColumn enabled', async () => {
			const columns: Column[] = [
				{ key: 'name', label: 'Name', showManageColumn: true },
				{ key: 'email', label: 'Email' }
			];
			const screen = render(DataTable, { props: { store: createStore(columns) } });

			await expect.element(screen.getByRole('button', { name: /manage columns/i })).toBeVisible();
		});

		it('should not show the Manage Columns button when all columns have showManageColumn disabled', async () => {
			const columns: Column[] = [
				{ key: 'name', label: 'Name', showManageColumn: false },
				{ key: 'email', label: 'Email', showManageColumn: false }
			];
			const screen = render(DataTable, { props: { store: createStore(columns) } });

			expect(
				(await screen.getByRole('button', { name: /manage columns/i }).elements()).length
			).toBe(0);
		});
	});

	describe('table data', () => {
		it('should render all row data when store is initialized with rows', async () => {
			const screen = render(DataTable, { props: { store: createStore() } });

			await expect.element(screen.getByRole('cell', { name: 'Alice', exact: true })).toBeVisible();
			await expect
				.element(screen.getByRole('cell', { name: 'alice@example.com', exact: true }))
				.toBeVisible();
			await expect.element(screen.getByRole('cell', { name: 'Bob', exact: true })).toBeVisible();
			await expect
				.element(screen.getByRole('cell', { name: 'bob@example.com', exact: true }))
				.toBeVisible();
		});

		it('should show "No data available." when store is initialized with empty rows', async () => {
			const screen = render(DataTable, { props: { store: createStore(COLUMNS, []) } });

			await expect.element(screen.getByText('No data available.')).toBeVisible();
		});
	});
});
