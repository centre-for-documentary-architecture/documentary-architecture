<script>

    export let archive;

	import CollectionCards from './collection/cards.svelte';
	import CollectionList from './collection/list.svelte';
	let layouts = {
		cards: CollectionCards,
		list: CollectionList
	}
	let layout = 'list';

	let loading = false;

	async function loadNext(){
		console.log('load next chunk of collections '+archive.results.next);

		loading = true;
		console.log('please wait...');

		let newData = await load( archive.results.next );

		if( newData ){

			loading = false;
			console.log('loading finished');

			console.log( newData );

			archive.results.next = newData.next;

			archive.results.content = archive.results.content.concat( newData.content );

		}
	}

	let pageHeight = 100;
	let offset = 4000;
	let container = 0;
	let scrollPos = 0;

	function scrollTrigger(){
		// console.log('scroll');
		if( archive.results.next === false || loading === true ){
			console.log('no more');
			return;
		}
		// console.log( scrollPos );
		if( scrollPos > ( pageHeight - offset ) ){

			loadNext();

		}
	}

	async function startSearch(){
		if( searchTerms == previouslySearched ){
			return;
		}
		console.log('research '+searchTerms);

		loading = true;
		// console.log('please wait...');

		let newData = await load( archive.url + '?research='+searchTerms );

		if( newData ){

			loading = false;
			console.log('loading finished from '+newData.url);

			// console.log( newData );

			archive.results = newData.results;

		}

		previouslySearched = searchTerms;

	}

	let searchInput;
	let searchTerms = archive.archive.query;
	let previouslySearched = false;

</script>

<svelte:window on:scroll|passive={scrollTrigger} bind:outerHeight={ pageHeight } bind:scrollY={scrollPos} />

<main class="panel col-sm-3">
	<div class="content">

		<header id="top" class="tab">
			<h1>Archive</h1>

			<form id="search" on:click="{() => searchInput.focus() }" autocomplete="off">
				<input class="input" type="search" name="research"
					autocomplete="off"
					autofocus
					bind:value={searchTerms}
					placeholder="Type here to research the archive ..."
					bind:this={searchInput}
					on:keyup={startSearch} >
				<button class="button" value="Search" title="Research {searchTerms}">Research</button>
			</form>

			<div class="options">
				{#each archive.archive.filters.filters as filter}
					<button>{filter.title}</button>
				{/each}
			</div>

		</header>

	</div>
</main>

<section class="darks col-sm-9 {archive.type}">

	<div class="section--content">

		<svelte:component this={layouts[layout]} list={archive.results.content} columns=3/>

		{#if loading === true}
			<div class="bar mono">
				<span class="message">Please wait...</span>
			</div>
		{:else if archive.next}
			<button class="card" on:click={loadNext}>Load more</button>
		{/if}

	</div>

	<div class="bar">

		<div class="left display">
			<span>Display as: </span>
			<button on:click="{() => layout = 'cards'}">Cards</button>
			<button on:click="{() => layout = 'list'}">List</button>
		</div>

		<div class="right info">
			<span>{archive.results.total} Results</span>
		</div>

	</div>

</section>
