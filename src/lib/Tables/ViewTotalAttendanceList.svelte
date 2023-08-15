<script lang="ts">
	import {
		searchStudentsWithAttendance,
		searchStudentsWithTotal,
		updateAttendance
	} from '$lib/utils';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let students: StudentWithTotals[];
	export let search: string[];

	let list: StudentWithTotals[];

	$: {
		if (search.length > 0) list = searchStudentsWithTotal(students, search);
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
					<th>Total Presence</th>
					<th>Total Participation</th>
					<th>Justify absence</th>
				</tr>
			</thead>
			<tbody>
				{#each list as student (student?.id)}
					<tr>
						<td>{student.regis_num}</td>
						<td>{student.firstname}</td>
						<td>{student.lastname}</td>
						<td>{student.presentTotal}</td>
						<td>{student.participationTotal}</td>
						<td>{student.jusAbsTotal}</td>
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
