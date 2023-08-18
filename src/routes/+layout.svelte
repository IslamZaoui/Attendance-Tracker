<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { AppShell, Modal } from '@skeletonlabs/skeleton';
	import Header from '$lib/components/appshell/Header.svelte';
	import SideBar from '$lib/components/appshell/SideBar.svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	import { Toaster } from 'svelte-french-toast';
	import Transition from '$lib/components/transition.svelte';

	export let data;
</script>

<main class="mainlayout h-full">
	<Toaster />
	<Modal />
	<AppShell>
		<svelte:fragment slot="header">
			<Header />
		</svelte:fragment>
		<svelte:fragment slot="sidebarLeft">
			<div class="hidden md:block h-full">
				<SideBar />
			</div>
		</svelte:fragment>
		<Transition url={data.url}>
			<slot />
		</Transition>
	</AppShell>
</main>
