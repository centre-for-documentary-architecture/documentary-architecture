<script>
	import { slide } from 'svelte/transition';

	import HistoryBar from './components/navigation/historyBar.svelte';
	import ArchiveBar from './components/navigation/archiveBar.svelte';
	import ArchiveTemplate from './templates/archive.svelte';
	import EntityTemplate from './templates/entity.svelte';
	import LieblingHouse from './liebling-house/template.svelte';

	import { loadPage } from './router/loadPage.js';
	import { popState } from './router/popState.js';
	import { clickAnyLink } from './router/clickAnyLink.js';

	import { onMount } from 'svelte';
	onMount(async () => {
		loadPage();
	});

	let page = {};
	import { pageStore } from './router/pageStore.js';
  const unsubscribe = pageStore.subscribe(value => {
		for (var prop in value) {
			if( value[prop] !== page[prop] ){
				page[prop] = value[prop];
			}
		}
		// page = value;
		console.log( page );
  });

</script>

<svelte:window on:popstate={popState} on:click={clickAnyLink}></svelte:window>

<svelte:head>
	<title>CDA {page.title}</title>
</svelte:head>

<HistoryBar />

<!-- {#if page.loading }
	Page loading.<br />
	Title: {page.title || '?'}<br />
	Url: {page.url || '?'}<br />
	Template: {page.template || '?'}<br />
	Worlditem: {page.worlditem || '?'}
{/if} -->

{#if page.template === 'html' }

	<div>
		{@html page.html}
	</div>

{:else if page.template === 'entity' }

	{#if page.view && page.view.type === 'liebling-house'}
		<LieblingHouse {page} />
	{:else}
		<EntityTemplate {page} />
	{/if}

	<ArchiveBar {page} />

{:else if page.template === 'archive' }

	<ArchiveTemplate {page} />

{:else}

	{#if page.loading}<div class="is-loading"></div>{/if}

{/if}
