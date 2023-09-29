<script lang="ts">
	import { page } from '$app/stores';
	import { InputChip } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import {
		calculateTotalUnjustifiedAbsencesForGroup,
		exportToExcel,
		formatDate
	} from '$lib/utils.js';
	import { SelectedGroup, SelectedSession } from '$lib/Store';
	import ViewTotalAttendanceList from '$lib/Tables/ViewTotalAttendanceList.svelte';
	import { faFileExport } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let PageLoaded = false;
	let students: StudentWithTotals[] = [];
	let search = '';

	let group: Group = <Group>{};

	onMount(async () => {
		if ($SelectedGroup && $SelectedGroup.id) {
			group = $SelectedGroup;
			const Gid = $SelectedGroup.id;
			students = await calculateTotalUnjustifiedAbsencesForGroup(Gid);
			PageLoaded = true;
		}
	});
</script>

<svelte:head>
	<title>View Total Attendance | {$SelectedGroup?.name}</title>
</svelte:head>

<div class="p-2 gap-2 h-full flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<span class="text-center"
			>{group.name}'s total Attendance | Session {$SelectedSession?.id} in {formatDate(
				$SelectedSession?.date ?? ''
			)}</span
		>
		<div class="flex md:flex-row gap-2 flex-col justify-between">
			<input class="input md:w-min" type="text" placeholder="Search..." bind:value={search} />
			<button
				class="btn variant-filled-primary w-fit md:block hidden"
				on:click={() => exportToExcel(students, group.name, $page.data.currentPlatform)}
				>Export To Excel</button
			>
		</div>
	</header>
	<article
		class="p-2 relative card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<ViewTotalAttendanceList {students} {search} />
		{:else}
			<Loading />
		{/if}
		<button
			class="btn-icon right-5 bottom-5 variant-filled-primary absolute md:hidden"
			on:click={() => exportToExcel(students, group.name, $page.data.currentPlatform)}
			><Fa icon={faFileExport} /></button
		>
	</article>
</div>
