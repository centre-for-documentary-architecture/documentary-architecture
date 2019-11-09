<script>

	export let entity;
	export let tab;
	export let category;

    import CollectionCards from '../collection/cards.svelte';
	import CollectionList from '../collection/list.svelte';
	import CollectionsGallery from '../collection/gallery.svelte';

	let layout = {
		cards: CollectionCards,
		list: CollectionList,
		gallery: CollectionsGallery
	}

	console.log( tab.content[0] );

</script>

{#if category == 'overview' || category == 'tour'}
	<section class="tab invitation">
		{#if category == 'overview'}
			<button class="blue" on:click={window.worldSetRoaming}>Start exploring →</button>
		{:else if category == 'tour'}
			<a class="button blue" on:click={window.navi} href="{tab.content[0].url}" data-template="{tab.content[0].template}">Start promenade →</a>
		<!-- {:else if category == 'tourstop'}
			<button class="blue" on:click={window.worldSetRoaming}>See next →</button>
			-->
		{/if}
	</section>
{/if}

<section class="tab {tab.layout}">

	{#if tab.headline}
    	<h3 class="section--header">{tab.headline}</h3>
	{/if}

    <div class="section--content">

    	<svelte:component this={layout[ tab.layout ]} list={tab.content} category={category}/>

    </div>

</section>
