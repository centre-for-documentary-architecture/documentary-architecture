<?php

$classlist = [];
if( isset( $class ) ){
	$classlist[] = $class;
}

if( isset( $open ) ){
	$classlist[] = 'open';
}

if( !isset( $entity ) ){
	if( $page->represents_entity_switch()->isTrue() && $page->represents_entity()->toPage() ){
		$entity = $page->represents_entity()->toPage();
	} else {
		$entity = $page;
	}
}

?>
<section class="section accordion info card <?= implode(' ',$classlist) ?>">

	<h3 class="section--header">Info</h3>
	<dl class="section--content table">
		<?php

		snippet([ 'entity/info/'.$entity->intendedTemplate(), 'entity/info/file'], [
			'page' => $entity
		]);

		foreach($entity->properties()->toBuilderBlocks() as $block):
			snippet([
				'properties/'.$block->_key(),
				'properties/default'
			], ['data' => $block]);
		endforeach;

		?>
	</dl>

</section>
