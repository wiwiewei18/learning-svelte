<script lang="ts">
	import ChevronDownIcon from '$lib/components/icons/ChevronDownIcon.svelte';
	import FunnelIcon from '$lib/components/icons/FunnelIcon.svelte';
	import { dataTableStore } from '../stores/dataTable.svelte';
	import type { Column } from '../types';

	const filterableColumns = $derived(dataTableStore.columns.filter((column) => column.showFilter));

	function getPlaceholder(column: Column) {
		return `Filter by ${column.label}`;
	}

	function handleInputChange(key: string, event: Event) {
		const target = event.target as HTMLInputElement;
		dataTableStore.handleFilterChange({ key, value: target.value });
	}
</script>

<div class="dropdown dropdown-end w-full md:w-auto">
	<div tabindex="0" role="button" class="btn btn-outline btn-secondary btn-block md:btn-auto">
		<FunnelIcon />
		Filters
		<ChevronDownIcon />
	</div>
	<div tabindex="-1" class="dropdown-content card card-sm bg-base-100 z-1 w-64 shadow-md">
		<div class="card-body">
			{#if filterableColumns.length === 0}
				<p class="text-sm opacity-70">No filterable columns.</p>
			{:else}
				{#each filterableColumns as column (column.key)}
					<label class="fieldset">
						<span class="label">{column.label}</span>
						<input
							type="search"
							class="input input-sm"
							placeholder={getPlaceholder(column)}
							value={dataTableStore.filterValues[column.key] ?? ''}
							oninput={(event) => handleInputChange(column.key, event)}
						/>
					</label>
				{/each}

				<button
					type="button"
					class="btn btn-sm btn-outline btn-secondary mt-2"
					onclick={() => dataTableStore.handleResetFilters()}
				>
					Reset Filters
				</button>
			{/if}
		</div>
	</div>
</div>
