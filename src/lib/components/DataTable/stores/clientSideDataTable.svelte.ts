import type { Column, Row } from '../types';
import { BaseDataTableStore } from './dataTable.svelte';

/**
 * Client-side DataTable store.
 *
 * Filters rows entirely on the client using Svelte's `$derived`.
 * Use this when all row data is available upfront.
 *
 * @example
 * ```ts
 * const store = new ClientSideDataTableStore();
 * store.init(columns, rows);
 * ```
 */
export class ClientSideDataTableStore extends BaseDataTableStore {
	rows = $state<Row[]>([]);

	/** Rows filtered client-side based on current `filterValues`. */
	filteredRows = $derived(
		this.rows.filter((row) =>
			this.columns.every((column) => {
				const rawFilterValue = this.filterValues[column.key];
				const filterValue = rawFilterValue?.trim().toLowerCase();

				if (!filterValue || !column.showFilter) {
					return true;
				}

				const cellValue = String(row[column.key] ?? '').toLowerCase();
				return cellValue.includes(filterValue);
			})
		)
	);

	/**
	 * Initializes the store with column definitions and all row data.
	 * @param columns - Column definitions.
	 * @param rows - Full dataset to filter client-side.
	 */
	init(columns: Column[], rows: Row[]) {
		this.columns = columns;
		this.rows = rows;
	}

	/**
	 * No-op — filtering is handled reactively via `$derived`.
	 * @override
	 */
	protected onFiltersChanged() {}
}
