<script lang="ts">
	import { searchStudentsWithTotal } from '$lib/utils';

	export let students: StudentWithTotals[];
	export let search: string;

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
					<th>Student</th>
					<th>Total Unjustified absence</th>
					<th>Total Participation</th>
				</tr>
			</thead>
			<tbody>
				{#each list ?? [] as student (student?.id)}
					<tr>
						<td><div class="flex flex-col gap-1">
							<span class="text-gray-500">{student.regis_num}</span>
							<span>{student.lastname} {student.firstname}</span>
						</div></td>
						<td>{student.unjustifiedAbsencesTotal}</td>
						<td>{student.participationTotal}</td>
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
