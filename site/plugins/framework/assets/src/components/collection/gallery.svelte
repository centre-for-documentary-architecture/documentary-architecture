<script>

	import Card from './card.svelte';
	import ViewVideo from '../views/video.svelte';
	import ViewAudio from '../views/audio.svelte';

    export let list;
	export let columns = 1;
	export let category = '';

	let views = {
		'video': ViewVideo,
		'audio': ViewAudio,
	}

</script>

<ul class="gallery">
    {#each list as item}

		{#if category == 'tourstop' && item.worlditem !== null }

			<!-- show only as small thumbnails -->

			<Card item={item} classname="list-element"/>

			<!-- <li class="card worlditem {item.classlist}">
				<a on:click={window.navi} href={item.url} data-template={item.template}>
					{#if item.thumbnail}
						<figure>{@html item.thumbnail}</figure>
					{/if}
					<div class="title">
						<h4>{item.title}</h4>
					</div>
				</a>
			</li> -->

		{:else if item.view && ( item.view.type == 'audio' || item.view.type == 'video' )}

			<!-- play audio or video -->
			<li class="card preview {item.classlist}">

				<svelte:component this={views[ item.view.type ]} view={item.view}/>

				<a href={item.url}>
					<div class="title">

						<span class="count">{item.count || 1}</span>
						<h4>{@html item.title}</h4>

					</div>
				</a>

			</li>

		{:else}

			<Card item={item}/>

			<!-- big image -->
			<!-- <li class="card {item.classlist}">
				<a on:click={window.navi} href={item.url} data-template={item.template}>
					{#if item.thumbnail}
						<figure>{@html item.thumbnail}</figure>
					{/if}
					<div class="title">
						<h4>{item.title}</h4>
					</div>
				</a>
			</li> -->

		{/if}

    {/each}
</ul>
