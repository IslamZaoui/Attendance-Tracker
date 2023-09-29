<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import {
		formatDate,
		generateAttendancesForSession,
		getStudentsWithAttendance
	} from '$lib/utils.js';
	import { SelectedGroup, SelectedSession } from '$lib/Store';
	import RecordAttendanceList from '$lib/Tables/RecordAttendanceList.svelte';
	import QRcode from '$lib/components/Modals/QRcode.svelte';
	import { writable } from 'svelte/store';

	let PageLoaded = false;
	let students: StudentWithAttendance[] = [];
	let search = '';

	let group: Group = <Group>{};
	let session: Session = <Session>{};

	let tabStore = writable(0);
	let prevTabStoreValue = 0;
	tabStore.subscribe(async (value) => {
		if (value === 0) {
			if (prevTabStoreValue === 1) {
				students = await getStudentsWithAttendance(group.id, session.id);
			}
		}
		prevTabStoreValue = value;
	});

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
	<title>Record Attendance | {$SelectedGroup?.name} {$SelectedSession?.id}</title>
</svelte:head>

<div class="p-2 gap-2 h-full flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<div class="text-center">
			{group.name}'s Attendance | Session {session.id} in {formatDate($SelectedSession?.date ?? '')}
		</div>
		<div class="flex md:flex-row gap-2 flex-col items-end">
			<input class="input md:w-min" type="text" placeholder="Search..." bind:value={search} />
			<div>
				<TabGroup
					justify="justify-center"
					active="variant-filled-primary"
					hover="hover:variant-soft-primary"
					flex="flex-1 lg:flex-none"
					rounded=""
					class="w-full"
				>
					<Tab bind:group={$tabStore} class="bg-surface-500 w-[100px]" name="tab1" value={0}
						>Manual</Tab
					>
					<Tab bind:group={$tabStore} class="bg-surface-500 w-[100px]" name="tab2" value={1}
						>Qrcode</Tab
					>
				</TabGroup>
			</div>
		</div>
	</header>
	<article
		class="p-2 card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			{#if $tabStore === 0}
				<RecordAttendanceList {students} {search} />
			{:else if $tabStore === 1 && group.id && session.id}
				<QRcode groupid={group.id} session={session.id} />
			{/if}
		{:else}
			<Loading />
		{/if}
	</article>
</div>
