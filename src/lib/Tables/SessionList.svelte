<script lang="ts">
	import { SelectedSession } from '$lib/Store';
	import { type PopupSettings, popup, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	export let Sessions: Session[];
	let comboboxValue: Session = <Session>{};

	$: SelectedSession.set(comboboxValue);

	const popupCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	// Set the initial value of comboboxValue to the first element in Sessions
	$: {
		if (Sessions.length > 0 && !comboboxValue) {
			comboboxValue = Sessions[0];
		}
	}
</script>

<button class="btn variant-filled justify-between" use:popup={popupCombobox}>
	<span class="capitalize text-sm">{comboboxValue?.id ?? 'Select Session'}</span>
	<span>↓</span>
</button>

<div
	class="card w-48 overflow-y-auto shadow-xl h-[200px] py-2 text-center"
	data-popup="popupCombobox"
>
	{#if Sessions.length > 0}
		<ListBox rounded="rounded-none">
			{#each Sessions as session (session.id)}
				<ListBoxItem bind:group={comboboxValue} name="medium" value={session}
					>Session {session.id}</ListBoxItem
				>
			{/each}
		</ListBox>
	{:else}
		<span class="">No Sessions</span>
	{/if}
	<div class="arrow bg-surface-100-800-token" />
</div>
