<script lang="ts">
	import { SelectedSession } from '$lib/Store';
	import {
		GotoRecordAttendanc,
		GotoViewAttendanc,
		GotoViewTotalAttendanc,
		searchGroups
	} from '$lib/utils';
	import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
	import { popup } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';

	export let groups: Group[];
	export let search: string;

	let list: Group[];

	$: {
		if (search.length > 0) list = searchGroups(search, groups);
		else list = groups;
	}
</script>

{#if groups.length > 0}
	<div class="table-container md:w-1/2 w-full flex flex-col gap-2">
		{#each list as group (group.id)}
			<div class="card p-2 flex w-full">
				<span class="h3 w-full h-full" on:mousedown={() => GotoRecordAttendanc(group)}
					>{group.name}</span
				>
				<button
					class="btn w-min"
					use:popup={{ event: 'click', target: `popup${group.name}`, placement: 'bottom' }}
					><Fa icon={faEllipsisVertical} /></button
				>
			</div>
			<div class="card variant-filled-surface" data-popup="popup{group.name}">
				<span class="flex flex-col gap-1 p-2">
					<button
						class="chip chip-sm variant-ghost-success"
						on:click={() => GotoViewAttendanc(group)}>View Session</button
					>
					<button
						class="chip chip-sm variant-ghost-success"
						on:click={() => GotoViewTotalAttendanc(group)}>View Total</button
					>
					<div class="arrow variant-filled-surface" />
				</span>
			</div>
		{/each}
	</div>
{:else}
	<div class="flex flex-col gap-5 p-6">
		<h2 class="h2 font-bold">Group List Empty 😢</h2>
		<span>Add new Groups and start Managing your students</span>
	</div>
{/if}
