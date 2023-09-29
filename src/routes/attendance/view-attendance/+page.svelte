<script lang="ts">
	import { InputChip } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import {
		ExportAttSession,
		formatDate,
		generateAttendancesForSession,
		getStudentsWithAttendance
	} from '$lib/utils.js';
	import { SelectedGroup, SelectedSession } from '$lib/Store';
	import ViewAttendanceList from '$lib/Tables/ViewAttendanceList.svelte';
	import { page } from '$app/stores';
	import Fa from 'svelte-fa';
	import { faFileExport } from '@fortawesome/free-solid-svg-icons';
	import { date } from 'zod';

	let PageLoaded = false;
	let students: StudentWithAttendance[] = [];
	let search = '';

	let group: Group = <Group>{};
	let session: Session = <Session>{};

	onMount(async () => {
		if ($SelectedGroup && $SelectedGroup.id && $SelectedSession && $SelectedSession.id) {
			group = $SelectedGroup;
			session = $SelectedSession;
			const Gid = $SelectedGroup.id;
			const Sid = $SelectedSession.id;
			generateAttendancesForSession(Gid, Sid);
			students = await getStudentsWithAttendance(Gid, Sid);
			PageLoaded = true;
		}
	});
</script>

<svelte:head>
	<title>View Attendance | {$SelectedGroup?.name} {$SelectedSession?.id}</title>
</svelte:head>

<div class="p-2 gap-2 h-full flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<span class="text-center">{group.name}'s Attendance | Session {$SelectedSession?.id} in {formatDate($SelectedSession?.date ?? '')}</span>
		<div class="flex md:flex-row gap-2 flex-col justify-between">
			<input class="input md:w-min" type="text" placeholder="Search..." bind:value={search} />
			<button
				class="btn hidden md:block variant-filled-primary"
				on:click={() => ExportAttSession(students, session, group, $page.data.currentPlatform)}
				>Export Attendance</button
			>
		</div>
	</header>
	<article
		class="p-2 relative card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<ViewAttendanceList {students} {search} />
		{:else}
			<Loading />
		{/if}
		<button
			class="btn-icon md:hidden absolute right-5 bottom-5 variant-filled-primary"
			on:click={() => ExportAttSession(students, session, group, $page.data.currentPlatform)}
			><Fa icon={faFileExport} size="24" /></button
		>
	</article>
</div>
