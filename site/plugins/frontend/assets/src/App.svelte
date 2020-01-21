<script>

	import { navigateTo } from './router/navigateTo.js';
	import { popState } 	from './router/popState.js';

	import { onMount } 		from 'svelte';
	onMount(async () => {
		navigateTo( window.location.href );
	});

	let page;
	import { pageStore } 	from './router/pageStore.js';
  const unsubscribe = pageStore.subscribe(value => {
		console.log( value );
		page = value;
  });

	import HistoryBar from './components/navigation/history.svelte';
	import ArchiveBar from './components/navigation/archive.svelte';

	// import HtmlTemplate 	from './templates/html.svelte';
	import EntityTemplate 	from './templates/entity.svelte';
	import ArchiveTemplate 	from './templates/default.svelte';

	let templates = {
		// 'html': 	HtmlTemplate,
		'entity': 	EntityTemplate,
		'archive': 	ArchiveTemplate,
	};

</script>

<svelte:window on:popstate={popState}></svelte:window>

<svelte:head>
	<title>CDA {page.title}</title>
</svelte:head>

<HistoryBar />

{#if page.template === 'entity' }
	<div>Entity</div>
{:else if page.template === 'archive'}
	<div>Archive</div>
{/if}

<ArchiveBar />
