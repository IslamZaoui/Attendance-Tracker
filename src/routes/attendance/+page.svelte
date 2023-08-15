<script lang="ts">
	import { InputChip } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { NewSession } from '$lib/utils.js';
	import db from '$lib/DB.js';
	import { liveQuery } from 'dexie';
	import SessionList from '$lib/Tables/SessionList.svelte';
	import AttendanceList from '$lib/Tables/AttendanceList.svelte';

	let PageLoaded = false;
	let groups: Group[] = [];
	let Sessions: Session[] = [];
	let search: string[] = [];

	onMount(async () => {
		const G = liveQuery(() => db.groups.toArray());
		G.subscribe((value) => {
			groups = value;
		});

		const S = liveQuery(() => db.sessions.toArray());
		S.subscribe((value) => {
			Sessions = value;
		});

		PageLoaded = true;
	});
</script>

<svelte:head>
	<title>Attendance List</title>
</svelte:head>

<div class="p-4 gap-5 h-[89vh] flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-4 gap-4">
		<div class="">
			<ol class="breadcrumb">
				<li class="crumb"><a class="anchor" href="/">Main Page</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li>Attendance</li>
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
			<div class="flex flex-row items-end gap-4">
				<SessionList {Sessions} />
				<button class="btn variant-filled-primary w-fit h-min" on:click={NewSession}
					>New Session</button
				>
			</div>
		</div>
	</header>
	<article
		class="p-4 card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<AttendanceList {groups} {search} />
		{:else}
			<Loading />
		{/if}
	</article>
</div>
