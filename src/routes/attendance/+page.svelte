<script lang="ts">
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
	let search = '';

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

<div class="p-2 gap-2 h-full flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<div class="flex md:flex-row gap-2 flex-col items-end justify-between">
			<input class="input md:w-min" type="text" placeholder="Search..." bind:value={search} />
			<div class="flex flex-row md:w-fit w-full items-end gap-2 justify-between">
				<SessionList {Sessions} />
				<button class="btn variant-filled-primary w-fit h-min" on:click={NewSession}
					>New Session</button
				>
			</div>
		</div>
	</header>
	<article
		class="p-2 card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<AttendanceList {groups} {search} />
		{:else}
			<Loading />
		{/if}
	</article>
</div>
