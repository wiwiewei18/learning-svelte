import { getContext, setContext } from 'svelte';
import type { IDataTableStore } from '../stores/dataTable.svelte';

const DATA_TABLE_CONTEXT_KEY = Symbol('DataTableStore');

export function setDataTableContext(store: IDataTableStore): void {
	setContext(DATA_TABLE_CONTEXT_KEY, store);
}

export function getDataTableContext(): IDataTableStore {
	const store = getContext<IDataTableStore | undefined>(DATA_TABLE_CONTEXT_KEY);
	if (!store) {
		throw new Error(
			'DataTable store not found in context. Make sure to use <DataTable> as the parent component.'
		);
	}
	return store;
}
