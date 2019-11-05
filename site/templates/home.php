<?php

snippet('header');

snippet('navigation/history');

?>

<header id="top" class="white">

	<h1><?= $site->title() ?></h1>

	<?php $root = option('centre-for-documentary-architecture.matter-of-data.cdn').'assets/videos/'; ?>
	<video autoplay loop muted preload="auto">
		<source src="<?= $root ?>CDA-intro-short-360.mp4" type='video/mp4' media="all and (max-width: 640px)" />
		<source src="<?= $root ?>CDA-intro-short-480.mp4" type='video/mp4' media="all and (max-width: 854px)" />
		<source src="<?= $root ?>CDA-intro-short-720.mp4" type='video/mp4' media="all and (max-width: 1280px)" />
		<source src="<?= $root ?>CDA-intro-short-1080.mp4" type='video/mp4'/>
	</video>

</header>

<div class="grid white activity">

	<section class="col-sm-6 projects whites">

		<ul class="cards">

			<?php foreach( $projects as $item ): ?>
				<li class="card">
					<a href="<?= $item->url() ?>">
						<h5>
							Online Collection,
							<?= $item->date_created()->toDate('Y') ?>
						</h5>
						<?php if($image = $item->thumbnail()): ?>
							<figure>
								<?= $image->responsiveImage('large') ?>
							</figure>
						<?php endif ?>
						<h1><?= $item->title() ?></h1>
						<div class="highlight"><?= $item->description()->kirbytext() ?></div>
					</a>
				</li>
			<?php endforeach ?>

		</ul>

	</section>

	<section class="col-sm-6 on-display whites">

		<ul class="cards grid">

			<?php foreach( $site->archive('publications')->highlights()->toPages() as $item ): ?>
				<li class="card col-sm-6"><a href="<?= $item->url() ?>">
					<h5>
						<?php
							if( $item->category() !== null ){
								echo ucwords( $item->category() );
							} else {
								echo ucwords( $item->type() );
							}
							if( $item->date_start()->exists() && $item->date_start()->isNotEmpty() ){

								echo ', '.$item->date_start()->value();

								if( $item->date_end()->exists() && $item->date_end()->isNotEmpty() ){
									echo ' – '.$item->date_end()->value();
								}

							}
						?>
					</h5>
					<?php if($image = $item->thumbnail()): ?>
						<figure>
							<?= $image->responsiveImage('large') ?>
						</figure>
					<?php endif ?>
					<h2><?= $item->title() ?></h2>
				</a></li>
			<?php endforeach ?>

		</ul>

	</section>

</div>

<div id="archive"></div>

<div class="black sticky-bottom archive-bar">
	<h1><a href="#archive" class="smooth">Archive</a></h1>
</div>

<div id="archive-preview" class="black darks grid fixed-card-height">

	<div class="col-sm-6">
		<?php
		// ↗ →
		$previews = ['buildings','persons','materials','objects'];
		foreach( $previews as $preview ):
			$archive = $site->archive( $preview );
			$highlights = $archive->highlights()->toPages();
			if( !$highlights || $highlights->count() < 4 ){
				$highlights = $highlights->add( $archive->children()->listed()->limit( 4 ) );
			}
			?>
			<section>
				<h2><?= $archive->children()->listed()->count() ?> <?= $archive->toLink() ?> →</h2>
				<?php snippet('home/cards', [
					'collection' => $highlights->limit(4)
				]); ?>
			</section>
		<?php endforeach; ?>
	</div>

	<div class="col-sm-6">
		<?php
		$previews = ['videos','3d-objects','images','audios'];
		foreach( $previews as $preview ):
			$archive = $site->archive( $preview );
			if( $preview === 'images' ){
				$highlights = $archive->highlights()->toEntities();
			} else {
				$highlights = $archive->highlights()->toPages();
			}

			if( !$highlights || $highlights->count() < 4 ){
				$highlights = $highlights->add( $archive->children()->listed()->limit( 4 ) );
			}
			?>
			<section>
				<h2><?= $archive->children()->listed()->count() ?> <?= $archive->toLink() ?> →</h2>
				<?php snippet('home/cards', [
					'collection' => $highlights->limit(4)
				]); ?>
			</section>
		<?php endforeach; ?>
	</div>

	<div class="offset-md-3 col-md-6 archive-search">

		<div>
			<?php $count = $site->archive()->index()->listed()->count(); ?>
			<h2><a href="<?= $site->archive()->url() ?>">Explore all <?= $count; ?> archived elements&nbsp;→</a></h2>

			<form id="search" action="archive" autocomplete="off">
				<input class="input" type="search" name="research" placeholder="Keyword" autocomplete="off">
				<input class="button" type="submit" value="Search" title="Search">
			</form>
		</div>

	</div>

</div>

<?php

snippet('footer');
