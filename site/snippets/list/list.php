<?php
$classlist = [];

// $collection
if( !isset( $collection ) ){
	return;
}

// classes
if( isset( $class ) ){
	$classlist[] = $class;
}

$itemClasslist = [];
if( isset( $itemClass ) ){
	$itemClasslist = $itemClass;
}

?>
<ul class="list <?= implode(' ',$classlist) ?>">

	<?php foreach( $collection as $item ): ?>
		<li class="card <?= implode(' ',$itemClasslist); ?>"><a href="<?= $item->url() ?>">
			<?= Html::tag( 'div', $item->title(), [
				'class' => 'title'
			] ); ?>
			<?php if( $image = $item->thumbnail() ): ?>
				<figure>
					<?= $image->responsiveImage( 'small' ) ?>
				</figure>
			<?php endif ?>
		</a></li>
	<?php endforeach ?>

</ul>