<script>

	import ViewCollection from '../views/collection.svelte';
	import Card from '../components/collection/card.svelte';
	import List from '../components/collection/list.svelte';

	import { navigateTo } from '../router/navigateTo.js';
	import { pageStore } from '../router/pageStore.js';

	let field;
	let loading = false;

	let archive = {
		filter: false,
		query: '',
		str: '',
		previous: {
			str: false
		},
		modify: function( key, value ){
			this[key] = value;
			this.search();
		},
		wait: false,
		input: function(){
			clearTimeout( this.wait );
			this.wait = setTimeout(() => {
				this.modify( 'query', archive.query );
			}, 250);
		},
		search: function(){

			let parameters = {};
			if( this.filter ){ parameters.filter = this.filter; }
			if( this.query ){ parameters.research = this.query; }

			this.str = Object.keys(parameters).map( key => key + '=' + encodeURIComponent(parameters[key]) ).join('&');

			console.log( 'search '+this.str );
			let url = window.location.origin + window.location.pathname + '?' + this.str;
			console.log( url );

			navigateTo( url, {
				title: 'AAArchivoo',
				url: url,
				template: 'archive'
			}, true );

		}
	};

	export let page;

	/*
  const unsubscribe = pageStore.subscribe(value => {
		page = value;
		if( value.archive ){

			if( value.archive.filter ){
				archive.modify( 'filter', value.archive.filter );
			}
			if( value.archive.query ){
				archive.modify( 'query', value.archive.query );
			}

		}
		if( value.loading ){
			loading = value.loading;
		}
		console.log('page store updated');
  });
	*/

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
								<button on:click={() => archive.modify('filter',item.filter) }>
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

			<div>{archive.str}</div>

		</div>
	</main>

	{#if loading === true}
		Please wait...
	{/if}

	{#if page.results}

		{#if page.results.total === 0 && archive.query !== '' }
			<div class="panel col-sm-9 empty-results">No results for »{archive.query}«</div>
		{:else}
			<ViewCollection view={page.results} classname="presentation panel col-sm-9" controls={true} columns=3/>
		{/if}

	{/if}

</div>
