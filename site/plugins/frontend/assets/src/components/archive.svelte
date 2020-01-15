<script>
	import { loading } from './helpers/loader.js';
	import Wait from './helpers/wait.svelte';

	export let archive;

	import ViewCollection from './views/collection.svelte';
	import Card from './collection/card.svelte';
	import CollectionList from './collection/list.svelte';

	let archiveSearch = {
		inputFiled: false,
		filter: {
			id: archive.archive.filter,
			previous: archive.archive.filter,
		},
		query: {
			term: archive.archive.query,
			previous: archive.archive.query,
		},
		loading: false
	};

	async function startSearch(){

		if( archiveSearch.query.term === archiveSearch.query.previous &&
			archiveSearch.filter.id === archiveSearch.filter.previous ){
			return;
		}

		// archiveSearch.query.term = archiveSearch.query.term.trimStart();

		let title = 'CDA Archive';
		// let url = archive.url + '?';
		let url = window.location.origin + window.location.pathname + '?';

		if( archiveSearch.filter.id !== '' ){
			// title += ' '+archiveSearch.filter.id;
			url += 'filter=' + archiveSearch.filter.id + '&';
		}

		if( archiveSearch.query.term !== '' ){
			// title += ' ' + title;
			url += 'research=' + archiveSearch.query.term;
		}

		document.title = title;
		console.log( archiveSearch.query.term, title, url );

		archiveSearch.loading = true;
		let newData = await load( url );

		history.replaceState({
			title: title,
			url: url
		}, title, url);

		if( newData ){

			archiveSearch.loading = false;
			archive.results = newData.results;
			console.log( archive.results );

		}

		archiveSearch.query.previous = archiveSearch.query.term;
		archiveSearch.filter.previous = archiveSearch.filter.id;

		// console.log( archiveSearch );

	}

</script>

<main class="panel col-sm-3">
	<div class="content">

		<header id="top" class="tab">
			<h1>Archive</h1>

			<form id="search" on:click="{() => archiveSearch.inputField.focus() }" autocomplete="off">
				<input class="input" type="search" name="research"
					autocomplete="off"
					spellcheck="false"
					autocorrect="off"
					bind:value={archiveSearch.query.term}
					aria-label="Search the archive ..."
					placeholder="Search the archive ..."
					bind:this={archiveSearch.inputField}
					on:input={startSearch} >
			</form>

		</header>

		<section class="filters tab">
			<h2>Filter</h2>
			<ul class="list">
				{#each archive.archive.filters.content as item}
					<li class="card {archiveSearch.filter.id == item.filter ? 'active' : ''}">
						<button on:click={() => archiveSearch.filter.id = item.filter} on:click={startSearch}>
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

{#if archive.results.total === 0 && archiveSearch.query.term !== '' }
	<div class="panel col-sm-9 empty-results">No results for »{archiveSearch.query.term}«</div>
{:else}
	<ViewCollection view={archive.results} classname="presentation panel col-sm-9" controls={true} columns=3/>
{/if}
