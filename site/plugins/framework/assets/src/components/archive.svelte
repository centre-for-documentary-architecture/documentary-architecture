<script>

	export let archive;

	import ViewCollection from './views/collection.svelte';
	import CollectionList from './collection/list.svelte';

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

	let filter = archive.archive.filter;

</script>

<main class="panel col-sm-3">
	<div class="content">

		<header id="top" class="tab">
			<h1>Archive</h1>

			<form id="search" on:click="{() => searchInput.focus() }" autocomplete="off">
				<input class="input" type="search" name="research"
					autocomplete="off"
					spellcheck="false"
					autocorrect="off"
					bind:value={searchTerms}
					aria-label="Search the archive ..."
					placeholder="Search the archive ..."
					bind:this={searchInput}
					on:keyup={startSearch} >
				<!-- {#if searchTerms}
					<button class="button" value="Search" title="Search {searchTerms}">Start search</button>
				{/if} -->
			</form>

		</header>

		<section class="filters tab">
			<h2>Filter</h2>
			<ul class="list">
				{#each archive.archive.filters.content as item}
					<li class="card">
						<a class="button {filter == item.filter ? 'active' : ''}" on:click={navi} href={item.url} data-template="archive">
							<h4 class="title">{item.title}</h4>
						</a>
					</li>
				{/each}
			</ul>
		</section>

	</div>
</main>

<ViewCollection view={archive.results} classname="presentation panel col-sm-9" controls={true}/>
