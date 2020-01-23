<script>

	import Link from './router/Link.svelte';
	import HistoryBar from './components/navigation/history.svelte';
	import ArchiveBar from './components/navigation/archive.svelte';

	import { slide } from 'svelte/transition';

	import { loadPage } from './router/loadPage.js';
	import { popState } 	from './router/popState.js';

	import { onMount } 		from 'svelte';
	onMount(async () => {
		loadPage();
	});

	let page;
	import { pageStore } 	from './router/pageStore.js';
  const unsubscribe = pageStore.subscribe(value => {
		page = value;
		console.log( value );
  });

	// import HtmlTemplate 	from './templates/html.svelte';
	/*
	import EntityTemplate 	from './templates/entity.svelte';
	import ArchiveTemplate 	from './templates/archive.svelte';
	let templates = {
		// 'html': 	HtmlTemplate,
		'entity': 	EntityTemplate,
		'archive': 	ArchiveTemplate,
	};
	*/

</script>

<svelte:window on:popstate={popState}></svelte:window>

<svelte:head>
	<title>CDA {page.title}</title>
</svelte:head>

<HistoryBar />

<div>{page.loading || 'loaded'}</div>

{#if page.template === 'entity' }
	<div transition:slide="{{duration: 300}}">Entity: {page.title}</div>
{:else if page.template === 'archive'}
	<div transition:slide="{{duration: 300}}">Archive</div>
{/if}

<Link template="entity" title="Matter of Data" url="http://localhost:8000/archive/publications/the-matter-of-data" />
<Link template="entity" title="Dust aaaand Data" url="http://localhost:8000/archive/publications/dust-data" />
<Link template="entity" title="Stealing Spaces" url="http://localhost:8000/archive/publications/stealing-spaces" />

<ArchiveBar />
