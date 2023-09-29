<script lang="ts">
	import { FileButton, InputChip, popup } from '@skeletonlabs/skeleton';
	import StudentsList from '$lib/Tables/StudentsList.svelte';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { liveQuery } from 'dexie';
	import db from '$lib/DB.js';
	import { get } from 'svelte/store';
	import { SelectedGroup } from '$lib/Store.js';
	import { goto } from '$app/navigation';
	import { ImportStudents, NewStudentModal } from '$lib/utils.js';
	import { faFileImport, faPlus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
	//@ts-ignore
	import Fa from 'svelte-fa/src/fa.svelte';

	let PageLoaded = false;
	let students: Student[] = [];
	let search = '';
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

<div class="p-2 gap-2 h-full flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<span class="text-center text-[20px]">{$SelectedGroup?.name}'s Students</span>
		<div class="flex flex-row justify-between gap-2">
			<input class="input md:w-min" type="text" placeholder="Search..." bind:value={search} />
			<div class="flex-row items-end gap-2 md:flex hidden">
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
		class="p-2 relative card overflow-y-auto flex gap-2 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<StudentsList {students} {search} group={CurrentGroup} />
		{:else}
			<Loading />
		{/if}
		<button
			class="btn-icon md:hidden absolute right-5 bottom-5 variant-filled-primary"
			use:popup={{ event: 'click', target: 'addpopup', placement: 'top' }}
			><Fa icon={faPlus} /></button
		>
	</article>
</div>

<div class="card rounded-full p-2" data-popup="addpopup">
	<div class="flex flex-col gap-2">
		<FileButton
			name="file"
			accept=".xlsx"
			bind:files
			button="btn-icon variant-filled"
			on:change={() => {
				ImportStudents(files[0], CurrentGroup, students);
			}}><Fa icon={faFileImport} /></FileButton
		>
		<button class="btn-icon variant-filled-primary" on:click={() => NewStudentModal(CurrentGroup)}
			><Fa icon={faUserPlus} /></button
		>
	</div>
	<div class="arrow bg-surface-100-800-token" />
</div>
