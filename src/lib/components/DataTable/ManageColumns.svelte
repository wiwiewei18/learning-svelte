<script lang="ts">
	import ChevronDownIcon from '$lib/components/icons/ChevronDownIcon.svelte';
	import ViewColumnsIcon from '$lib/components/icons/ViewColumnsIcon.svelte';
	import MagnifyingGlassIcon from '$lib/components/icons/MagnifyingGlassIcon.svelte';
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
				<input type="search" placeholder="Search columns" />
			</label>

			{#if false}
				<p class="text-sm opacity-70">No manageable columns.</p>
			{:else}
				<label class="label">
					<input type="checkbox" checked={false} class="checkbox checkbox-sm" />
					Select All
				</label>

				<label class="label">
					<input type="checkbox" checked={false} class="checkbox checkbox-sm" />
					Name
				</label>
			{/if}
		</div>
	</div>
</div>
