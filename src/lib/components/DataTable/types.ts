/**
 * A generic table row — a plain object whose values can be anything.
 */
export type Row = Record<string, unknown>;

/**
 * Defines a single column in the DataTable.
 *
 * @template T - The row type this column belongs to.
 * @template K - The specific key of `T` this column maps to.
 *
 * @example
 * const column: Column<User> = {
 *   key: 'name',
 *   label: 'Full Name',
 *   showFilter: true,
 *   showManageColumn: true,
 * };
 */
export interface Column<
	T extends Row = Row,
	K extends Extract<keyof T, string> = Extract<keyof T, string>
> {
	/** The key in the row object this column maps to. */
	key: K;
	/** Human-readable column header label. */
	label: string;
	/**
	 * Whether a filter input is shown for this column.
	 * @default false
	 */
	showFilter?: boolean;
	/**
	 * Whether this column appears in the "Manage Columns" panel.
	 * Set to `false` to make the column always visible and non-toggleable.
	 * @default true
	 */
	showManageColumn?: boolean;
}

/**
 * A typed pair of columns and rows used to define a full table dataset.
 *
 * @template T - The row type.
 */
export interface TableDefinition<T extends Row> {
	/** Column definitions for the table. */
	columns: Column<T>[];
	/** The row data to display. */
	rows: T[];
}

/**
 * Helper that returns a fully-typed `TableDefinition` from inline column and row definitions.
 *
 * Use this instead of a plain object literal to get proper type inference on `columns.key`.
 *
 * @template T - The row type, inferred from the `rows` array.
 * @param definition - The table definition containing columns and rows.
 * @returns The same object, typed as `TableDefinition<T>`.
 *
 * @example
 * const table = defineDataTable({
 *   columns: [
 *     { key: 'id', label: 'ID' },
 *     { key: 'name', label: 'Name', showFilter: true },
 *   ],
 *   rows: [
 *     { id: 1, name: 'Alice' },
 *     { id: 2, name: 'Bob' },
 *   ],
 * });
 */
export function defineDataTable<T extends Row>(definition: TableDefinition<T>): TableDefinition<T> {
	return definition;
}
