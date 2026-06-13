<!--
  @component
  A feature-rich data table with support for column filtering, column visibility management,
  and pluggable data sources via the store pattern.

  Usage
  ```svelte
  <script>
    import { DataTable, InMemoryDataTableStore, defineDataTable } from '$lib';

    const table = defineDataTable({
      columns: [
        { key: 'name', label: 'Name', showFilter: true },
        { key: 'email', label: 'Email', showManageColumn: true },
      ],
      rows: [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' },
      ],
    });

    const store = new InMemoryDataTableStore();
    store.init(table.columns, table.rows);
  </script>

  <DataTable title="Users" {store} />
  ```

  Props
  - `title` — Table heading. Defaults to `'Data Table'`.
  - `store` — An `IDataTableStore` instance. Use `InMemoryDataTableStore` for client-side filtering,
    or provide a custom implementation for server-side data.
-->
<script lang="ts">
	import type { IDataTableStore } from '../stores/dataTable.svelte';
	import ManageColumns from './ManageColumns.svelte';
	import Table from './Table.svelte';
	import Filters from './Filters.svelte';
	import { setDataTableContext } from '../context';

	interface Props {
		/**
		 * Title displayed above the table.
		 * @default 'Data Table'
		 */
		title?: string;
		/**
		 * The store instance that drives this table.
		 * Use `InMemoryDataTableStore` for client-side filtering,
		 * or provide a custom implementation of `IDataTableStore` for server-side data.
		 */
		store: IDataTableStore;
	}

	let { title = 'Data Table', store }: Props = $props();

	setDataTableContext({
		get columns() {
			return store.columns;
		},
		get rows() {
			return store.rows;
		},
		get filterValues() {
			return store.filterValues;
		},
		get columnVisibility() {
			return store.columnVisibility;
		},
		get visibleColumns() {
			return store.visibleColumns;
		},
		get filteredRows() {
			return store.filteredRows;
		},
		get shouldShowFilters() {
			return store.shouldShowFilters;
		},
		get shouldShowManageColumns() {
			return store.shouldShowManageColumns;
		},
		init: (columns, rows) => store.init(columns, rows),
		handleFilterChange: (payload) => store.handleFilterChange(payload),
		handleResetFilters: () => store.handleResetFilters(),
		handleToggleColumn: (payload) => store.handleToggleColumn(payload),
		handleToggleAllColumns: (payload) => store.handleToggleAllColumns(payload)
	});
</script>

<div class="mb-4 items-center justify-between md:flex">
	<h1 class="mb-2 text-xl font-bold md:mb-0">{title}</h1>

	<div class="flex gap-2">
		{#if store.shouldShowFilters}
			<Filters />
		{/if}

		{#if store.shouldShowManageColumns}
			<ManageColumns />
		{/if}
	</div>
</div>

<div class="overflow-x-auto">
	<Table columns={store.visibleColumns} rows={store.filteredRows} />
</div>
