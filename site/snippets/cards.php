<?php

// $collection
if( !isset( $collection ) ){
	return;
}

$classlist = [
	'card',
	'col-6'
];

?>
<ul class="cards grid fixed-heights">

	<?php foreach( $collection as $item ):

		$classlist[] = $item->type();
		if( $image = $item->thumbnail() ){

		} else {
			$classlist[] = 'no-thumb';
		}
		?>

		<li class="<?= implode(' ', $classlist) ?>">
			<a href="<?= $item->url() ?>" title="<?= $item->title()->html() ?>">

				<figure>
					<?php if( $image ): ?>
						<?= $image->responsiveImage( 'medium' ) ?>
					<?php endif; ?>
				</figure>


				<div class="title">
					<h4><?= $item->title()->html() ?></h4>
				</div>

			</a>
		</li>

	<?php endforeach ?>

</ul>
