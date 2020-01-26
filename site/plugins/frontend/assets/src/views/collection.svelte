<script>
	import { afterUpdate } from 'svelte';
	import { loadData } from '../router/loadData.js';

	export let transcript = false;
	export let view;
	export let classname;

	export let controls = false;
	export let columns = view.columns || 2;

	import CollectionCards from '../components/collection/cards.svelte';
	import CollectionList from '../components/collection/list.svelte';
	import CollectionsGallery from '../components/collection/gallery.svelte';
	let layouts = {
		cards: CollectionCards,
		list: CollectionList,
		gallery: CollectionsGallery
	}
	export let layout = 'cards';
	afterUpdate(() => {
		if( "layout" in view ){
			layout = view.layout;
		}
	});

	let loading = false;

	async function loadNext(){
		
		loading = true;

		let data = await loadData( view.next );

		if( data ){

			loading = false;
			view.next = data.next;
			view.content = view.content.concat( data.content );

		}
	}

	let pageHeight = 100;
	let offset = 4000;
	let container = 0;
	let scrollPos = 0;

	function scrollTrigger(){
		if( view.next === false || loading === true ){
			return;
		}
		scrollPos = container.scrollTop;
		if( scrollPos > ( pageHeight - offset ) ){

			loadNext();

		}
	}

</script>

<style>
	.section--content {
		display: block;
	}
</style>

<section class="{classname} {view.type}" on:scroll|passive={scrollTrigger} bind:this={container}>

	<!--<h3 class="section--header">
		{ view.headline }
	</h3>-->

	<div class="section--content" bind:clientHeight={ pageHeight }>

		<svelte:component this={layouts[layout]} list={view.content} {columns}/>

		{#if view.next || loading === true}
			<div class="load-more">
				{#if loading === true}
					<div class="is-loading"></div>
				{:else}
					<button class="card" on:click={loadNext}>Load more</button>
				{/if}
			</div>
		{/if}

	</div>

	{#if controls }
		<div class="bar controls">

			<div class="left display">
				<span>Display as:</span>
				<button on:click="{() => layout = 'cards'}">Cards</button>
				<button on:click="{() => layout = 'list'}">List</button>
			</div>

			<div class="right info">
				<span>{view.total} Results</span>
			</div>

		</div>
	{/if}

</section>
