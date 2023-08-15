<script lang="ts">
	import { faBars, faGear, faInfo } from '@fortawesome/free-solid-svg-icons';
	import {
		AppBar,
		modalStore,
		type ModalComponent,
		type ModalSettings,
		Drawer,
		drawerStore,
		type DrawerSettings,
		LightSwitch
	} from '@skeletonlabs/skeleton';
	import { Fa } from 'svelte-fa/src/index';
	import Settings from '../Modals/Settings.svelte';
	import SideBar from './SideBar.svelte';
	import { base } from '$app/paths';

	const SettingsModel: ModalComponent = {
		ref: Settings
	};
	const modal: ModalSettings = {
		type: 'component',
		component: SettingsModel
	};
	const sidebar: DrawerSettings = {
		id: 'sidebar',
		width: 'w-fit',
		rounded: 'rounded-none'
	};
</script>

<Drawer>
	<SideBar />
</Drawer>
<AppBar>
	<svelte:fragment slot="lead">
		<div class="flex flex-row gap-2 items-center">
			<button
				class="btn-icon rounded btn-icon-sm bg-initial md:hidden"
				on:click={() => drawerStore.open(sidebar)}
			>
				<Fa icon={faBars} size="lg" />
			</button>
			<a href="/" class="flex gap-2 items-center">
				<img class="w-7" src="{base}/favicon.png" alt="" />
				<strong>Attendance</strong>
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<button
			class="btn-icon btn-icon-sm variant-filled"
			on:click={() => {
				modalStore.trigger(modal);
			}}><Fa icon={faGear} /></button
		>
	</svelte:fragment>
</AppBar>
