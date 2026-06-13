<script lang="ts">
	import Filters from './Filters.svelte';
	import ManageColumns from './ManageColumns.svelte';
	import Table from './Table.svelte';
</script>

<div class="mb-4 items-center justify-between md:flex">
	<h1 class="mb-2 text-xl font-bold md:mb-0">All Users</h1>

	<div class="flex gap-2">
		<Filters />

		<ManageColumns />
	</div>
</div>

<div class="overflow-x-auto">
	<Table />
</div>
