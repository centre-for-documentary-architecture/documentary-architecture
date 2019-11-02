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

// scrset
if( !isset( $srcset ) ){
	$srcset = 'large';
}

?>
<ul class="gallery <?= implode(' ',$classlist) ?>">

	<?php foreach( $collection as $item ): ?>
		<li class="card <?= $item->type(); ?> <?= implode(' ',$itemClasslist); ?>">

			<?= Html::tag( 'div', $item->title(), [
				'class' => 'title'
			] ); ?>

			<a class="open" href="<?= $item->url() ?>">Open</a>

			<?php
			if( $item->isType('audio') ){
				snippet('view/audio',[
					'parent' => $item
				]);
			}
			?>

			<?php if( $image = $item->thumbnail() ): ?>
				<figure>
					<?= $image->responsiveImage( $srcset ) ?>
				</figure>
			<?php endif ?>
			
		</li>
	<?php endforeach ?>

</ul>