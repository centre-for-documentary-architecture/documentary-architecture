<?php

$projects = $site->children()->listed()->template(['collection','collection_liebling-house']);
$publications = $site->archive('publications')->highlights()->toPages();

?>
<header id="top" class="white">

	<h1><?= $site->title() ?></h1>

	<?php
	$root = option('cdn').'/assets/videos';
	$videos = $page->intro_video()->yaml();
	if( count($videos) > 0 ): ?>
		<video autoplay muted preload="auto" id="introvideo">
		<?php foreach( $videos as $video ):
			$sizes = explode( ', ', $video['sizes'] );
			$first = true;
			foreach( $sizes as $size ):
				if( $first === true ){
                    $first = false;
                    $media = '';
                    $width = 9999999;
                } else {
                    $width = ceil( $size / 9 * 16 );
                    $media = 'all and (max-width:'.$width.'px)';
                }
				?>
				<source src="<?= $root ?>/<?= $video['filename'] ?>-<?= $size ?>.mp4" type='video/mp4' media="<?= $media ?>"/>
			<?php endforeach;
		endforeach; ?>
		</video>
		<script>
			var introvideo = document.getElementById('introvideo');
			introvideo.onended = function(){
				introvideo.closest('header').classList.add('video-end');
			};
		</script>
	<?php endif ?>
	
</header>

<div class="grid white activity">

	<section class="col-sm-6 projects">

		<ul class="gallery">

			<?php foreach( $projects as $item ): ?>
				<li class="card">
					<a href="<?= $item->url() ?>">
						<div>
							<h5>Online Collection</h5>
							<?php if($image = $item->thumbnail()): ?>
								<figure>
									<?= $image->responsiveImage('large', false) ?>
								</figure>
							<?php endif ?>
							<h1><?= $item->title()->wbr() ?></h1>
							<div class="highlight"><?= $item->description()->kirbytext() ?></div>
						</div>
					</a>
				</li>
			<?php endforeach ?>

		</ul>

	</section>

	<section class="col-sm-6 on-display">

		<ul class="gallery grid">

			<?php foreach( $publications as $item ): ?>
				<li class="card col-sm-6">
					<a href="<?= $item->url() ?>">
						<div>
							<h5>
								<?php
									if( $item->category() !== null ){
										echo ucwords( $item->content()->category() );
									} else {
										echo ucwords( $item->type() );
									}
									if( $item->date()->isNotEmpty() ){

										echo '<br />';

										echo $item->date()->value();

									}
								?>
							</h5>
							<?php if($image = $item->thumbnail()): ?>
								<figure>
									<?= $image->responsiveImage('large', false) ?>
								</figure>
							<?php endif ?>
							<h2><?= $item->title()->wbr() ?></h2>
							<?php if( $item->additional_title()->isNotEmpty() ): ?>
								<h4><?= $item->additional_title()->html() ?></h4>
							<?php endif ?>
						</div>
					</a>
				</li>
			<?php endforeach ?>

		</ul>

	</section>

</div>

<div id="archive"></div>

<div class="black sticky-bottom archive-bar">
	<h1><a href="#archive" class="smooth">Archive</a></h1>
</div>

<div id="archive-preview" class="black grid">

	<div class="col-sm-6">

		<?php
		$previews = ['buildings','persons','materials','objects'];
		foreach( $previews as $preview ):
			snippet('home/archivePreview', [
				'preview' => $preview
			]);
		endforeach ?>

	</div>

	<div class="col-sm-6">

		<?php
		$previews = ['videos','3d-objects','images','audios'];
		foreach( $previews as $preview ):
			snippet('home/archivePreview', [
				'preview' => $preview
			]);
		endforeach ?>

	</div>

	<div class="offset-md-3 col-md-6 archive-search">

		<div>
			<?php $count = $site->archive()->index()->listed()->count() ?>
			<h2><a href="<?= $site->archive()->url() ?>">Explore all <?= $count ?> archived elements&nbsp;→</a></h2>

			<form id="search" action="archive" autocomplete="off">
				<input class="input" type="search" name="research" placeholder="Keyword" autocomplete="off">
				<input class="button" type="submit" value="Search" title="Search">
			</form>
		</div>

	</div>

</div>
