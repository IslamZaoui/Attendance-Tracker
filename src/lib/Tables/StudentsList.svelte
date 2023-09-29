<script lang="ts">
	import { DeleteStudent, GotoStudentInfo, searchStudents } from '$lib/utils';
	import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
	import { popup } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';

	export let students: Student[];
	export let search: string;
	export let group: Group;

	let list: Student[];

	$: {
		if (search.length > 0) list = searchStudents(students, search);
		else list = students;
	}
</script>

{#if students.length > 0}
	<div class="table-container md:w-1/2 w-full flex flex-col gap-2">
		{#each list as student (student.id)}
			<div class="card flex">
				<div
					class="p-2 w-full flex flex-col gap-1"
					on:mousedown={() => {
						GotoStudentInfo(student, group);
					}}
				>
					<span class="text-gray-500">{student.regis_num}</span>
					<span>{student.lastname} {student.firstname}</span>
				</div>
				<button
					class="btn"
					use:popup={{ event: 'click', target: `student${student.id}`, placement: 'bottom' }}
					><Fa icon={faEllipsisVertical} /></button
				>
			</div>
			<div class="p-2 card shadow-lg" data-popup="student{student.id}">
				<div class="flex gap-2 flex-col">
					<button
						class="chip chip-sm variant-ghost-error"
						on:click={() => {
							DeleteStudent(student);
						}}>Delete Student</button
					>
				</div>
				<div class="arrow bg-surface-100-800-token" />
			</div>
		{/each}
	</div>
{:else}
	<div class="flex flex-col gap-4 items-center p-6">
		<h2 class="h2 font-bold">Student List Empty</h2>
		<span>Add new Student First</span>
	</div>
{/if}
