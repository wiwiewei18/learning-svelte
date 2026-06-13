<script lang="ts">
	import type { Row, Column } from '../types';
	import ManageColumns from './ManageColumns.svelte';
	import Table from './Table.svelte';
	import { dataTableStore } from '../stores/dataTable.svelte';
	import Filters from './Filters.svelte';

	interface Props {
		title?: string;
		columns?: Column[];
		rows?: Row[];
	}

	let { title = 'Data Table', columns = [], rows = [] }: Props = $props();

	$effect(() => {
		dataTableStore.init(columns, rows);
	});
</script>

<div class="mb-4 items-center justify-between md:flex">
	<h1 class="mb-2 text-xl font-bold md:mb-0">{title}</h1>

	<div class="flex gap-2">
		{#if dataTableStore.shouldShowFilters}
			<Filters />
		{/if}

		{#if dataTableStore.shouldShowManageColumns}
			<ManageColumns />
		{/if}
	</div>
</div>

<div class="overflow-x-auto">
	<Table columns={dataTableStore.visibleColumns} rows={dataTableStore.filteredRows} />
</div>
