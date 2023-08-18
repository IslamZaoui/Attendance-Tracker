<script lang="ts">
	import { DeleteStudent, GotoStudentInfo, searchStudents } from '$lib/utils';

	export let students: Student[];
	export let search: string[];
	export let group: Group;

	let list: Student[];

	$: {
		if (search.length > 0) list = searchStudents(students, search);
		else list = students;
	}
</script>

{#if students.length > 0}
	<div class="table-container md:w-1/2 w-full flex flex-col gap-2">
		<!--
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Registration number</th>
					<th>Firstname</th>
					<th>Lastname</th>
					<th colspan="2" />
				</tr>
			</thead>
			<tbody>
				{#each list as student (student.id)}
					<tr>
						<td>{student.regis_num}</td>
						<td>{student.firstname}</td>
						<td>{student.lastname}</td>
						<td class="flex flex-col md:flex-row gap-2">
							<button
								class="chip chip-sm variant-ghost-success"
								on:click={() => {
									GotoStudentInfo(student, group);
								}}>Student Info</button
							>
							<button
								class="chip chip-sm variant-ghost-error"
								on:click={() => {
									DeleteStudent(student);
								}}>Delete Student</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th colspan="2">Total Students: {students.length}</th>
				</tr>
			</tfoot>
		</table>
	-->
		{#each list as student (student.id)}
			<div class="card flex">
				<div class="p-2 w-full flex flex-col gap-1">
					<span>{student.lastname} {student.firstname}</span>
					<span class='text-gray-500'>{student.regis_num}</span>
				</div>
				<div class="p-2 flex flex-col gap-1 w-full justify-end">
					<button
						class="chip chip-sm variant-ghost-success"
						on:click={() => {
							GotoStudentInfo(student, group);
						}}>Student Info</button
					>
					<button
						class="chip chip-sm variant-ghost-error"
						on:click={() => {
							DeleteStudent(student);
						}}>Delete Student</button
					>
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
