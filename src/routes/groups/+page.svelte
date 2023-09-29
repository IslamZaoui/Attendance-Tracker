<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import GroupsList from '$lib/Tables/GroupsList.svelte';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { NewGroupModal } from '$lib/utils.js';
	import db from '$lib/DB.js';
	import { liveQuery } from 'dexie';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let PageLoaded = false;
	let groups: Group[] = [];
	let search = '';

	onMount(async () => {
		const G = liveQuery(() => db.groups.toArray());
		G.subscribe((value) => {
			groups = value;
		});
		PageLoaded = true;
	});
</script>

<svelte:head>
	<title>Groups</title>
</svelte:head>

<div class="p-2 gap-2 h-full flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<div class="flex md:flex-row gap-2 flex-col justify-between">
			<input class="input md:w-min" type="text" placeholder="Search..." bind:value={search} />
			<button
				class="btn md:block hidden variant-filled-primary w-fit"
				on:click={() => modalStore.trigger(NewGroupModal)}>New Group</button
			>
		</div>
	</header>
	<article
		class="p-2 relative card overflow-y-hidden flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<GroupsList {groups} {search}/>
		{:else}
			<Loading />
		{/if}
		<button
			class="btn-icon absolute bottom-5 right-5 md:hidden variant-filled-primary"
			on:click={() => modalStore.trigger(NewGroupModal)}><Fa icon={faPlus} size="18" /></button
		>
	</article>
</div>
