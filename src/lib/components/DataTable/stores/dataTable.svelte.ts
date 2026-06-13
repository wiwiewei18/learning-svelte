import type { Column, Row } from '../types';

class DataTableStore {
	columns = $state<Column[]>([]);
	rows = $state<Row[]>([]);
	filterValues = $state<Record<string, string>>({});
	columnVisibility = $state<Record<string, boolean>>({});

	visibleColumns = $derived(
		this.columns.filter(
			(column) => column.showManageColumn === false || (this.columnVisibility[column.key] ?? true)
		)
	);

	shouldShowFilters = $derived(this.columns.some((column) => column.showFilter));

	shouldShowManageColumns = $derived(
		this.columns.some((column) => (column.showManageColumn ?? true) === true)
	);

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

	init(columns: Column[], rows: Row[]) {
		this.columns = columns;
		this.rows = rows;
	}

	handleFilterChange({ key, value }: { key: string; value: string }) {
		this.filterValues = {
			...this.filterValues,
			[key]: value
		};
	}

	handleResetFilters() {
		const clearedFilters: Record<string, string> = {};
		for (const column of this.columns) {
			clearedFilters[column.key] = '';
		}
		this.filterValues = clearedFilters;
	}

	handleToggleColumn({ key, checked }: { key: string; checked: boolean }) {
		this.columnVisibility = {
			...this.columnVisibility,
			[key]: checked
		};
	}

	handleToggleAllColumns({ checked, keys }: { checked: boolean; keys: string[] }) {
		const nextVisibility = { ...this.columnVisibility };
		for (const key of keys) {
			nextVisibility[key] = checked;
		}
		this.columnVisibility = nextVisibility;
	}
}

export const dataTableStore = new DataTableStore();
