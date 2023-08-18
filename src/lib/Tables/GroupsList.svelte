<script lang="ts">
	import { DeleteGroup, GotoManageStudents, searchGroups } from '$lib/utils';

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
								on:click={() => GotoManageStudents(group)}>Manage Students</button
							>
							<button class="chip chip-sm variant-ghost-error" on:click={() => DeleteGroup(group)}
								>Delete Group</button
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
			<div class="card flex h-fit">
				<div class="p-2 w-full">
					<span>Group: {group.name}</span>
				</div>
				<div class="p-2 flex flex-col gap-1 w-1/2 justify-end">
					<button
						class="chip chip-sm variant-ghost-success"
						on:click={() => GotoManageStudents(group)}>Manage Students</button
					>
					<button class="chip chip-sm variant-ghost-error" on:click={() => DeleteGroup(group)}
						>Delete Group</button
					>
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
