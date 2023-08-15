<script lang="ts">
	import { searchStudentsWithAttendance, updateAttendance } from '$lib/utils';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let students: StudentWithAttendance[];
	export let search: string[];

	let list: StudentWithAttendance[];

	$: {
		if (search.length > 0) list = searchStudentsWithAttendance(students, search);
		else list = students;
	}
</script>

{#if students.length > 0}
	<div class="table-container w-fit">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Registration number</th>
					<th>Firstname</th>
					<th>Lastname</th>
					<th>Attendance</th>
					<th>Justify absence</th>
				</tr>
			</thead>
			<tbody>
				{#each list as student (student.attendance?.id)}
					<tr>
						<td>{student.student.regis_num}</td>
						<td>{student.student.firstname}</td>
						<td>{student.student.lastname}</td>
						{#if student.attendance}
							<td class="flex flex-col">
								<span class={student.attendance.present ? 'text-success-500' : 'text-error-500'}
									>{student.attendance.present ? 'present' : 'absent'}</span
								>
								<span
									class={student.attendance.participated ? 'text-success-500' : 'text-error-500'}
									>{student.attendance.participated ? 'participated' : "didn't participat"}</span
								>
							</td>
							<td>
								<SlideToggle
									name="jus_abs"
									on:change={async () => await updateAttendance(student.attendance)}
									disabled={student.attendance.present}
									bind:checked={student.attendance.jus_abs}
								/>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th colspan="2">Total Students: {students.length}</th>
				</tr>
			</tfoot>
		</table>
	</div>
{:else}
	<div class="flex flex-col gap-4 items-center p-6">
		<h2 class="h2 font-bold">Student List Empty</h2>
		<span>Add new Student First</span>
	</div>
{/if}
