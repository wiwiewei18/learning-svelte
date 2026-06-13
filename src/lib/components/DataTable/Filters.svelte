<script lang="ts">
	import ChevronDownIcon from '$lib/components/icons/ChevronDownIcon.svelte';
	import FunnelIcon from '$lib/components/icons/FunnelIcon.svelte';
</script>

<div class="dropdown dropdown-end w-full md:w-auto">
	<div tabindex="0" role="button" class="btn btn-outline btn-secondary btn-block md:btn-auto">
		<FunnelIcon />
		Filters
		<ChevronDownIcon />
	</div>
	<div tabindex="-1" class="dropdown-content card card-sm bg-base-100 z-1 w-64 shadow-md">
		<div class="card-body">
			{#if false}
				<p class="text-sm opacity-70">No filterable columns.</p>
			{:else}
				<label class="fieldset">
					<span class="label">Name</span>
					<input type="search" class="input input-sm" placeholder="Filter by name" value="" />
				</label>

				<button type="button" class="btn btn-sm btn-outline btn-secondary mt-2">
					Reset Filters
				</button>
			{/if}
		</div>
	</div>
</div>
