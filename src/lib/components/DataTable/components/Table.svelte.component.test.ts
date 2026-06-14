import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import Table from './Table.svelte';
import type { Column, Row } from '../types';

const COLUMNS: Column[] = [
	{ key: 'name', label: 'Name' },
	{ key: 'email', label: 'Email' }
];

const ROWS: Row[] = [
	{ name: 'Alice', email: 'alice@example.com' },
	{ name: 'Bob', email: 'bob@example.com' }
];

describe('Table', () => {
	it('should render column labels in the header when columns are provided', async () => {
		const screen = render(Table, { props: { columns: COLUMNS, rows: ROWS } });

		const table = screen.getByRole('table').element() as HTMLTableElement;
		const headerCells = Array.from(table.tHead?.rows[0]?.cells ?? []);
		expect(headerCells[1]?.textContent?.trim()).toBe('Name');
		expect(headerCells[2]?.textContent?.trim()).toBe('Email');
	});

	it('should render column labels in the footer when columns are provided', async () => {
		const screen = render(Table, { props: { columns: COLUMNS, rows: ROWS } });

		const table = screen.getByRole('table').element() as HTMLTableElement;
		const footerCells = Array.from(table.tFoot?.rows[0]?.cells ?? []);
		expect(footerCells[1]?.textContent?.trim()).toBe('Name');
		expect(footerCells[2]?.textContent?.trim()).toBe('Email');
	});

	it('should render only the index column header when columns is empty', async () => {
		const screen = render(Table, { props: { columns: [], rows: ROWS } });

		const table = screen.getByRole('table').element() as HTMLTableElement;
		expect(table.tHead?.rows[0]?.cells.length).toBe(1);
	});

	it('should render all rows with correct cell values when rows are provided', async () => {
		const screen = render(Table, { props: { columns: COLUMNS, rows: ROWS } });

		await expect.element(screen.getByRole('cell', { name: 'Alice', exact: true })).toBeVisible();
		await expect
			.element(screen.getByRole('cell', { name: 'alice@example.com', exact: true }))
			.toBeVisible();
		await expect.element(screen.getByRole('cell', { name: 'Bob', exact: true })).toBeVisible();
		await expect
			.element(screen.getByRole('cell', { name: 'bob@example.com', exact: true }))
			.toBeVisible();
	});

	it('should render row numbers starting from 1 when rows are provided', async () => {
		const screen = render(Table, { props: { columns: COLUMNS, rows: ROWS } });

		const table = screen.getByRole('table').element() as HTMLTableElement;
		const bodyRows = Array.from(table.tBodies[0]?.rows ?? []);
		expect(bodyRows[0]?.cells[0]?.textContent?.trim()).toBe('1');
		expect(bodyRows[1]?.cells[0]?.textContent?.trim()).toBe('2');
	});

	it('should show "No data available." when rows is empty', async () => {
		const screen = render(Table, { props: { columns: COLUMNS, rows: [] } });

		await expect.element(screen.getByText('No data available.')).toBeVisible();
	});

	it('should render only one body row when rows is empty', async () => {
		const screen = render(Table, { props: { columns: COLUMNS, rows: [] } });

		const table = screen.getByRole('table').element() as HTMLTableElement;
		expect(table.tBodies[0]?.rows.length).toBe(1);
	});

	it('should display "-" when a cell value is null', async () => {
		const rows: Row[] = [{ name: null, email: 'test@example.com' }];
		const screen = render(Table, { props: { columns: COLUMNS, rows } });

		await expect.element(screen.getByRole('cell', { name: '-', exact: true })).toBeVisible();
	});

	it('should display "-" when a cell value is undefined', async () => {
		const rows: Row[] = [{ email: 'test@example.com' }];
		const screen = render(Table, { props: { columns: COLUMNS, rows } });

		await expect.element(screen.getByRole('cell', { name: '-', exact: true })).toBeVisible();
	});

	it('should render an empty table when no props are provided', async () => {
		const screen = render(Table);

		await expect.element(screen.getByRole('table')).toBeVisible();
		await expect.element(screen.getByText('No data available.')).toBeVisible();
	});
});
