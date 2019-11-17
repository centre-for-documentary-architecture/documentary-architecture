<script>
	import { loading } from './helpers/loader.js';
	import Wait from './helpers/wait.svelte';

	export let archive;

	import ViewCollection from './views/collection.svelte';
	import Card from './collection/card.svelte';
	import CollectionList from './collection/list.svelte';

	let loadingQuery = false;

	async function startSearch(){
		searchTerm = searchTerm.trim();

		if( searchTerm === previousTerm && filter === previousFilter ){
			return;
		}

		let title = 'Archive';
		let url = archive.url + '?';

		if( filter !== '' ){
			title = filter;
			url += 'filter=' + filter + '&';
		}

		if( searchTerm !== '' ){
			title = searchTerm + ' in ' + title;
			url += 'research=' + searchTerm;
		}

		document.title = title;
		console.log( searchTerm, title, url );

		loadingQuery = true;
		let newData = await load( url );

		history.replaceState({
			title: title,
			url: url
		}, title, url);

		if( newData ){

			loadingQuery = false;
			// console.log('loadingQuery finished from '+newData.url);

			// console.log( newData );

			archive.results = newData.results;

		}

		previousTerm = searchTerm;
		previousFilter = filter;

	}

	let searchField;

	let previousTerm = false;
	let searchTerm = archive.archive.query;
	let previousFilter = false;
	$: filter = archive.filter;

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
			<h2>Filter {filter}</h2>
			<ul class="list">
				{#each archive.archive.filters.content as item}
					<li class="card {filter == item.filter ? 'active' : ''}">
						<button on:click={() => filter = item.filter} on:click={startSearch}>
							<div class="title">

								<!-- <span class="count">{item.count || ''}</span> -->
								<h4>{@html item.title}</h4>

							</div>
						</button>
					</li>
				{/each}
			</ul>
		</section>

	</div>
</main>

{#if $loading === true}
	<Wait />
{/if}

<ViewCollection view={archive.results} classname="presentation panel col-sm-9" controls={true} columns=3/>
