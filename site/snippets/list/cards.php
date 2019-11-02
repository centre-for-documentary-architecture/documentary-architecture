<?php
$classlist = [];

// $collection
if( !isset( $collection ) ){
	return;
}

$count = $collection->count();
if( $count < 1 ){
	return;
}
if( $count == 1 || $count == 3 ){
	$classlist[] = 'count-'.$count;
}

// $headline
if( !isset( $headline ) ){
	$headline = 'h5';
}

// classes
if( isset( $class ) ){
	$classlist[] = $class;
}

$itemClasslist = [];
if( isset( $itemClass ) ){
	$itemClasslist[] = $itemClass;
}

// $columns
if( !isset( $columns ) ){
	$columns = 2;
}
if( $columns > 1 ){
	$classlist[] = 'grid';
	$itemClasslist[] = 'col-'.( 12/$columns );
}

// scrset
if( !isset( $srcset ) ){
	$srcset = 'medium';
}

?>
<ul class="cards <?= implode(' ',$classlist); ?>">

	<?php foreach( $collection as $item ): ?>

		<li class="card <?= implode(' ',$itemClasslist); ?> <?= $item->type(); ?>"><a href="<?= $item->url() ?>">
			
			<?php if( $image = $item->thumbnail() ): ?>
				<figure><?= $image->responsiveImage( $srcset ) ?></figure>
			<?php endif ?>

			<?= Html::tag( $headline, $item->title(), [
				'class' => 'title'
			] ); ?>

		</a></li>

	<?php endforeach ?>

</ul>