import type { Column, Row } from '../types';

/**
 * Contract for the DataTable store.
 *
 * Used for dependency injection into DataTable components.
 * Implement this interface to create different store strategies
 * (e.g. `InMemoryDataTableStore`, `ServerSideDataTableStore`).
 */
export interface IDataTableStore {
	/** Column definitions for the table. */
	readonly columns: Column[];
	/** All rows managed by this store. */
	readonly rows: Row[];
	/** Current filter value per column key. */
	readonly filterValues: Record<string, string>;
	/** Visibility state per column key. `true` = visible, `false` = hidden. */
	readonly columnVisibility: Record<string, boolean>;

	/** Columns currently visible, derived from `columns` and `columnVisibility`. */
	readonly visibleColumns: Column[];
	/** Rows after filtering has been applied. */
	readonly filteredRows: Row[];
	/** Whether any column has `showFilter: true`. */
	readonly shouldShowFilters: boolean;
	/** Whether any column has `showManageColumn` enabled. */
	readonly shouldShowManageColumns: boolean;

	/**
	 * Initialises the store with column definitions and row data.
	 * @param columns - Column definitions.
	 * @param rows - Row data.
	 */
	init(columns: Column[], rows: Row[]): void;
	/**
	 * Updates the filter value for a single column.
	 * @param payload.key - Column key to filter on.
	 * @param payload.value - Filter string value.
	 */
	handleFilterChange(payload: { key: string; value: string }): void;
	/** Clears all active filter values. */
	handleResetFilters(): void;
	/**
	 * Toggles visibility for a single column.
	 * @param payload.key - Column key.
	 * @param payload.checked - `true` to show, `false` to hide.
	 */
	handleToggleColumn(payload: { key: string; checked: boolean }): void;
	/**
	 * Toggles visibility for multiple columns at once.
	 * @param payload.checked - `true` to show all, `false` to hide all.
	 * @param payload.keys - Column keys to update.
	 */
	handleToggleAllColumns(payload: { checked: boolean; keys: string[] }): void;
}

/**
 * Abstract base class that provides shared state and logic for all DataTable store implementations.
 *
 * ### What is shared here
 * - `columns`, `columnVisibility`, `filterValues` — always managed client-side
 * - `visibleColumns`, `shouldShowFilters`, `shouldShowManageColumns` — derived from `columns`
 * - `handleFilterChange`, `handleResetFilters` — update filter state then call {@link onFiltersChanged}
 * - `handleToggleColumn`, `handleToggleAllColumns` — identical in all implementations
 *
 * ### What subclasses must implement
 * - `rows` — differs by data source (all data vs. paginated server response)
 * - `filteredRows` — client-side `$derived` vs. direct server response
 * - `init` — in-memory receives rows directly; server-side may only receive columns
 * - `onFiltersChanged` — hook called after every filter change (Template Method pattern)
 */
export abstract class BaseDataTableStore implements IDataTableStore {
	columns = $state<Column[]>([]);
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

	handleFilterChange({ key, value }: { key: string; value: string }) {
		this.filterValues = { ...this.filterValues, [key]: value };
		this.onFiltersChanged();
	}

	handleResetFilters() {
		const clearedFilters: Record<string, string> = {};
		for (const column of this.columns) {
			clearedFilters[column.key] = '';
		}
		this.filterValues = clearedFilters;
		this.onFiltersChanged();
	}

	handleToggleColumn({ key, checked }: { key: string; checked: boolean }) {
		this.columnVisibility = { ...this.columnVisibility, [key]: checked };
	}

	handleToggleAllColumns({ checked, keys }: { checked: boolean; keys: string[] }) {
		const nextVisibility = { ...this.columnVisibility };
		for (const key of keys) {
			nextVisibility[key] = checked;
		}
		this.columnVisibility = nextVisibility;
	}

	/**
	 * Template Method hook — called after every filter state change.
	 *
	 * Override this in subclasses that need to react to filter changes,
	 * for example to trigger a debounced server fetch.
	 * In-memory implementations should leave this as a no-op.
	 */
	protected abstract onFiltersChanged(): void;

	abstract readonly rows: Row[];
	abstract readonly filteredRows: Row[];

	/**
	 * Initializes the store with column definitions and row data.
	 * @param columns - Column definitions.
	 * @param rows - Row data.
	 */
	abstract init(columns: Column[], rows: Row[]): void;
}
