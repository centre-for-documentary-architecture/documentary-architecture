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
	/*
	import EntityTemplate 	from './templates/entity.svelte';
	import ArchiveTemplate 	from './templates/archive.svelte';
	let templates = {
		// 'html': 	HtmlTemplate,
		'entity': 	EntityTemplate,
		'archive': 	ArchiveTemplate,
	};
	*/

	import { slide } from 'svelte/transition';

</script>

<svelte:window on:popstate={popState}></svelte:window>

<svelte:head>
	<title>CDA {page.title}</title>
</svelte:head>

<HistoryBar />

{#if page.template === 'entity' }
	<div transition:slide="{{duration: 300}}">Entity</div>
{:else if page.template === 'archive'}
	<div transition:slide="{{duration: 300}}">Archive</div>
{/if}

<ArchiveBar />
