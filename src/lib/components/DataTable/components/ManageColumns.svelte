<script lang="ts">
	import ChevronDownIcon from '$lib/components/icons/ChevronDownIcon.svelte';
	import ViewColumnsIcon from '$lib/components/icons/ViewColumnsIcon.svelte';
	import MagnifyingGlassIcon from '$lib/components/icons/MagnifyingGlassIcon.svelte';
	import { dataTableStore } from '../stores/dataTable.svelte';

	let search = $state('');

	const manageableColumns = $derived(
		dataTableStore.columns.filter((column) => column.showManageColumn !== false)
	);

	const filteredColumns = $derived(
		manageableColumns.filter((column) =>
			column.label.toLowerCase().includes(search.trim().toLowerCase())
		)
	);

	const selectedCount = $derived(
		filteredColumns.filter((column) => dataTableStore.columnVisibility[column.key] ?? true).length
	);

	const allChecked = $derived(
		filteredColumns.length > 0 && selectedCount === filteredColumns.length
	);

	function handleToggleColumn(key: string, event: Event) {
		const target = event.target as HTMLInputElement;
		dataTableStore.handleToggleColumn({ key, checked: target.checked });
	}

	function handleToggleAll(event: Event) {
		const target = event.target as HTMLInputElement;
		dataTableStore.handleToggleAllColumns({
			checked: target.checked,
			keys: filteredColumns.map((column) => column.key)
		});
	}
</script>

<div class="dropdown dropdown-end w-full md:w-auto">
	<div tabindex="0" role="button" class="btn btn-outline btn-secondary btn-block md:btn-auto">
		<ViewColumnsIcon />
		Manage Columns
		<ChevronDownIcon />
	</div>
	<div tabindex="-1" class="dropdown-content card card-sm bg-base-100 z-1 w-64 shadow-md">
		<div class="card-body">
			<label class="input input-sm mb-1">
				<MagnifyingGlassIcon />
				<input type="search" placeholder="Search columns" bind:value={search} />
			</label>

			{#if filteredColumns.length === 0}
				<p class="text-sm opacity-70">No manageable columns.</p>
			{:else}
				<label class="label">
					<input
						type="checkbox"
						checked={allChecked}
						class="checkbox checkbox-sm"
						onchange={handleToggleAll}
					/>
					Select All
				</label>

				{#each filteredColumns as column (column.key)}
					<label class="label">
						<input
							type="checkbox"
							checked={dataTableStore.columnVisibility[column.key] ?? true}
							class="checkbox checkbox-sm"
							onchange={(event) => handleToggleColumn(column.key, event)}
						/>
						{column.label}
					</label>
				{/each}
			{/if}
		</div>
	</div>
</div>
