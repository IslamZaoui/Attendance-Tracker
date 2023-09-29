<script lang="ts">
	import { updateAttendance } from '$lib/utils';

	export let attendance: Attendance | undefined;
</script>

{#if attendance}
	<button
		class="btn rounded-sm text-sm {attendance.present
			? 'variant-filled-success'
			: 'variant-filled-error'}"
		on:click={async () => {
			if (attendance) {
				attendance.present = !attendance.present;
				if (!attendance.present) attendance.participated = false;
				await updateAttendance(attendance);
			}
		}}
	>
		{attendance.present ? 'Pre' : 'Abs'}
	</button>
	<button
		class="btn rounded-sm text-sm {attendance.participated
			? 'variant-filled-success'
			: 'variant-filled-error'}"
		disabled={!attendance.present}
		on:click={async () => {
			if (attendance) {
				attendance.participated = !attendance.participated;
				await updateAttendance(attendance);
			}
		}}
	>
		{attendance.participated ? 'Part' : 'Not Part'}
	</button>
{/if}
