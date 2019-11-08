<script>

	import { beforeUpdate } from 'svelte';

	export let view;

	import Transcript from './transcript.svelte';
	export let transcript;

	export let classname = 'preview';

	beforeUpdate(() => {
		if( mediaElement === false ){
			return;
		}
		mediaElement.pause();
	});

	let mediaElement = false;

	let videoWidth = 0;

</script>

<style>
	video {
		display: flex;
	}
</style>

{#if view.content.srcset.length > 0}

<section class="{classname} {view.type}" bind:offsetWidth={videoWidth}>

	<!--<h3 class="section--header" bind:offsetWidth={videoWidth}>
		{ view.headline || 'Video' }
	</h3>-->

	<div class="section--content">
		<video width="100%" height="auto" controls poster="{ view.content.poster }" bind:this={mediaElement} preload="metadata" >

			{#each view.content.srcset as source}
				{#if videoWidth < source.width }
					<source type="{source.mime}" media="{source.media}" src="{source.url}" >
				{/if}
			{/each}

		</video>
	</div>

	{#if transcript}
		<Transcript transcript={transcript} />
	{/if}

</section>

{/if}
