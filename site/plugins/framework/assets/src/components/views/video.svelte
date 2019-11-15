<script>

	import { onDestroy } from 'svelte';
	import { beforeUpdate } from 'svelte';

	export let view;

	import Transcript from './transcript.svelte';
	export let transcript;

	export let classname = 'preview';

	beforeUpdate(() => {
		console.log('beforeUpdate');
		if( mediaElement === false ){
			return false;
		}
		mediaElement.pause();
	});
	onDestroy(() => {
		console.log('beforeUpdate');
		if( mediaElement === false ){
			return false;
		}
		mediaElement.remove();
	});

	let mediaElement = false;

	let videoWidth = 0;

	function preventContextMenu( e ){
		e.preventDefault();
		return false;
	}

</script>

{#if view.content.srcset.length > 0}

<section class="{classname} {view.type} {transcript ? '' : 'center'}" bind:offsetWidth={videoWidth}>

	<!--<h3 class="section--header" bind:offsetWidth={videoWidth}>
		{ view.headline || 'Video' }
	</h3>-->

	<div class="section--content">
		<video width="100%" height="auto" on:contextmenu={preventContextMenu} controls poster="{ view.content.poster }" bind:this={mediaElement} preload="metadata" >

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
