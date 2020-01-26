<script>
	import { slide } from 'svelte/transition';

	import HistoryBar from './components/navigation/historyBar.svelte';
	// import HtmlTemplate from './templates/html.svelte';
	import EntityTemplate from './templates/entity.svelte';
	import ArchiveTemplate from './templates/archive.svelte';
	import ArchiveBar from './components/navigation/archiveBar.svelte';

	import { loadPage } from './router/loadPage.js';
	import { popState } from './router/popState.js';

	import { onMount } from 'svelte';
	onMount(async () => {
		loadPage();
	});

	let page;
	import { pageStore } from './router/pageStore.js';
  const unsubscribe = pageStore.subscribe(value => {
		page = value;
		console.log( value );
  });

</script>

<svelte:window on:popstate={popState}></svelte:window>

<svelte:head>
	<title>CDA {page.title}</title>
</svelte:head>

<HistoryBar />

{#if page.loading }
	Page loading.<br />
	Title: {page.title || '?'}<br />
	Url: {page.url || '?'}<br />
	Template: {page.template || '?'}<br />
	Worlditem: {page.worlditem || '?'}
{/if}

{#if page.template === 'entity' }
	<EntityTemplate {page} />
	<ArchiveBar {page} />
{:else if page.template === 'archive' }
	<ArchiveTemplate {page} />
{:else if page.html }
	{@html page.html}
{/if}
