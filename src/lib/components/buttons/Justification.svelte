<script lang="ts">
	import { updateAttendance } from '$lib/utils';

	export let attendance: Attendance | undefined;
</script>

{#if attendance}
	<button
		class="btn rounded-sm text-sm {attendance.jus_abs ? 'variant-filled-success' : 'variant-filled-error'}"
		on:click={async () => {
			if (attendance) {
				attendance.jus_abs = !attendance.jus_abs;
				await updateAttendance(attendance);
			}
		}}
		disabled={attendance.present}
	>
		{attendance.jus_abs ? 'Jus' : 'unJus'}
	</button>
{/if}
