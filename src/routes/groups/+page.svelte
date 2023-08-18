<script lang="ts">
	import { InputChip, modalStore } from '@skeletonlabs/skeleton';
	import GroupsList from '$lib/Tables/GroupsList.svelte';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { NewGroupModal } from '$lib/utils.js';
	import db from '$lib/DB.js';
	import { liveQuery } from 'dexie';

	let PageLoaded = false;
	let groups: Group[] = [];
	$: search = [];

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

<div class="p-2 gap-2 h-[89vh] flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<div class="">
			<ol class="breadcrumb">
				<li class="crumb"><a class="anchor" href="/">Main Page</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li>Groups</li>
			</ol>
		</div>
		<div class="flex md:flex-row gap-2 flex-col">
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
				on:click={() => modalStore.trigger(NewGroupModal)}>New Group</button
			>
		</div>
	</header>
	<article
		class="p-2 card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<GroupsList {groups} {search} />
		{:else}
			<Loading />
		{/if}
	</article>
</div>
