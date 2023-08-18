<script lang="ts">
	import { SelectedSession } from '$lib/Store';
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
	<div class="table-container md:w-1/2 w-full flex flex-col gap-2">
		<!--
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
								on:click={() => GotoRecordAttendanc(group)}>Record</button
							>
							<button
								class="chip chip-sm variant-ghost-warning"
								on:click={() => GotoViewAttendanc(group)}>View</button
							>
							<button
								class="chip chip-sm variant-ghost-warning"
								on:click={() => GotoViewTotalAttendanc(group)}>View Total</button
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
	-->
		{#each list as group (group.id)}
			<div class="card flex w-full">
				<div class="p-2 w-full">
					<span>Group: {group.name}</span>
				</div>
				<div class="p-2 flex gap-1 w-full justify-end">
					<button
						class="chip chip-sm variant-ghost-primary"
						on:click={() => GotoRecordAttendanc(group)}>Record</button
					>
					<span class='flex flex-col gap-1'>
						<button
							class="chip chip-sm variant-ghost-success"
							on:click={() => GotoViewAttendanc(group)}>View Session</button
						>
						<button
							class="chip chip-sm variant-ghost-success"
							on:click={() => GotoViewTotalAttendanc(group)}>View Total</button
						>
					</span>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="flex flex-col gap-5 p-6">
		<h2 class="h2 font-bold">Group List Empty 😢</h2>
		<span>Add new Groups and start Managing your students</span>
	</div>
{/if}
