<script lang="ts">
	import {
	ChangeFirstname,
		ChangeGroup,
		ChangeLasttname,
		GetTotalStudentPresense,
		getGroups,
		getTotalAbsencesWithoutJustification
	} from '$lib/utils';
	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa/src/fa.svelte';

	export let student: Student;
	let groups: Group[] = [];

	let lastname = student.firstname;
	let firstname = student.lastname;
	let groupid = student.groupid;

	let totalAbswithoutjus = 0;
	let totalPresense = 0;

	onMount(async () => {
		if (student.id) {
			groups = await getGroups();
			totalAbswithoutjus = await getTotalAbsencesWithoutJustification(student.id);
			totalPresense = await GetTotalStudentPresense(student.id);
		}
	});
</script>

<div class="card overflow-auto sm:w-[350px] w-full">
	<header class="card-header text-center h4 font-bold">{student.lastname} Info</header>
	<div class="p-4 space-y-2">
		<label class="label">
			<span>Registration Number</span>
			<div class="input-group input-group-divider grid-cols-[1fr_auto]">
				<input type="text" value={student.regis_num} readonly />
				<a href="#" title="Can't be change" class="text-warning-900">
					<span class="animated-icon"><Fa icon={faCircleExclamation} /></span>
				</a>
			</div>
		</label>
		<label class="label">
			<span>Firstname</span>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<input type="text" placeholder="Example" bind:value={firstname} />
				<button class="variant-filled-secondary" on:click={()=>ChangeFirstname(firstname,student.id)}>change</button>
			</div>
		</label>
		<label class="label">
			<span>Lastname</span>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<input type="text" placeholder="Example" bind:value={lastname} />
				<button class="variant-filled-secondary" on:click={()=>ChangeLasttname(lastname,student.id)}>change</button>
			</div>
		</label>
		<label class="label">
			<span>Group</span>
			<div class="input-group flex-row flex">
				<select class="select" bind:value={groupid}>
					{#each groups as group (group.id)}
						<option value={group.id}>{group.name}</option>
					{/each}
				</select>
				<button class="variant-filled-secondary" on:click={()=>ChangeGroup(groupid,student.id)}>change</button>
			</div>
		</label>
	</div>
	<footer class="card-footer space-y-2">
		<header class="text-center h4 font-bold">{student.lastname} Stats</header>
		<label class="label">
			<span>Total Absences without Justification</span>
			<div class="input-group input-group-divider grid-cols-[1fr_auto]">
				<input type="text" value={totalAbswithoutjus} readonly />
				<a
					href="#"
					title={totalAbswithoutjus < 3 ? 'Good' : 'Excluded'}
					class={totalAbswithoutjus < 3 ? 'text-success-500' : 'text-warning-500'}
				>
					<span class={totalAbswithoutjus < 3 ? '' : 'animated-icon'}
						><Fa icon={faCircleExclamation} /></span
					>
				</a>
			</div>
		</label>
		<label class="label">
			<span>Total Presene</span>
			<input class="input" type="text" placeholder="Example" value={totalPresense} />
		</label>
	</footer>
</div>

<style>
	@keyframes fade-in-out {
		0%,
		100% {
			opacity: 0.2;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	@keyframes beat {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}
	.animated-icon {
		animation: fade-in-out 1.5s ease-in-out infinite, beat 1.5s ease-in-out infinite;
		display: inline-block;
	}
</style>
