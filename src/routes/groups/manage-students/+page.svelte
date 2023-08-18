<script lang="ts">
	import { FileButton, InputChip, modalStore } from '@skeletonlabs/skeleton';
	import StudentsList from '$lib/Tables/StudentsList.svelte';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { liveQuery } from 'dexie';
	import db from '$lib/DB.js';
	import { get } from 'svelte/store';
	import { SelectedGroup } from '$lib/Store.js';
	import { goto } from '$app/navigation';
	import { ImportStudents, NewStudentModal } from '$lib/utils.js';

	let PageLoaded = false;
	let students: Student[] = [];
	let search: string[] = [];
	let CurrentGroup: Group;
	let files: FileList;

	onMount(async () => {
		const group = get(SelectedGroup);
		if (group && group.id) {
			CurrentGroup = group;
			const id = group.id;
			const S = liveQuery(() => db.students.where('groupid').equals(id).toArray());
			S.subscribe((value) => {
				students = value;
			});
			PageLoaded = true;
		} else {
			goto('/groups');
		}
	});
</script>

<svelte:head>
	<title>Groups | {$SelectedGroup?.name}</title>
</svelte:head>

<div class="p-2 gap-2 h-[89vh] flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<div class="">
			<ol class="breadcrumb">
				<li class="crumb"><a class="anchor" href="/">Main Page</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li class="crumb"><a class="anchor" href="/groups">Groups</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li>Manage Student | Group {CurrentGroup?.name ?? ''}</li>
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
			<div class="flex flex-row items-end gap-2">
				<button
					class="btn variant-filled-primary w-fit"
					on:click={() => NewStudentModal(CurrentGroup)}>New Student</button
				>
				<FileButton
					name="file"
					accept=".xlsx"
					bind:files
					on:change={() => {
						ImportStudents(files[0], CurrentGroup, students);
					}}>Import Students</FileButton
				>
			</div>
		</div>
	</header>
	<article
		class="p-2 card overflow-y-auto flex gap-2 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<StudentsList {students} {search} group={CurrentGroup} />
		{:else}
			<Loading />
		{/if}
	</article>
</div>
