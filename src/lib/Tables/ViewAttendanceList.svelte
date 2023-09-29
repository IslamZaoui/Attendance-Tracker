<script lang="ts">
	import Justification from '$lib/components/buttons/Justification.svelte';
import { searchStudentsWithAttendance, updateAttendance } from '$lib/utils';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let students: StudentWithAttendance[];
	export let search: string;

	let list: StudentWithAttendance[];

	$: {
		if (search.length > 0) list = searchStudentsWithAttendance(students, search);
		else list = students;
	}
</script>

{#if students.length > 0}
	{#each list as student (student.attendance?.id)}
		<div class="card varinat-filled-surface md:w-fit w-full h-fit">
			<div class="flex gap-4 justify-center p-2 items-center">
				<div class="flex flex-col gap-2">
					<span class="text-gray-500">{student.student.regis_num}</span>
					<span>{student.student.lastname} {student.student.firstname}</span>
				</div>
				{#if student.attendance}
					<span class="flex flex-col">
						<span class={student.attendance.present ? 'text-success-500' : 'text-error-500'}
							>{student.attendance.present ? 'present' : 'absent'}</span
						>
						<span class={student.attendance.participated ? 'text-success-500' : 'text-error-500'}
							>{student.attendance.participated ? 'participated' : "didn't participat"}</span
						>
					</span>
					<span>
						<Justification attendance={student.attendance}/>
					</span>
				{/if}
			</div>
		</div>
	{/each}
{:else}
	<div class="flex flex-col gap-4 items-center p-6">
		<h2 class="h2 font-bold">Student List Empty</h2>
		<span>Add new Student First</span>
	</div>
{/if}
