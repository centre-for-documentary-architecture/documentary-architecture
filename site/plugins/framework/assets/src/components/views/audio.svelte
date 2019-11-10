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
	.section--content {
		padding: 2rem;
		align-items: flex-end;
	}
	audio {
		width: 100%;
		outline: none;
	}
</style>

<section class="{classname} {view.type} {transcript ? '' : 'center'}">

	<!--<h3 class="section--header">
		{ view.headline || 'Audio' }
	</h3>-->

	<div class="section--content">

		<audio width="100%" height="auto" controls bind:this={mediaElement}>

			<source type="{view.content.mime}" src="{view.content.url}" >

		</audio>

	</div>

	{#if transcript}
		<Transcript transcript={transcript} />
	{/if}

</section>
