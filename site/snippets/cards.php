<?php
$classlist = [];

// $collection
if( !isset( $collection ) ){
	return;
}

$count = $collection->count();
if( $count === 1 || $count === 3 ){
	$classlist[] = 'count-'.$count;
}

?>
<ul class="cards grid">

	<?php foreach( $collection as $item ): ?>

		<li class="card col-6 <?= $item->type(); ?>"><a href="<?= $item->url() ?>" title="<?= $item->title()->html() ?>">

			<figure>
				<?php if( $image = $item->thumbnail() ): ?>
					<?= $image->responsiveImage( 'medium' ) ?>
				<?php endif; ?>
			</figure>


			<div class="title">
				<h4><?= $item->title()->html() ?></h4>
			</div>

		</a></li>

	<?php endforeach ?>

</ul>
