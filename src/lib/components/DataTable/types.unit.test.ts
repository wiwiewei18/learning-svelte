import { describe, it, expect } from 'vitest';
import { defineDataTable } from './types';

describe('defineDataTable', () => {
	it('should return the same object reference when passed a valid definition', () => {
		const definition = {
			columns: [{ key: 'id' as const, label: 'ID' }],
			rows: [{ id: 1 }]
		};

		const result = defineDataTable(definition);

		expect(result).toBe(definition);
	});

	it('should return columns unchanged when passed a definition with columns', () => {
		const columns = [
			{ key: 'id' as const, label: 'ID' },
			{ key: 'name' as const, label: 'Name', showFilter: true, showManageColumn: true }
		];

		const result = defineDataTable({ columns, rows: [] });

		expect(result.columns).toEqual(columns);
	});

	it('should return rows unchanged when passed a definition with rows', () => {
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

	it('should work when passed empty columns and rows', () => {
		const result = defineDataTable({ columns: [], rows: [] });

		expect(result).toEqual({ columns: [], rows: [] });
	});

	it('should preserve the definition when optional column fields are omitted', () => {
		const result = defineDataTable({
			columns: [{ key: 'id' as const, label: 'ID' }],
			rows: [{ id: 1 }]
		});

		expect(result.columns[0]).toEqual({ key: 'id', label: 'ID' });
	});

	it('should preserve the definition when all optional column fields are provided', () => {
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
