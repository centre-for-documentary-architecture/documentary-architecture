<script>

	export let view;

	import Transcript from './transcript.svelte';
	export let transcript;

	export let classname = 'preview';

	let mediaElement;

	let videoWidth = 0;

	let video = true;
	$: videoSource = view.content.srcset[0].url;
	$: { reMountVideo( videoSource ) }
	function reMountVideo( xx ){
		console.log('reMountVideo',xx);
		video = false;
		setTimeout(() => video = true, 0);
	}

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
		{#if video === true}
			<video width="100%" height="auto" controls preload="metadata"
				on:contextmenu={preventContextMenu} poster="{ view.content.poster }" bind:this={mediaElement}>

				{#each view.content.srcset as source}
					{#if videoWidth < source.width }
						<source type="{source.mime}" media="{source.media}" src="{source.url}" >
					{/if}
				{/each}

			</video>
		{:else}
			Remount
		{/if}
	</div>

	{#if transcript}
		<Transcript transcript={transcript} />
	{/if}

</section>

{/if}
