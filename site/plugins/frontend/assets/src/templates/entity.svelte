<script>

  /*
  * import components
  */

  import Pagination from '../components/navigation/pagination.svelte';
  import TourNavigation from '../components/navigation/tourNavigation.svelte';

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

  import ViewCollection from '../views/collection.svelte';
	import ViewImage from '../views/image.svelte';
	import ViewVideo from '../views/video.svelte';
	import ViewAudio from '../views/audio.svelte';
	import ViewMap from '../views/map.svelte';
	import View3d from '../views/3d.svelte';
	import ViewPanorama from '../views/panorama.svelte';
	import ViewLieblingHouse from '../views/liebling-house.svelte';
	let views = {
		'collection': ViewCollection,
		'image': ViewImage,
		'liebling-house': ViewLieblingHouse,
		'video': ViewVideo,
		'audio': ViewAudio,
		'map': ViewMap,
		'3d': View3d,
		'panorama': ViewPanorama
	}

	export let page;

	let glass;
	window.touchGlass = event => {
		if( page.view.type !== 'liebling-house' ){
			return false;
		}
		if( event.target !== glass ){
			return false;
		}
		// console.log('clicked on glass');
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

</script>

<div class="grid panels {page.type == 'liebling-house' ? 'overlap' : '' }">

  {#if page.content}

      <main class="panel col-sm-{contentWidth(page.entity)}" on:click={window.touchGlass} bind:this={glass} on:scroll|passive={scrolling}>

          <div class="content">
  			<div class="tabs">
  				{#if page.category == 'overview'}
  					<TourNavigation>
  						<button class="blue" on:click={window.worldSetRoaming}>Start exploring →</button>
  					</TourNavigation>
  				{:else if page.category == 'tour'}
  					<TourNavigation>
  						<a class="button blue" on:click={window.navi} href="{page.content[1].content[0].url}" data-template="{page.content[1].content[0].template}">Start promenade →</a>
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

  	<svelte:component this={views[ page.view.type ]} view={page.view} classname="presentation panel col-sm-{12 - contentWidth(page.entity)}" transcript={page.transcript || false}/>

  {/if}

</div>
