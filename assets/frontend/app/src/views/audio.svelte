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
		padding: 1rem;
		align-items: flex-end;
	}
	audio {
		width: 100%;
		outline: none;
	}
</style>

<section class="{classname} {view.type} {transcript ? '' : 'center'}">

	<div class="section--content">

		<audio width="100%" height="auto" controls bind:this={mediaElement} preload="meta" src="{view.content.url}">
		</audio>

	</div>

	{#if transcript}
		<Transcript {transcript} />
	{/if}

</section>
