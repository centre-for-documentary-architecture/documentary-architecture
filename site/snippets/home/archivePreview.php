<?php

if( !isset( $preview ) ){
	return false;
}

$archive = $site->archive( $preview );

$highlights = $archive->highlights()->toPages();
if( !$highlights || $highlights->count() < 4 ){
	$highlights = $highlights->add( $archive->children()->listed()->limit( 4 ) );
}

?>
<section>
	<h2><?= $archive->toLink() ?> <?= $archive->children()->listed()->count() ?> →</h2>
	<ul class="cards grid fixed-heights">

		<?php foreach( $highlights->limit(4) as $item ):

			$classlist[] = $item->type();
			if( $image = $item->thumbnail() ){} else {
				$classlist[] = 'no-thumb';
			}
			?>

			<li class="card col-6 <?= implode(' ', $classlist) ?>">
				<a href="<?= $item->url() ?>" title="<?= $item->title()->html() ?>">

					<figure>
						<?php if( $image ): ?>
							<?= $image->responsiveImage( 'medium' ) ?>
						<?php endif; ?>
					</figure>

					<div class="title">
						<span class="count"><?= $item->countCollection() ?></span>
						<h4><?= $item->title()->html() ?></h4>
					</div>

				</a>
			</li>

		<?php endforeach ?>

	</ul>

</section>
