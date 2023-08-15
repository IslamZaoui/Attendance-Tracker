<script lang="ts">
	import {
		GotoRecordAttendanc,
		GotoViewAttendanc,
		GotoViewTotalAttendanc,
		searchGroups
	} from '$lib/utils';

	export let groups: Group[];
	export let search: string[];

	let list: Group[];

	$: {
		if (search.length > 0) list = searchGroups(search, groups);
		else list = groups;
	}
</script>

{#if groups.length > 0}
	<div class="table-container w-fit">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th colspan="2" />
				</tr>
			</thead>
			<tbody>
				{#each list as group (group.id)}
					<tr>
						<td>{group.id}</td>
						<td>{group.name}</td>
						<td class="flex flex-col md:flex-row gap-2">
							<button
								class="chip chip-sm variant-ghost-success"
								on:click={() => GotoRecordAttendanc(group)}>Record Attendance</button
							>
							<button
								class="chip chip-sm variant-ghost-warning"
								on:click={() => GotoViewAttendanc(group)}>View Attendance</button
							>
							<button
								class="chip chip-sm variant-ghost-warning"
								on:click={() => GotoViewTotalAttendanc(group)}>View Total Attendance</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th colspan="2">Total Groups: {groups.length}</th>
				</tr>
			</tfoot>
		</table>
	</div>
{:else}
	<div class="flex flex-col gap-5 p-6">
		<h2 class="h2 font-bold">Group List Empty 😢</h2>
		<span>Add new Groups and start Managing your students</span>
	</div>
{/if}
