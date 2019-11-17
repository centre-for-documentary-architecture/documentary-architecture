<script>
	import { loading } from './helpers/loader.js';
	import Wait from './helpers/wait.svelte';

    /*
    * import components
    */

    import Pagination from './navigation/pagination.svelte';
    import TourNavigation from './navigation/tourNavigation.svelte';

    import TabHeader from './tabs/header.svelte';
	import TabTable from './tabs/table.svelte';
	import TabCollection from './tabs/collection.svelte';
	import TabText from './tabs/text.svelte';
	let tabs = {
		header: TabHeader,
		table: TabTable,
		collection: TabCollection,
		text: TabText
    }

    import ViewCollection from './views/collection.svelte';
	import ViewImage from './views/image.svelte';
	import ViewVideo from './views/video.svelte';
	import ViewAudio from './views/audio.svelte';
	import ViewMap from './views/map.svelte';
	import View3d from './views/3d.svelte';
	import ViewPanorama from './views/panorama.svelte';
	import ViewLieblingHouse from './views/liebling-house.svelte';
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

	export let entity;

	let glass;
	window.touchGlass = event => {
		if( entity.view.type !== 'liebling-house' ){
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

{#if $loading === true}
	<Wait />
{/if}

{#if entity.content}

    <main class="panel col-sm-{contentWidth(entity.entity)}" on:click={window.touchGlass} bind:this={glass} on:scroll|passive={scrolling}>

        <div class="content">
			<div class="tabs">
				{#if entity.category == 'overview'}
					<TourNavigation>
						<button class="blue" on:click={window.worldSetRoaming}>Start exploring →</button>
					</TourNavigation>
				{:else if entity.category == 'tour'}
					<TourNavigation>
						<a class="button blue" on:click={window.navi} href="{entity.content[1].content[0].url}" data-template="{entity.content[1].content[0].template}">Start promenade →</a>
					</TourNavigation>
				{:else if entity.category == 'tourstop' && entity.pagination }
					<Pagination pagination={entity.pagination} />
				{/if}

				{#each entity.content as tab}

					<svelte:component this={tabs[ tab.type ]} {tab} category="{entity.category}" entity="{entity.entity}"/>

				{/each}
			</div>
        </div>

    </main>

{/if}
{#if entity.view}

	<svelte:component this={views[ entity.view.type ]} view={entity.view} classname="presentation panel col-sm-{12 - contentWidth(entity.entity)}" transcript={entity.transcript || false}/>

{/if}
