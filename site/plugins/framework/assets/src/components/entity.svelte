<script>

    /*
    * import components
    */

    import Pagination from './navigation/pagination.svelte';

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
		console.log('clicked on glass');
		window.goThroughGlass();
	}

	function contentWidth( type ){
		console.log( type );
		if( type == 'file' ){
			return 4;
		}
		return 6;
	}

</script>

{#if entity.content}

    <main class="panel col-sm-{contentWidth(entity.entity)}" on:click={touchGlass} bind:this={glass}>

        <div class="content">

            {#if entity.pagination}
                <Pagination pagination={entity.pagination} />
            {/if}

            {#each entity.content as tab}

                <svelte:component this={tabs[ tab.type ]} {tab} category="{entity.category}" entity="{entity.entity}"/>

            {/each}

        </div>

    </main>

{/if}
{#if entity.view}

	{#if entity.transcript}
    	<svelte:component this={views[ entity.view.type ]} view={entity.view} classname="presentation panel col-sm-{12 - contentWidth(entity.entity)}" transcript={entity.transcript}/>
	{:else}
		<svelte:component this={views[ entity.view.type ]} view={entity.view} classname="presentation panel col-sm-{12 - contentWidth(entity.entity)}"/>
	{/if}

{/if}
