import type { Column, Row } from '../types';

/**
 * Abstract interface for DataTable store.
 * Implement this interface to create different store strategies
 * (e.g. InMemoryDataTableStore, ServerSideDataTableStore).
 */
export interface IDataTableStore {
	// --- State ---
	readonly columns: Column[];
	readonly rows: Row[];
	readonly filterValues: Record<string, string>;
	readonly columnVisibility: Record<string, boolean>;

	// --- Derived ---
	readonly visibleColumns: Column[];
	readonly filteredRows: Row[];
	readonly shouldShowFilters: boolean;
	readonly shouldShowManageColumns: boolean;

	// --- Actions ---
	init(columns: Column[], rows: Row[]): void;
	handleFilterChange(payload: { key: string; value: string }): void;
	handleResetFilters(): void;
	handleToggleColumn(payload: { key: string; checked: boolean }): void;
	handleToggleAllColumns(payload: { checked: boolean; keys: string[] }): void;
}
