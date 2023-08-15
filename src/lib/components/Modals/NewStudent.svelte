<script lang="ts">
	export let parent: any;
	import { modalStore } from '@skeletonlabs/skeleton';
	import { NewStudentSchema } from '$lib/validation';
	import db from '$lib/DB';
	import toast from 'svelte-french-toast';
	import { fromZodError } from 'zod-validation-error';
	import { ShowToast } from '$lib/utils';

	let NewStudent: Student = {
		regis_num: '',
		firstname: '',
		lastname: '',
		groupid: $modalStore[0].meta.group.id
	};

	async function onFormSubmit() {
		try {
			const res = NewStudentSchema.safeParse(NewStudent);
			console.log(res);
			if (res.success) {
				await db.students.add(res.data);
				ShowToast('success', `Student ${res.data.lastname} successfully added.`);
			} else {
				ShowToast('error', fromZodError(res.error).message);
			}
		} catch (error) {
			ShowToast('error', `Failed to add Group ${NewStudent.lastname}`);
			console.error(`Failed to add Group ${NewStudent.lastname}`, error);
		}
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<header class="text-2xl font-bold">New Student</header>
		<article>add student to group {$modalStore[0].meta.group.name}</article>
		<form class="p-4 space-y-4">
			<label class="label">
				<span>Registration Number</span>
				<input
					class="input"
					type="text"
					bind:value={NewStudent.regis_num}
					minlength="4"
					maxlength="20"
					placeholder="Enter Registration Number..."
				/>
			</label>
			<label class="label">
				<span>Firstname</span>
				<input
					class="input"
					type="text"
					minlength="4"
					maxlength="40"
					bind:value={NewStudent.firstname}
					placeholder="Enter Firstname..."
				/>
			</label>
			<label class="label">
				<span>Lastname</span>
				<input
					class="input"
					type="email"
					minlength="4"
					maxlength="40"
					bind:value={NewStudent.lastname}
					placeholder="Enter Lastname..."
				/>
			</label>
			<footer class="modal-footer {parent.regionFooter}">
				<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
					>{parent.buttonTextCancel}</button
				>
				<button class="btn {parent.buttonPositive}" on:click={async () => onFormSubmit()}
					>Add Student</button
				>
			</footer>
		</form>
	</div>
{/if}
