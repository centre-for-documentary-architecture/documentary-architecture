<script>

	export let view;
	export let classname;

	export let columns = 2;

	import CollectionCards from '../collection/cards.svelte';
	import CollectionList from '../collection/list.svelte';
	import CollectionsGallery from '../collection/gallery.svelte';
	let layout = {
		cards: CollectionCards,
		list: CollectionList,
		gallery: CollectionsGallery
	}

	let loading = false;

	async function loadNext(){
		console.log('load next chunk of collections '+view.next);

		loading = true;
		console.log('please wait...');

		let newData = await load( view.next );

		if( newData ){

			loading = false;
			console.log('loading finished');

			console.log( newData );

			view.next = newData.next;

			view.content = view.content.concat( newData.content );

		}
	}

	let pageHeight = 100;
	let offset = 4000;
	let container = 0;
	let scrollPos = 0;

	function scrollTrigger(){
		// console.log('scroll');
		if( view.next === false || loading === true ){
			console.log('no more');
			return;
		}
		// console.log('scrollll');
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
	button {
		width: 100%;
	}
</style>

<section class="{classname} {view.type}" on:scroll|passive={scrollTrigger} bind:this={container}>

	<h3 class="section--header">
		{ view.headline }
	</h3>

	<div class="section--content" bind:clientHeight={ pageHeight }>

		<svelte:component this={layout[view.layout]} list={view.content} {columns}/>

		{#if loading === true}
			<div class="bar mono">
				<span class="message">Please wait...</span>
			</div>
		{:else if view.next}
			<button class="card" on:click={loadNext}>Load more</button>
		{/if}

	</div>

</section>
