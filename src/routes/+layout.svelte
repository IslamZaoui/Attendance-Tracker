<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import {
		AppShell,
		Modal,
		TabAnchor,
		TabGroup,
		type ModalSettings,
		modalStore
	} from '@skeletonlabs/skeleton';
	import Header from '$lib/components/appshell/Header.svelte';
	import SideBar from '$lib/components/appshell/SideBar.svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	import { Toaster } from 'svelte-french-toast';
	import Transition from '$lib/components/transition.svelte';
	import { page } from '$app/stores';
	import { faHome, faList, faUserGroup } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { App } from '@capacitor/app';
	import { browser } from '$app/environment';

	if (browser)
		App.addListener('backButton', async () => {
			if ($page.url.pathname === '/') {
				const modal: ModalSettings = {
					type: 'confirm',
					title: 'Exiting',
					body: 'Are you want to exit the app?',
					response: (r: boolean) => {
						if (r) {
							App.exitApp();
						}
					}
				};
				modalStore.trigger(modal);
			} else {
				window.history.back();
			}
		});

	export let data;
</script>

<Toaster />
<Modal />
<main class="mainlayout h-full">
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
		<svelte:fragment slot="footer">
			<div class="md:hidden">
				<TabGroup
					justify="justify-center"
					active="variant-filled-primary"
					hover="hover:variant-soft-primary"
					flex="flex-1 lg:flex-none"
					rounded=""
					border=""
					class="bg-surface-100-800-token w-full"
				>
					<TabAnchor href="/" selected={$page.url.pathname === '/'}>
						<svelte:fragment slot="lead"
							><div class="flex justify-center"><Fa icon={faHome} /></div></svelte:fragment
						>
						<span>Home</span>
					</TabAnchor>
					<TabAnchor href="/groups" selected={$page.url.pathname.startsWith('/groups')}>
						<svelte:fragment slot="lead"
							><div class="flex justify-center"><Fa icon={faUserGroup} /></div></svelte:fragment
						>
						<span>Groups</span>
					</TabAnchor>
					<TabAnchor href="/attendance" selected={$page.url.pathname.startsWith('/attendance')}>
						<svelte:fragment slot="lead"
							><div class="flex justify-center"><Fa icon={faList} /></div></svelte:fragment
						>
						<span>Attendance</span>
					</TabAnchor>
				</TabGroup>
			</div>
		</svelte:fragment>
	</AppShell>
</main>
