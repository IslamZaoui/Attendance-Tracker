<script lang="ts">
	import { page } from '$app/stores';
	import { ExportDB, ImportDB } from '$lib/utils';
	let files: any;
	import { FileButton, modalStore } from '@skeletonlabs/skeleton';
</script>

{#if $modalStore[0]}
	<div class="card p-1 md:w-1/2 flex flex-col gap-2">
		<header class="text-center">
			<strong class="h3">Settings</strong>
		</header>
		<div class="flex flex-col gap-4 p-4 overflow-y-auto h-[350px]">
			<div class="card variant-filled-surface">
				<header class="h3 font-semibold card-header">Database</header>
				<div class="p-4 flex flex-col gap-2">
					<button
						class="btn variant-filled"
						on:click={async () => ExportDB($page.data.currentPlatform)}>Export Database</button
					>
					<FileButton
						name="files"
						bind:files
						accept=".json"
						width="w-full"
						on:change={async () => ImportDB(files[0])}>Import Database</FileButton
					>
				</div>
			</div>
			<div class="card variant-filled-surface">
				<header class="h3 font-semibold card-header">Themes</header>
				<div class="p-4 flex flex-col gap-2 justify-center">
					<div class="flex gap-2">
						<sapn>themes:</sapn>
						<select class="input">
							<option value="">Main Theme</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
