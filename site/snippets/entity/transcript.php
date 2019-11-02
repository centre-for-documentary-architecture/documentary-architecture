<?php

// validate entity and field
if( !isset( $entity ) ){
	$entity = $page;
}

if( !$entity->transcript()->exists() || $entity->transcript()->isEmpty() ){
	return;
}

// collect classes
$classlist = [];
if( isset( $class ) ){
	$classlist[] = $class;
}

if( isset( $open ) ){
	$classlist[] = 'open';
}

?>
<section class="section accordion transcript card <?= implode(' ',$classlist) ?>">

	<h3 class="section--header">Transcript</h3>
	<div class="section--content">
		<?= $entity->transcript()->kirbytext(); ?>
	</div>

</section>
