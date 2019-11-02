<?php
$classlist = [];

// $collection
if( !isset( $collection ) ){
	return;
}

$count = $collection->count();
if( $count == 1 || $count == 3 ){
	$classlist[] = 'count-'.$count;
}

?>
<ul class="cards grid">

	<?php foreach( $collection as $item ): ?>

		<li class="card col-6 <?= $item->type(); ?>"><a href="<?= $item->url() ?>" title="<?= $item->title()->html() ?>">
			
			<?php if( $image = $item->thumbnail() ): ?>
				<figure><?= $image->responsiveImage( 'medium' ) ?></figure>
			<?php else: ?>
				<div class="placeholder"></div>
			<?php endif; ?>
			
			<h5 class="title"><?= $item->title()->html() ?></h5>

		</a></li>

	<?php endforeach ?>

</ul>