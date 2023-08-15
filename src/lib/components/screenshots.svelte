<script lang="ts">
	import { base } from '$app/paths';

	let elemCarousel: HTMLDivElement;
	const unsplashIds = [
		'screenshot1',
		'screenshot2',
		'screenshot3',
		'screenshot4',
		'screenshot5',
		'screenshot6'
	];
</script>

<div class="snap-x snap-mandatory scroll-smooth flex gap-4 overflow-x-auto">
	{#each unsplashIds as img, i}
		<img class="snap-start shrink-0 w-[200px]" src="{base}/screenshots/{img}.jpg" alt={img} />
	{/each}
</div>
