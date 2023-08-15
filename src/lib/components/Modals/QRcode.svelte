<script lang="ts">
	import {
		GetStudentByRig_num,
		RecordStudnetAtt,
		SetStudentParticipation,
		ShowToast,
		sleep
	} from '$lib/utils';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { Html5Qrcode } from 'html5-qrcode';
	import { onDestroy, onMount } from 'svelte';

	export let groupid: number;
	export let session: number;

	let ScannedStudent: Student | undefined = undefined;
	let ScanStatus: 'fail' | 'success' | 'standby' = 'standby';

	let participated = false;

	let scanning = false;

	let html5Qrcode: Html5Qrcode;

	onMount(async () => {
		init();
	});

	function init() {
		html5Qrcode = new Html5Qrcode('reader');
	}

	function start() {
		html5Qrcode.start(
			{ facingMode: 'environment' },
			{
				fps: 10,
				qrbox: { width: 250, height: 250 }
			},
			onScanSuccess,
			onScanFailure
		);
		scanning = true;
	}

	async function stop() {
		await html5Qrcode.stop();
		scanning = false;
		ScanStatus = 'standby';
	}

	async function onScanSuccess(decodedText: any) {
		const student = await GetStudentByRig_num(decodedText, groupid);
		if (student !== null && student.id) {
			ScannedStudent = student;
			if (await RecordStudnetAtt(student.id, session)) ScanStatus = 'success';
			else ScanStatus = 'fail';
		} else {
			ScannedStudent = undefined;
			ScanStatus = 'fail';
		}
		await sleep(2000);
	}

	function onScanFailure(error: any) {}

	onDestroy(() => {
		if (scanning) {
			stop();
		}
	});
</script>

<main class="card h-fit flex-grow p-1 flex md:flex-row flex-col items-start justify-start gap-2">
	<reader id="reader" class="relative min-w-[250px] w-full md:w-1/2 min-h-[250px] bg-black">
		{#if scanning}
			<button class="btn variant-filled-error absolute top-0 right-0 m-2 z-10" on:click={stop}
				>stop</button
			>
		{:else}
			<button class="btn variant-filled-success absolute top-0 right-0 m-2 z-10" on:click={start}
				>start</button
			>
		{/if}
	</reader>
	<div class="p-4 flex flex-col gap-2">
		{#if !ScannedStudent && ScanStatus === 'standby'}
			<span>Start the scanner and Scan your students QRcodes</span>
		{:else if ScannedStudent && ScanStatus === 'success'}
			<h4 class="h4 text-success-500">Student Set to Preset</h4>
			<span>Scanned student: {ScannedStudent.lastname} {ScannedStudent.firstname}</span>
			<span>Rigistration Number: {ScannedStudent.regis_num}</span>
			<div class="flex items-center gap-2">
				<span class="text-secondary-500">Participation: </span>
				<SlideToggle
					name="participation"
					active="bg-primary-500"
					bind:checked={participated}
					on:change={() => {
						if (ScannedStudent && ScannedStudent.id)
							SetStudentParticipation(ScannedStudent.id, session, participated);
					}}
				/>
			</div>
		{:else}
			<span class="text-error-500">Scanned student Does not exist</span>
		{/if}
	</div>
</main>
