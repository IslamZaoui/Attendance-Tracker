<script lang="ts">
	import Present from '$lib/components/buttons/Attendance.svelte';
	import { searchStudentsWithAttendance } from '$lib/utils';

	export let students: StudentWithAttendance[];
	export let search: String;

	let list: StudentWithAttendance[];

	$: {
		if (search.length > 0) list = searchStudentsWithAttendance(students, search);
		else list = students;
	}
</script>

{#if students.length > 0}
	<div class="table-container md:w-1/2 w-full flex flex-col gap-2">
		{#each list as student (student.student.id)}
			<div class="card flex">
				<div class="p-2 w-full flex flex-col gap-1">
					<span class="text-gray-500">{student.student.regis_num}</span>
					<span>{student.student.lastname} {student.student.firstname}</span>
				</div>
				<div class="flex gap-2">
					<Present attendance={student.attendance} />
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="flex flex-col gap-4 items-center p-6">
		<h2 class="h2 font-bold">Student List Empty</h2>
		<span>Add new Student First</span>
	</div>
{/if}
