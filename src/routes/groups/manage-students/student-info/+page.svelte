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

<div class="p-2 gap-3 h-[89vh] flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<div class="">
			<ol class="breadcrumb">
				<li class="crumb"><a class="anchor" href="/">Main Page</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li class="crumb"><a class="anchor" href="/groups">Groups</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li class="crumb">
					<a class="anchor" href="/groups/manage-students">Manage Student | Group {group?.name}</a>
				</li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li>Student Info | {student.regis_num}</li>
			</ol>
		</div>
		<div class="flex md:flex-row gap-2 flex-col" />
	</header>
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
