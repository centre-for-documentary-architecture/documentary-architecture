<script>

  /*
  * import components
  */

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
	let views = {
		'collection': ViewCollection,
		'image': ViewImage,
		'video': ViewVideo,
		'audio': ViewAudio,
		'map': ViewMap,
		'3d': View3d,
		'panorama': ViewPanorama
	}

	export let page;

	function contentWidth( type ){
		if( type == 'file' ){
			return 3;
		}
		return 6;
	}

  let main;
	var isScrolled = false;
	var isScrolledPrev = false;
	function scrolling(){
		if( main.scrollTop > 100 ){
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
		} else {
			document.body.classList.remove('scrolled');
		}
	}

</script>

<div class="grid panels">

  {#if page.loading}<div class="is-loading"></div>{/if}

  {#if page.content}

    <main bind:this={main} class="panel col-sm-{contentWidth(page.entity)}" on:scroll|passive={scrolling}>

      <div class="content">
        <div class="tabs">
          {#each page.content as tab}

            <svelte:component this={tabs[ tab.type ]} {tab} category="{page.category}" entity="{page.entity}" image={page.thumbnail}/>

          {/each}
        </div>
      </div>

    </main>

  {/if}
  {#if page.view}

  	<svelte:component this={views[ page.view.type ]} view={page.view} classname="presentation panel col-sm-{12 - contentWidth(page.entity)}" transcript={page.transcript || false}/>

  {/if}
</div>
