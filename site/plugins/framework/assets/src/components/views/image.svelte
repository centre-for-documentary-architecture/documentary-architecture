<script>

	export let view;
	export let classname;

</script>

<section class="{classname} {view.type}">

	<!--<h3 class="section--header">
		{ view.headline || 'Preview' }
	</h3>-->

	<div class="section--content">
		<figure>
			{ @html view.content.html }
		</figure>
	</div>

</section>
