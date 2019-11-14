<script>

	export let archive;

	import ViewCollection from './views/collection.svelte';
	import Card from './collection/card.svelte';
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
		if( searchTerm == previouslySearched ){
			return;
		}
		// console.log('research '+searchTerm);

		loading = true;
		// console.log('please wait...');

		let newData = await load( archive.url + '?research='+searchTerm );

		if( newData ){

			loading = false;
			// console.log('loading finished from '+newData.url);

			// console.log( newData );

			archive.results = newData.results;

		}

		previouslySearched = searchTerm;

	}

	let searchField;
	let searchTerm = archive.archive.query;
	let previouslySearched = false;

	let filter = archive.archive.filter;

</script>

<main class="panel col-sm-3">
	<div class="content">

		<header id="top" class="tab">
			<h1>Archive</h1>

			<form id="search" on:click="{() => searchField.focus() }" autocomplete="off">
				<input class="input" type="search" name="research"
					autocomplete="off"
					spellcheck="false"
					autocorrect="off"
					bind:value={searchTerm}
					aria-label="Search the archive ..."
					placeholder="Search the archive ..."
					bind:this={searchField}
					on:keyup={startSearch} >
				<!-- {#if searchTerm}
					<button class="button" value="Search" title="Search {searchTerm}">Start search</button>
				{/if} -->
			</form>

		</header>

		<section class="filters tab">
			<h2>Filter</h2>
			<ul class="list">
				{#each archive.archive.filters.content as item}
					<Card item={item} classname={filter == item.filter ? 'active' : ''}/>
					<!--
					<li class="card">
						<a class="button {filter == item.filter ? 'active' : ''}" on:click={window.navi} on:click={() => filter = item.filter} href={item.url} data-template="archive">
							<h4 class="title">{item.title}</h4>
						</a>
					</li>
					-->
				{/each}
			</ul>
		</section>

	</div>
</main>

<ViewCollection view={archive.results} classname="presentation panel col-sm-9" controls={true} columns=3/>
