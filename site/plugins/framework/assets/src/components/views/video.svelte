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

</script>

<style>
	video {
		display: flex;
	}
</style>

{#if view.content.srcset.length > 0}

<section class="{classname} {view.type}">

	<h3 class="section--header">
		{ view.headline || 'Video' }
	</h3>

	<div class="section--content">
		<video width="100%" height="auto" controls poster="{ view.content.poster }" bind:this={mediaElement}>
			{#each view.content.srcset as source}

				<source type="{source.mime}" media="{source.media}" src="{source.url}" >

			{/each}
		</video>
	</div>

	{#if transcript}
		<Transcript transcript={transcript} />
	{/if}

</section>

{/if}
