import { describe, it, expect } from 'vitest';
import { defineDataTable } from './types';

describe('defineDataTable', () => {
	it('should return the same object reference that was passed in', () => {
		const definition = {
			columns: [{ key: 'id' as const, label: 'ID' }],
			rows: [{ id: 1 }]
		};

		const result = defineDataTable(definition);

		expect(result).toBe(definition);
	});

	it('should return columns unchanged', () => {
		const columns = [
			{ key: 'id' as const, label: 'ID' },
			{ key: 'name' as const, label: 'Name', showFilter: true, showManageColumn: true }
		];

		const result = defineDataTable({ columns, rows: [] });

		expect(result.columns).toEqual(columns);
	});

	it('should return rows unchanged', () => {
		const rows = [
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' }
		];

		const result = defineDataTable({
			columns: [
				{ key: 'id' as const, label: 'ID' },
				{ key: 'name' as const, label: 'Name' }
			],
			rows
		});

		expect(result.rows).toEqual(rows);
	});

	it('should work with empty columns and rows', () => {
		const result = defineDataTable({ columns: [], rows: [] });

		expect(result).toEqual({ columns: [], rows: [] });
	});

	it('should work with optional column fields omitted', () => {
		const result = defineDataTable({
			columns: [{ key: 'id' as const, label: 'ID' }],
			rows: [{ id: 1 }]
		});

		expect(result.columns[0]).toEqual({ key: 'id', label: 'ID' });
	});

	it('should work with all optional column fields provided', () => {
		const result = defineDataTable({
			columns: [{ key: 'id' as const, label: 'ID', showFilter: true, showManageColumn: false }],
			rows: [{ id: 1 }]
		});

		expect(result.columns[0]).toEqual({
			key: 'id',
			label: 'ID',
			showFilter: true,
			showManageColumn: false
		});
	});
});
