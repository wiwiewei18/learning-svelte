import { describe, it, expect } from 'vitest';
import { ClientSideDataTableStore } from './clientSideDataTable.svelte';
import type { Column, Row } from '../types';

const COLUMNS: Column[] = [
	{ key: 'id', label: 'ID', showFilter: false, showManageColumn: false },
	{ key: 'name', label: 'Name', showFilter: true, showManageColumn: true },
	{ key: 'email', label: 'Email', showFilter: true, showManageColumn: true }
];

const ROWS: Row[] = [
	{ id: 1, name: 'Alice', email: 'alice@example.com' },
	{ id: 2, name: 'Bob', email: 'bob@example.com' },
	{ id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

describe('ClientSideDataTableStore', () => {
	describe('init', () => {
		it('should set columns and rows when init is called', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			expect(store.columns).toEqual(COLUMNS);
			expect(store.rows).toEqual(ROWS);
		});

		it('should initialize with empty rows when init has not been called', () => {
			const store = new ClientSideDataTableStore();

			expect(store.rows).toEqual([]);
		});
	});

	describe('filteredRows — no active filter', () => {
		it('should return all rows when no filter is set', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			expect(store.filteredRows).toEqual(ROWS);
		});

		it('should return all rows when filter value is empty string', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: '' });

			expect(store.filteredRows).toEqual(ROWS);
		});

		it('should return all rows when filter value is whitespace only', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: '   ' });

			expect(store.filteredRows).toEqual(ROWS);
		});
	});

	describe('filteredRows — single column filter', () => {
		it('should return only matching rows when filter value is set', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'Alice' });

			expect(store.filteredRows).toEqual([{ id: 1, name: 'Alice', email: 'alice@example.com' }]);
		});

		it('should match rows case-insensitively when filter value differs in case', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'alice' });

			expect(store.filteredRows).toEqual([{ id: 1, name: 'Alice', email: 'alice@example.com' }]);
		});

		it('should return rows containing the filter value as a substring', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'li' });

			// 'Alice' contains 'li', 'Charlie' contains 'li'
			expect(store.filteredRows).toEqual([
				{ id: 1, name: 'Alice', email: 'alice@example.com' },
				{ id: 3, name: 'Charlie', email: 'charlie@example.com' }
			]);
		});

		it('should trim whitespace from filter value before matching', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: '  Bob  ' });

			expect(store.filteredRows).toEqual([{ id: 2, name: 'Bob', email: 'bob@example.com' }]);
		});

		it('should return empty array when no rows match the filter value', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'Nonexistent' });

			expect(store.filteredRows).toEqual([]);
		});
	});

	describe('filteredRows — column with showFilter: false', () => {
		it('should not filter rows when the column has showFilter: false', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			// 'id' column has showFilter: false
			store.handleFilterChange({ key: 'id', value: '1' });

			expect(store.filteredRows).toEqual(ROWS);
		});
	});

	describe('filteredRows — multi-column filter (AND logic)', () => {
		it('should return rows matching all active filters simultaneously', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'alice' });
			store.handleFilterChange({ key: 'email', value: 'alice@example.com' });

			expect(store.filteredRows).toEqual([{ id: 1, name: 'Alice', email: 'alice@example.com' }]);
		});

		it('should return empty array when filters on multiple columns have no common match', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'Alice' });
			store.handleFilterChange({ key: 'email', value: 'bob@example.com' });

			expect(store.filteredRows).toEqual([]);
		});
	});

	describe('filteredRows — after handleResetFilters', () => {
		it('should return all rows when filters are reset', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'Alice' });
			store.handleResetFilters();

			expect(store.filteredRows).toEqual(ROWS);
		});
	});

	describe('filteredRows — null and undefined cell values', () => {
		it('should not throw and treat null cell value as empty string when filtering', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, [{ id: 1, name: null, email: 'test@example.com' }]);

			store.handleFilterChange({ key: 'name', value: 'alice' });

			expect(store.filteredRows).toEqual([]);
		});

		it('should not throw and treat undefined cell value as empty string when filtering', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, [{ id: 1, email: 'test@example.com' }]);

			store.handleFilterChange({ key: 'name', value: 'alice' });

			expect(store.filteredRows).toEqual([]);
		});
	});

	describe('filteredRows — empty dataset', () => {
		it('should return empty array when rows is empty', () => {
			const store = new ClientSideDataTableStore();
			store.init(COLUMNS, []);

			store.handleFilterChange({ key: 'name', value: 'Alice' });

			expect(store.filteredRows).toEqual([]);
		});
	});
});
