<script lang="ts">
	import { Fa } from 'svelte-fa/src/index';
	import { page } from '$app/stores';
	import { AppRail, AppRailAnchor, AppRailTile } from '@skeletonlabs/skeleton';
	import { faHome, faInfo, faList, faUserGroup } from '@fortawesome/free-solid-svg-icons';
</script>

<AppRail>
	<svelte:fragment slot="lead">
		<AppRailAnchor href="/" selected={$page.url.pathname === '/'}>
			<svelte:fragment slot="lead"><Fa icon={faHome} /></svelte:fragment>
			<span>Home</span>
		</AppRailAnchor>
	</svelte:fragment>
	<AppRailAnchor href="/groups" selected={$page.url.pathname.startsWith('/groups')}>
		<svelte:fragment slot="lead"><Fa icon={faUserGroup} /></svelte:fragment>
		<span>Groups</span>
	</AppRailAnchor>
	<AppRailAnchor href="/attendance" selected={$page.url.pathname.startsWith('/attendance')}>
		<svelte:fragment slot="lead"><Fa icon={faList} /></svelte:fragment>
		<span>Attendance</span>
	</AppRailAnchor>
	<!-- --- -->
	<svelte:fragment slot="trail">
		<AppRailAnchor href="/about" selected={$page.url.pathname.startsWith('/about')}>
			<svelte:fragment slot="lead"><Fa icon={faInfo} /></svelte:fragment>
			<span>About</span>
		</AppRailAnchor>
	</svelte:fragment>
</AppRail>
