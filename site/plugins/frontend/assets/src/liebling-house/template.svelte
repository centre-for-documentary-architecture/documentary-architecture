<script>

  /*
  * import components
  */

  import Link from '../router/Link.svelte';
  import Pagination from './pagination.svelte';
  import TourNavigation from './tourNavigation.svelte';

  import TabHeader from '../components/tabs/header.svelte';
	import TabCollection from '../components/tabs/collection.svelte';
	import TabTable from '../components/tabs/table.svelte';
	import TabText from '../components/tabs/text.svelte';
	let tabs = {
		header: TabHeader,
		collection: TabCollection,
		table: TabTable,
		text: TabText
  }

	import World from './world.svelte';

	export let page;

	let glass;
	window.touchGlass = event => {
		if( page.view.type !== 'liebling-house' ){
			return false;
		}
		if( event.target !== glass ){
			return false;
		}
		window.goThroughGlass();
	}

	function contentWidth( type ){
		if( type == 'file' ){
			return 3;
		}
		return 6;
	}

	var isScrolled = false;
	var isScrolledPrev = false;
	function scrolling(){
		if( glass.scrollTop > 100 ){
			isScrolled = true;
		} else {
			isScrolled = false;
		}
		if( isScrolled === isScrolledPrev ){
			return;
		}
		isScrolledPrev = isScrolled;

		if( isScrolledPrev === true ){
			document.body.classList.add('scrolled');
			// console.log('scrolled');
		} else {
			document.body.classList.remove('scrolled');
			// console.log('top');
		}
	}

  document.body.classList.add('liebling-house');
  import { onDestroy } from 'svelte';
	onDestroy(() => {
		document.body.classList.remove('liebling-house');
	});

</script>

<div class="grid panels overlap">

  {#if page.content}
    <main class="panel col-sm-3 {page.category}" on:click={window.touchGlass} bind:this={glass} on:scroll|passive={scrolling}>
      <div class="content">

  			<div class="tabs">

          {#if page.loading}<div class="is-loading"></div>{/if}

  				{#if page.category == 'overview'}
  					<TourNavigation>
  						<button class="blue" on:click={window.worldFreeRoaming}>Start exploring →</button>
  					</TourNavigation>
  				{:else if page.category == 'tour'}
  					<TourNavigation>
  						<!-- <a class="button blue" on:click={window.navi} href="{page.content[1].content[0].url}" data-template="{page.content[1].content[0].template}">Start promenade →</a> -->
              <Link target={page.content[1].content[0]} class="button blue">Start promenade →</Link>
  					</TourNavigation>
  				{:else if page.category == 'tourstop' && page.pagination }
  					<Pagination pagination={page.pagination} />
  				{/if}

  				{#each page.content as tab}

  					<svelte:component this={tabs[ tab.type ]} {tab} category="{page.category}" entity="{page.entity}"/>

  				{/each}
  			</div>

      </div>
    </main>
  {/if}
  {#if page.view}

    <World view={page.view} page={page.category} classname="presentation panel col-12" />

  {/if}

</div>
