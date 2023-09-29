<script lang="ts">
	import { SelectedGroup, SelectedStudent } from '$lib/Store';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import StudentInfo from '$lib/components/StudentInfo.svelte';

	let PageLoaded = false;

	let student: Student = <Student>{};
	let group: Group = <Group>{};

	onMount(async () => {
		if ($SelectedGroup && $SelectedGroup.id && $SelectedStudent && $SelectedStudent.id) {
			student = $SelectedStudent;
			group = $SelectedGroup;
			PageLoaded = true;
		}
	});
</script>

<svelte:head>
	<title>Student Info | {student.regis_num}</title>
</svelte:head>

<div class="p-2 gap-3 h-full flex flex-col">
	<article
		class="p-2 card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if PageLoaded}
			<StudentInfo {student} />
		{:else}
			<Loading />
		{/if}
	</article>
</div>
