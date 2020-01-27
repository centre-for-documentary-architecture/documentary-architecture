<script>
	import { loadData } from '../router/loadData.js';

	import { navigateTo } from '../router/navigateTo.js';
	import { pageStore, pageStoreReplaceProperties } from '../router/pageStore.js';

	import ViewCollection from '../views/collection.svelte';
	import Card from '../components/collection/card.svelte';
	import List from '../components/collection/list.svelte';

	export let page;
	let field;
	let loading = false;

	let archive = {
		filter: false,
		query: '',
		previous: {
			url: false
		},
		url: window.location.origin + '/archive',
		wait: false,
		input: function(){
			clearTimeout( this.wait );
			this.wait = setTimeout(() => {
				this.search();
			}, 250);
		},
		search: async function(){
			loading = true;

			let url = this.url;
			if( this.filter ){
				url += '/' + encodeURIComponent( this.filter );
			}
			if( this.query ){
				url += '?research=' + encodeURIComponent( this.query );
			}

			if( url === this.previous.url ){
				return false;
			} else {
				this.previous.url = url;
			}

			console.log( 'search '+url );

			let state = history.state;
			state.url = url;
			history.replaceState( state, state.title, state.url );

			// load data
			let data = await loadData( url );
			pageStoreReplaceProperties({ results: data.results });
			loading = false;

		}
	};

	const unsubscribe = pageStore.subscribe(value => {
		// page = value;
		if( value.archive ){
			if( value.archive.filter ){
				archive.filter = value.archive.filter;
			}
			if( value.archive.query ){
				archive.query = value.archive.query;
			}
		}
		if( value.loading === false ){
			setTimeout(() => {
				unsubscribe();
			}, 5);
		}
  });

</script>

<div class="grid panels">

	<main class="panel col-sm-3">
		<div class="content">

			<header id="top" class="tab">
				<h1>Archive</h1>

				<form id="search" on:click="{() => field.focus() }" autocomplete="off">
					<input class="input" type="search" name="research"
						autocomplete="off"
						spellcheck="false"
						autocorrect="off"
						bind:value={archive.query}
						aria-label="Search the archive ..."
						placeholder="Search the archive ..."
						bind:this={field}
						on:input={() => archive.input() }>
				</form>

			</header>

			{#if page.archive && page.archive.filters}
				<section class="filters tab">
					<h2>Filter</h2>
					<ul class="list">
						{#each page.archive.filters.content as item}
							<li class="card {item.filter === archive.filter ? 'active' : ''}">
								<button on:click={() => { archive.filter = item.filter; archive.search(); }}>
									<div class="title">

										<!-- <span class="count">{item.count || ''}</span> -->
										<h4>{@html item.title}</h4>

									</div>
								</button>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

		</div>
	</main>

	{#if loading === true || page.loading}
		<div class="is-loading"></div>
	{/if}

	{#if page.results}

		{#if page.results.total === 0 && archive.query !== '' }
			<div class="panel col-sm-9 empty-results">
				No results for »{archive.query}«
				{#if archive.filter } in {archive.filter}{/if}
			</div>
		{:else}
			<ViewCollection view={page.results} classname="presentation panel col-sm-9" controls={true} columns=3/>
		{/if}

	{/if}

</div>
