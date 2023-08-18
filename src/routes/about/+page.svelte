<script lang="ts">
	import { Avatar, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
	import Me from '$lib/asset/me.jpeg';
	import Readme from './app.md';

	let tabSet: number = 0;
</script>

<svelte:head>
	<title>about</title>
</svelte:head>

<div class="p-2 gap-2 h-[89vh] flex flex-col">
	<header class="card variant-ghost-surface flex flex-col p-2 gap-2">
		<div class="">
			<ol class="breadcrumb">
				<li class="crumb"><a class="anchor" href="/">Main Page</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<li>about</li>
			</ol>
		</div>
		<div class="flex md:flex-row gap-4 flex-col items-center justify-center">
			<TabGroup
				justify="justify-center"
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
				flex="flex-1 lg:flex-none"
				rounded=""
				border=""
				class="w-full"
			>
				<Tab bind:group={tabSet} class="bg-surface-500 w-[100px]" name="tab1" value={0}>Creator</Tab
				>
				<Tab bind:group={tabSet} class="bg-surface-500 w-[100px]" name="tab2" value={1}>App</Tab>
			</TabGroup>
		</div>
	</header>
	<article
		class="p-2 card overflow-y-auto flex gap-3 flex-row flex-grow justify-center variant-ghost-surface"
	>
		{#if tabSet === 0}
			<div class="card p-4 w-72 shadow-xl">
				<div class="space-y-4">
					<Avatar src={Me} width="w-16" />
					<div>
						<p class="font-bold">Zaoui Islam</p>
					</div>
					<p>Junior developer.</p>
					<p>Multi-Platform Apps Developer with SvelteKit and .NET MAUI Frameworks</p>
					<div class="flex gap-4">
						<small><strong>Attended Université de M'sila</strong></small>
					</div>
					<a
						class="btn variant-soft w-full space-x-2"
						href="https://www.linkedin.com/in/zaouiislam/"
						target="_blank"
						rel="noreferrer"
					>
						<span>View on</span>
						<Fa icon={faLinkedin} size="lg" />
					</a>
				</div>
				<div class="arrow bg-surface-100-800-token" />
			</div>
		{:else if tabSet === 1}
			<article class="prose">
				<Readme />
			</article>
		{/if}
	</article>
</div>
