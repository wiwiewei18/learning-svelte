<script lang="ts">
	import type { Row, Column } from './types';
	import Filters from './Filters.svelte';
	import ManageColumns from './ManageColumns.svelte';
	import Table from './Table.svelte';

	interface Props {
		title?: string;
		columns?: Column[];
		rows?: Row[];
	}

	let { title = 'Data Table', columns = [], rows = [] }: Props = $props();

	let filterValues = $state<Record<string, string>>({});

	let columnVisibility = $state<Record<string, boolean>>({});

	const visibleColumns = $derived(
		columns.filter(
			(column) => column.showManageColumn === false || (columnVisibility[column.key] ?? true)
		)
	);

	const shouldShowFilters = $derived(columns.some((column) => isColumnFilterable(column)));

	const shouldShowManageColumns = $derived(
		columns.some((column) => (column.showManageColumn ?? true) === true)
	);

	const filteredRows = $derived(
		rows.filter((row) =>
			columns.every((column) => {
				const rawFilterValue = filterValues[column.key];
				const filterValue = rawFilterValue?.trim().toLowerCase();

				if (!filterValue || !isFilterEnabled(column)) {
					return true;
				}

				const cellValue = String(row[column.key] ?? '').toLowerCase();

				return cellValue.includes(filterValue);
			})
		)
	);

	function isColumnFilterable(column: Column) {
		return column.showFilter;
	}

	function isFilterEnabled(column: Column) {
		return isColumnFilterable(column);
	}

	function handleFilterChange({ key, value }: { key: string; value: string }) {
		filterValues = {
			...filterValues,
			[key]: value
		};
	}

	function handleResetFilters() {
		const clearedFilters: Record<string, string> = {};

		for (const column of columns) {
			clearedFilters[column.key] = '';
		}

		filterValues = clearedFilters;
	}

	function handleToggleColumn({ key, checked }: { key: string; checked: boolean }) {
		columnVisibility = {
			...columnVisibility,
			[key]: checked
		};
	}

	function handleToggleAllColumns({ checked, keys }: { checked: boolean; keys: string[] }) {
		const nextVisibility = { ...columnVisibility };

		for (const key of keys) {
			nextVisibility[key] = checked;
		}

		columnVisibility = nextVisibility;
	}
</script>

<div class="mb-4 items-center justify-between md:flex">
	<h1 class="mb-2 text-xl font-bold md:mb-0">{title}</h1>

	<div class="flex gap-2">
		{#if shouldShowFilters}
			<Filters
				{columns}
				values={filterValues}
				onChange={handleFilterChange}
				onReset={handleResetFilters}
			/>
		{/if}

		{#if shouldShowManageColumns}
			<ManageColumns
				{columns}
				{columnVisibility}
				onToggle={handleToggleColumn}
				onToggleAll={handleToggleAllColumns}
			/>
		{/if}
	</div>
</div>

<div class="overflow-x-auto">
	<Table columns={visibleColumns} rows={filteredRows} />
</div>
