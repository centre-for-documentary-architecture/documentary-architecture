<script>

	export let archive;

	import ViewCollection from './views/collection.svelte';

	/*
	import CollectionCards from './collection/cards.svelte';
	import CollectionList from './collection/list.svelte';
	let layouts = {
		cards: CollectionCards,
		list: CollectionList
	}
	let layout = 'list';
	*/

	let loading = false;

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

<ViewCollection view={archive.results} classname="presentation panel col-sm-9" controls={true}/>
