<script>
	import { loading } from './helpers/loader.js';
	import Wait from './helpers/wait.svelte';

	export let archive;

	import ViewCollection from './views/collection.svelte';
	import Card from './collection/card.svelte';
	import CollectionList from './collection/list.svelte';

	let loadingQuery = false;

	async function startSearch(){
		if( searchTerm == previouslySearched ){
			return;
		}
		// console.log('research '+searchTerm);

		loadingQuery = true;
		// console.log('please wait...');

		let newData = await load( archive.url + '?research='+searchTerm );

		if( newData ){

			loadingQuery = false;
			// console.log('loadingQuery finished from '+newData.url);

			// console.log( newData );

			archive.results = newData.results;

		}

		previouslySearched = searchTerm;

	}

	let searchField;
	let searchTerm = archive.archive.query;
	let previouslySearched = false;

	$: filter = archive.archive.filter;

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
				{/each}
			</ul>
		</section>

	</div>
</main>

{#if $loading === true}
	<Wait />
{/if}

<ViewCollection view={archive.results} classname="presentation panel col-sm-9" controls={true} columns=3/>
