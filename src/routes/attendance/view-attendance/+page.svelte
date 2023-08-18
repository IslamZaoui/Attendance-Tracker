<script lang="ts">
	import { InputChip } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import {
		ExportAttSession,
		generateAttendancesForSession,
		getStudentsWithAttendance
	} from '$lib/utils.js';
	import { SelectedGroup, SelectedSession } from '$lib/Store';
	import ViewAttendanceList from '$lib/Tables/ViewAttendanceList.svelte';
	import { page } from '$app/stores';

	let PageLoaded = false;
	let students: StudentWithAttendance[] = [];
	let search: string[] = [];

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

<div class="p-2 gap-2 h-[89vh] flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<div class="">
			<ol class="breadcrumb">
				<li class="crumb"><a class="anchor" href="/">Main Page</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li class="crumb"><a class="anchor" href="/attendance">Attendance</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li>View Attendance | Group {$SelectedGroup?.name} Session {$SelectedSession?.id}</li>
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
				on:click={() => ExportAttSession(students, session, group, $page.data.currentPlatform)}
				>Export To Excel</button
			>
		</div>
	</header>
	<article
		class="p-2 card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<ViewAttendanceList {students} {search} />
		{:else}
			<Loading />
		{/if}
	</article>
</div>
