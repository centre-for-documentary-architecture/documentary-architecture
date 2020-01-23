<script>

	import Card from './card.svelte';
	import ViewVideo from '../../views/video.svelte';
	import ViewAudio from '../../views/audio.svelte';

    export let list;
	export let category = '';

	let views = {
		'video': ViewVideo,
		'audio': ViewAudio,
	}

	export let columns = 1;
    let columnWidth = 12 / columns;

    import { beforeUpdate } from 'svelte';
	beforeUpdate(() => {
        columnWidth = 12 / columns;
        if( list.length < 4 ){
            if( columns == 2 ){

                columnWidth = 12;

            }
        }
    });

</script>

<ul class="gallery { columns !== 1 ? 'grid' : ''}">
    {#each list as item}

		{#if category == 'tourstop' && item.worlditem !== null }

			<!-- show only as small thumbnails -->

			<Card item={item} classname="list-element" width={columnWidth}/>

		{:else if item.view && ( item.view.type == 'audio' || item.view.type == 'video' )}

			<!-- play audio or video -->
			<li class="card preview {item.classlist} {columnWidth ? 'col-'+columnWidth : ''}">

				<svelte:component this={views[ item.view.type ]} view={item.view}/>

				<a on:click={window.navi} href={item.url} data-template={item.template}>
		        <div class="title">

		            <span class="count">{item.count || ''}</span>
		            <h4>{@html item.title}</h4>

		        </div>
		    </a>

			</li>

		{:else}

			<Card item={item} classname="card-element" width={columnWidth}/>

		{/if}

    {/each}
</ul>
