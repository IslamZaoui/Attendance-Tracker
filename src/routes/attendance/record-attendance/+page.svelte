<script lang="ts">
	import { InputChip, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { generateAttendancesForSession, getStudentsWithAttendance } from '$lib/utils.js';
	import { SelectedGroup, SelectedSession } from '$lib/Store';
	import RecordAttendanceList from '$lib/Tables/RecordAttendanceList.svelte';
	import QRcode from '$lib/components/Modals/QRcode.svelte';

	let PageLoaded = false;
	let students: StudentWithAttendance[] = [];
	let search: string[] = [];

	let group: Group = <Group>{};
	let session: Session = <Session>{};

	let tabSet: number = 0;

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

<div class="p-4 gap-5 h-[89vh] flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-4 gap-4">
		<div class="">
			<ol class="breadcrumb">
				<li class="crumb"><a class="anchor" href="/">Main Page</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li class="crumb"><a class="anchor" href="/attendance">Attendance</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li>Record Attendance | Group {group.name} Session {session.id}</li>
			</ol>
		</div>
		<div class="flex md:flex-row gap-4 flex-col items-end">
			<InputChip
				name="search"
				placeholder="Search..."
				bind:value={search}
				max={3}
				minlength={1}
				class="md:w-1/4"
			/>
			<div>
				<TabGroup
					justify="justify-center"
					active="variant-filled-primary"
					hover="hover:variant-soft-primary"
					flex="flex-1 lg:flex-none"
					rounded=""
					border=""
					class="w-full"
				>
					<Tab bind:group={tabSet} class="bg-surface-500 w-[100px]" name="tab1" value={0}
						>Manual</Tab
					>
					<Tab bind:group={tabSet} class="bg-surface-500 w-[100px]" name="tab2" value={1}
						>Qrcode</Tab
					>
				</TabGroup>
			</div>
		</div>
	</header>
	<article
		class="p-4 card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			{#if tabSet === 0}
				<RecordAttendanceList {students} {search} />
			{:else if tabSet === 1 && group.id && session.id}
				<QRcode groupid={group.id} session={session.id} />
			{/if}
		{:else}
			<Loading />
		{/if}
	</article>
</div>
