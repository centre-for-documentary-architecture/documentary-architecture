<script>

    export let list;
	export let columns = 1;
	export let category = '';

    // import ViewCollection from './views/collection.svelte';
	// import ViewImage from '../views/image.svelte';
	import ViewVideo from '../views/video.svelte';
	import ViewAudio from '../views/audio.svelte';
	// import ViewMap from '../views/map.svelte';
	// import View3d from '../views/3d.svelte';
	// import ViewPanorama from '../views/panorama.svelte';
	// import ViewLieblingHouse from '../views/liebling-house.svelte';
	let views = {
		// 'collection': ViewCollection,
		// 'image': ViewImage,
		// 'liebling-house': ViewLieblingHouse,
		'video': ViewVideo,
		'audio': ViewAudio,
		// 'map': ViewMap,
		// '3d': View3d,
		// 'panorama': ViewPanorama
	}

	console.log( category );

</script>

<ul class="gallery">
    {#each list as item}

		{#if category == 'tourstop' && item.worlditem !== null }

			<!-- show only as small thumbnails -->
			<li class="card worlditem {item.classlist}">
				<a on:click={navi} href={item.url} data-template={item.template}>
					{#if item.thumbnail}
						<figure>{@html item.thumbnail}</figure>
					{/if}
					<h4 class="title">{item.title}</h4>
				</a>
			</li>

		{:else if item.view.type == 'audio' || item.view.type == 'video' }

			<!-- play audio or video -->
			<li class="card preview {item.classlist}">
				<svelte:component this={views[ item.view.type ]} view={item.view}/>

				<a href={item.url}>
					<h4 class="title">{item.title}</h4>
				</a>
			</li>

		{:else}

			<!-- big image -->
			<li class="card {item.classlist}">
				<a on:click={navi} href={item.url} data-template={item.template}>
					{#if item.thumbnail}
						<figure>{@html item.thumbnail}</figure>
					{/if}
					<h4 class="title">{item.title}</h4>
				</a>
			</li>

		{/if}


    {/each}
</ul>
