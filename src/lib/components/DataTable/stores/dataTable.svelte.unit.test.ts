import { describe, it, expect, vi } from 'vitest';
import { BaseDataTableStore } from './dataTable.svelte';
import type { Column, Row } from '../types';

// Concrete implementation of the abstract BaseDataTableStore for testing purposes
class TestDataTableStore extends BaseDataTableStore {
	rows = $state<Row[]>([]);
	filteredRows = $derived(this.rows);
	onFiltersChangedSpy = vi.fn();

	init(columns: Column[], rows: Row[]) {
		this.columns = columns;
		this.rows = rows;
	}

	protected onFiltersChanged() {
		this.onFiltersChangedSpy();
	}
}

const COLUMNS: Column[] = [
	{ key: 'id', label: 'ID', showFilter: false, showManageColumn: false },
	{ key: 'name', label: 'Name', showFilter: true, showManageColumn: true },
	{ key: 'email', label: 'Email', showFilter: true, showManageColumn: true }
];

const ROWS: Row[] = [
	{ id: 1, name: 'Alice', email: 'alice@example.com' },
	{ id: 2, name: 'Bob', email: 'bob@example.com' }
];

describe('BaseDataTableStore', () => {
	describe('initial state', () => {
		it('should initialize with empty columns, filterValues, and columnVisibility', () => {
			const store = new TestDataTableStore();

			expect(store.columns).toEqual([]);
			expect(store.filterValues).toEqual({});
			expect(store.columnVisibility).toEqual({});
		});
	});

	describe('init', () => {
		it('should set columns and rows', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			expect(store.columns).toEqual(COLUMNS);
			expect(store.rows).toEqual(ROWS);
		});
	});

	describe('visibleColumns', () => {
		it('should return all columns when columnVisibility is empty', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			expect(store.visibleColumns).toEqual(COLUMNS);
		});

		it('should always include columns with showManageColumn: false', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleToggleColumn({ key: 'id', checked: false });

			// 'id' column has showManageColumn: false → always visible
			expect(store.visibleColumns.map((c) => c.key)).toContain('id');
		});

		it('should hide column when columnVisibility is set to false', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleToggleColumn({ key: 'name', checked: false });

			expect(store.visibleColumns.map((c) => c.key)).not.toContain('name');
		});

		it('should show column when columnVisibility is set to true', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleToggleColumn({ key: 'name', checked: false });
			store.handleToggleColumn({ key: 'name', checked: true });

			expect(store.visibleColumns.map((c) => c.key)).toContain('name');
		});
	});

	describe('shouldShowFilters', () => {
		it('should return true when at least one column has showFilter: true', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			expect(store.shouldShowFilters).toBe(true);
		});

		it('should return false when no column has showFilter: true', () => {
			const store = new TestDataTableStore();
			store.init(
				[
					{ key: 'id', label: 'ID', showFilter: false },
					{ key: 'name', label: 'Name', showFilter: false }
				],
				ROWS
			);

			expect(store.shouldShowFilters).toBe(false);
		});

		it('should return false when showFilter is not defined', () => {
			const store = new TestDataTableStore();
			store.init([{ key: 'id', label: 'ID' }], ROWS);

			expect(store.shouldShowFilters).toBe(false);
		});
	});

	describe('shouldShowManageColumns', () => {
		it('should return true when at least one column has showManageColumn: true', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			expect(store.shouldShowManageColumns).toBe(true);
		});

		it('should return false when all columns have showManageColumn: false', () => {
			const store = new TestDataTableStore();
			store.init(
				[
					{ key: 'id', label: 'ID', showManageColumn: false },
					{ key: 'name', label: 'Name', showManageColumn: false }
				],
				ROWS
			);

			expect(store.shouldShowManageColumns).toBe(false);
		});

		it('should return true when showManageColumn is not defined (defaults to true)', () => {
			const store = new TestDataTableStore();
			store.init([{ key: 'id', label: 'ID' }], ROWS);

			expect(store.shouldShowManageColumns).toBe(true);
		});
	});

	describe('handleFilterChange', () => {
		it('should update filterValues for the given key', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'Alice' });

			expect(store.filterValues['name']).toBe('Alice');
		});

		it('should not affect other filterValues when updating one key', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'Alice' });
			store.handleFilterChange({ key: 'email', value: 'alice@example.com' });

			expect(store.filterValues['name']).toBe('Alice');
			expect(store.filterValues['email']).toBe('alice@example.com');
		});

		it('should call onFiltersChanged after updating filter', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'Alice' });

			expect(store.onFiltersChangedSpy).toHaveBeenCalledOnce();
		});
	});

	describe('handleResetFilters', () => {
		it('should reset all filterValues to empty string', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleFilterChange({ key: 'name', value: 'Alice' });
			store.handleFilterChange({ key: 'email', value: 'alice@example.com' });
			store.handleResetFilters();

			expect(store.filterValues).toEqual({ id: '', name: '', email: '' });
		});

		it('should reset to keys matching current columns only', () => {
			const store = new TestDataTableStore();
			store.init([{ key: 'name', label: 'Name' }], ROWS);

			store.handleResetFilters();

			expect(Object.keys(store.filterValues)).toEqual(['name']);
		});

		it('should call onFiltersChanged after reset', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleResetFilters();

			expect(store.onFiltersChangedSpy).toHaveBeenCalledOnce();
		});
	});

	describe('handleToggleColumn', () => {
		it('should set column visibility to false', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleToggleColumn({ key: 'name', checked: false });

			expect(store.columnVisibility['name']).toBe(false);
		});

		it('should set column visibility to true', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleToggleColumn({ key: 'name', checked: false });
			store.handleToggleColumn({ key: 'name', checked: true });

			expect(store.columnVisibility['name']).toBe(true);
		});

		it('should not affect other column visibility', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleToggleColumn({ key: 'name', checked: false });

			expect(store.columnVisibility['email']).toBeUndefined();
		});
	});

	describe('handleToggleAllColumns', () => {
		it('should set all given keys to false', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleToggleAllColumns({ checked: false, keys: ['name', 'email'] });

			expect(store.columnVisibility['name']).toBe(false);
			expect(store.columnVisibility['email']).toBe(false);
		});

		it('should set all given keys to true', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleToggleAllColumns({ checked: false, keys: ['name', 'email'] });
			store.handleToggleAllColumns({ checked: true, keys: ['name', 'email'] });

			expect(store.columnVisibility['name']).toBe(true);
			expect(store.columnVisibility['email']).toBe(true);
		});

		it('should not affect keys not included in the payload', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			store.handleToggleAllColumns({ checked: false, keys: ['name'] });

			expect(store.columnVisibility['email']).toBeUndefined();
		});

		it('should handle an empty keys array without error', () => {
			const store = new TestDataTableStore();
			store.init(COLUMNS, ROWS);

			expect(() => store.handleToggleAllColumns({ checked: false, keys: [] })).not.toThrow();
		});
	});
});
