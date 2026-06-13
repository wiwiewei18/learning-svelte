<script lang="ts">
	import type { Row, Column } from '../types';

	interface Props {
		columns?: Column[];
		rows?: Row[];
	}

	let { columns = [], rows = [] }: Props = $props();

	function toDisplayValue(column: Column, row: Row) {
		return row[column.key] ?? '-';
	}
</script>

<table class="table">
	<thead>
		<tr>
			<th></th>
			{#each columns as column (column.key)}
				<th>{column.label}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#if rows.length === 0}
			<tr>
				<th></th>
				<td colspan={columns.length} class="text-center">No data available.</td>
			</tr>
		{:else}
			{#each rows as row, index (row)}
				<tr>
					<th>{index + 1}</th>
					{#each columns as column (column.key)}
						<td>{toDisplayValue(column, row)}</td>
					{/each}
				</tr>
			{/each}
		{/if}
	</tbody>
	<tfoot>
		<tr>
			<th></th>
			{#each columns as column (column.key)}
				<th>{column.label}</th>
			{/each}
		</tr>
	</tfoot>
</table>
