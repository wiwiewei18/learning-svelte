export type Row = Record<string, unknown>;

export interface Column<
	T extends Row = Row,
	K extends Extract<keyof T, string> = Extract<keyof T, string>
> {
	key: K;
	label: string;
	showFilter?: boolean;
	showManageColumn?: boolean;
}

export interface TableDefinition<T extends Row> {
	columns: Column<T>[];
	rows: T[];
}

export function defineDataTable<T extends Row>(definition: TableDefinition<T>): TableDefinition<T> {
	return definition;
}
