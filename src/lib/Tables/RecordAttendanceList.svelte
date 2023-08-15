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
					<th>Present</th>
					<th>Participated</th>
				</tr>
			</thead>
			<tbody>
				{#each list as student (student.attendance?.id)}
					<tr>
						<td>{student.student.regis_num}</td>
						<td>{student.student.firstname}</td>
						<td>{student.student.lastname}</td>
						{#if student.attendance}
							<td
								><SlideToggle
									name="Present"
									on:change={async () => await updateAttendance(student.attendance)}
									bind:checked={student.attendance.present}
								/></td
							>
							<td
								><SlideToggle
									name="Participated"
									on:change={async () => await updateAttendance(student.attendance)}
									disabled={!student.attendance.present}
									bind:checked={student.attendance.participated}
								/></td
							>
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
