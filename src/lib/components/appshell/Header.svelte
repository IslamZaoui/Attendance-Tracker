<script lang="ts">
	import { faGear, faInfo } from '@fortawesome/free-solid-svg-icons';
	import {
		AppBar,
		modalStore,
		type ModalComponent,
		type ModalSettings,
	} from '@skeletonlabs/skeleton';
	import { Fa } from 'svelte-fa/src/index';
	import Settings from '../Modals/Settings.svelte';
	import { base } from '$app/paths';

	const SettingsModel: ModalComponent = {
		ref: Settings
	};
	const modal: ModalSettings = {
		type: 'component',
		component: SettingsModel
	};
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<div class="flex flex-row gap-2 items-center">
			<a href="/" class="flex gap-2 items-center">
				<img class="w-7" src="{base}/favicon.png" alt="" />
				<strong>Attendance Tracker</strong>
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
		<a
			class="btn-icon btn-icon-sm variant-filled md:hidden"
			href="/about" ><Fa icon={faInfo} /></a
		>
	</svelte:fragment>
</AppBar>
