<script lang="ts">
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	const lines = ['Attendance', '', 'Tracking', '', 'Now Easier', '🔥'];

	let animate = false;

	onMount(() => {
		animate = true;
	});
</script>

<div class="container h-full mx-auto flex gap-5 flex-col justify-center items-center">
	<div class="md:w-[600px]">
		{#if animate}
			<div class="lines h-fit">
				{#each lines as line, i}
					<div class="overflow p-2">
						<span
							class="line"
							in:fly={{
								y: 100,
								delay: 300 * i,
								easing: backOut
							}}
						>
							{line}
						</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.lines {
		font-size: 45px;
		font-weight: 600;
		text-align: center;

		.overflow {
			display: inline-block;
			overflow: hidden;
			vertical-align: bottom;
		}

		.line {
			display: inline-block;
			margin: 7px 0px 7px 0px;
			text-transform: uppercase;
		}
	}
</style>
