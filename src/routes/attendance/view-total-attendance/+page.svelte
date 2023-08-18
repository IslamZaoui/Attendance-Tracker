<script lang="ts">
	import { page } from '$app/stores';
	import { InputChip } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { calculateTotalsForGroup, exportToExcel } from '$lib/utils.js';
	import { SelectedGroup } from '$lib/Store';
	import ViewTotalAttendanceList from '$lib/Tables/ViewTotalAttendanceList.svelte';

	let PageLoaded = false;
	let students: StudentWithTotals[] = [];
	let search: string[] = [];

	let group: Group = <Group>{};

	onMount(async () => {
		if ($SelectedGroup && $SelectedGroup.id) {
			group = $SelectedGroup;
			const Gid = $SelectedGroup.id;
			students = await calculateTotalsForGroup(Gid);
			PageLoaded = true;
		}
	});
</script>

<svelte:head>
	<title>View Total Attendance | {$SelectedGroup?.name}</title>
</svelte:head>

<div class="p-2 gap-2 h-[89vh] flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<div class="">
			<ol class="breadcrumb">
				<li class="crumb"><a class="anchor" href="/">Main Page</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li class="crumb"><a class="anchor" href="/attendance">Attendance</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li>View Total Attendance | Group {$SelectedGroup?.name}</li>
			</ol>
		</div>
		<div class="flex md:flex-row gap-2 flex-col items-end">
			<InputChip
				name="search"
				placeholder="Search..."
				bind:value={search}
				max={3}
				minlength={1}
				class="md:w-1/4"
			/>
			<button
				class="btn variant-filled-primary w-fit"
				on:click={() => exportToExcel(students, group.name, $page.data.currentPlatform)}
				>Export To Excel</button
			>
		</div>
	</header>
	<article
		class="p-2 card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<ViewTotalAttendanceList {students} {search} />
		{:else}
			<Loading />
		{/if}
	</article>
</div>
