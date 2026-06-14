import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import DataTable from './DataTable.svelte';
import { ClientSideDataTableStore } from '../stores/clientSideDataTable.svelte';
import type { Column, Row } from '../types';

// ManageColumns.svelte uses context, so it must be rendered via DataTable.

const ROWS: Row[] = [
	{ name: 'Alice', email: 'alice@example.com' },
	{ name: 'Bob', email: 'bob@example.com' }
];

const MANAGEABLE_COLUMNS: Column[] = [
	{ key: 'name', label: 'Name', showManageColumn: true },
	{ key: 'email', label: 'Email', showManageColumn: true }
];

function createStore(columns: Column[], rows: Row[] = ROWS) {
	const store = new ClientSideDataTableStore();
	store.init(columns, rows);
	return store;
}

describe('ManageColumns', () => {
	describe('column checkboxes', () => {
		it('should render a checkbox for each column when showManageColumn is enabled', async () => {
			const screen = render(DataTable, { props: { store: createStore(MANAGEABLE_COLUMNS) } });

			await expect.element(screen.getByRole('checkbox', { name: 'Name' })).toBeVisible();
			await expect.element(screen.getByRole('checkbox', { name: 'Email' })).toBeVisible();
		});

		it('should not render a checkbox for a column when showManageColumn is false', async () => {
			const columns: Column[] = [
				{ key: 'name', label: 'Name', showManageColumn: true },
				{ key: 'email', label: 'Email', showManageColumn: false }
			];
			const screen = render(DataTable, { props: { store: createStore(columns) } });

			await expect.element(screen.getByRole('checkbox', { name: 'Name' })).toBeVisible();
			expect((await screen.getByRole('checkbox', { name: 'Email' }).elements()).length).toBe(0);
		});

		it('should show "No manageable columns." when no column is manageable', async () => {
			// Edge case: override shouldShowManageColumns so DataTable renders ManageColumns
			// even though all columns have showManageColumn: false.
			const store = createStore([{ key: 'name', label: 'Name', showManageColumn: false }]);
			Object.defineProperty(store, 'shouldShowManageColumns', { get: () => true });

			const screen = render(DataTable, { props: { store } });

			await expect.element(screen.getByText('No manageable columns.')).toBeVisible();
		});
	});

	describe('select all checkbox', () => {
		it('should be checked when all columns are visible', async () => {
			const screen = render(DataTable, { props: { store: createStore(MANAGEABLE_COLUMNS) } });

			const selectAll = screen.getByRole('checkbox', { name: 'Select All' });
			await expect.element(selectAll).toBeChecked();
		});

		it('should be unchecked when at least one column is hidden', async () => {
			const store = createStore(MANAGEABLE_COLUMNS);
			store.handleToggleColumn({ key: 'name', checked: false });

			const screen = render(DataTable, { props: { store } });

			const selectAll = screen.getByRole('checkbox', { name: 'Select All' });
			await expect.element(selectAll).not.toBeChecked();
		});
	});

	describe('search', () => {
		it('should show only matching columns when a search term is typed', async () => {
			const screen = render(DataTable, { props: { store: createStore(MANAGEABLE_COLUMNS) } });

			await screen.getByPlaceholder('Search columns').fill('Name');

			await expect.element(screen.getByRole('checkbox', { name: 'Name' })).toBeVisible();
			expect((await screen.getByRole('checkbox', { name: 'Email' }).elements()).length).toBe(0);
		});

		it('should show "No manageable columns." when the search matches no columns', async () => {
			const screen = render(DataTable, { props: { store: createStore(MANAGEABLE_COLUMNS) } });

			await screen.getByPlaceholder('Search columns').fill('Age');

			await expect.element(screen.getByText('No manageable columns.')).toBeVisible();
		});
	});

	describe('toggle column visibility', () => {
		it('should hide a column from the table when its checkbox is unchecked', async () => {
			const screen = render(DataTable, { props: { store: createStore(MANAGEABLE_COLUMNS) } });

			await screen.getByRole('checkbox', { name: 'Name' }).click();

			const table = screen.getByRole('table').element() as HTMLTableElement;
			const headers = Array.from(table.tHead?.rows[0]?.cells ?? []).map((c) => c.textContent);
			expect(headers).not.toContain('Name');
			expect(headers).toContain('Email');
		});

		it('should show a column in the table when its checkbox is rechecked after being unchecked', async () => {
			const screen = render(DataTable, { props: { store: createStore(MANAGEABLE_COLUMNS) } });

			await screen.getByRole('checkbox', { name: 'Name' }).click();
			await screen.getByRole('checkbox', { name: 'Name' }).click();

			const table = screen.getByRole('table').element() as HTMLTableElement;
			const headers = Array.from(table.tHead?.rows[0]?.cells ?? []).map((c) => c.textContent);
			expect(headers).toContain('Name');
		});

		it('should hide all columns from the table when Select All is unchecked', async () => {
			const screen = render(DataTable, { props: { store: createStore(MANAGEABLE_COLUMNS) } });

			await screen.getByRole('checkbox', { name: 'Select All' }).click();

			const table = screen.getByRole('table').element() as HTMLTableElement;
			const headers = Array.from(table.tHead?.rows[0]?.cells ?? []).map((c) => c.textContent);
			expect(headers).not.toContain('Name');
			expect(headers).not.toContain('Email');
		});

		it('should show all columns in the table when Select All is checked after being unchecked', async () => {
			const store = createStore(MANAGEABLE_COLUMNS);
			store.handleToggleAllColumns({ checked: false, keys: ['name', 'email'] });

			const screen = render(DataTable, { props: { store } });

			await screen.getByRole('checkbox', { name: 'Select All' }).click();

			const table = screen.getByRole('table').element() as HTMLTableElement;
			const headers = Array.from(table.tHead?.rows[0]?.cells ?? []).map((c) => c.textContent);
			expect(headers).toContain('Name');
			expect(headers).toContain('Email');
		});
	});
});
