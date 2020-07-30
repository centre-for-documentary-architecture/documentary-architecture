<script>

	export let view;
	export let classname;
	export let transcript;

</script>

<section class="{classname} {view.type}">

	<div class="section--content">
		<figure>
			{ @html view.content.html }
		</figure>
	</div>

</section>
