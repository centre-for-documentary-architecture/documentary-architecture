<?php

if( !isset( $about ) ){
	$about = $site->find('info');
}

?>

<section class="content">

	<div class="highlight">
		<?= $about->about()->kirbytext() ?>
	</div>

</section>

<div class="grid">

	<section class="content col-sm-6 team">

		<h2>Team</h2>
		<ul class="columns-2 mono">
			<?php foreach( $site->team()->toUsers() as $user ): ?>
				<li><?= $user->name() ?></li>
			<?php endforeach ?>
		</ul>

	</section>

	<div class="content col-sm-6">

		<section class="social-media">
			<h2>Follow CDA</h2>
			<ul class="columns-2 mono">
				<?php foreach( $site->links()->toStructure() as $item ): ?>
					<li>
						<h4>
							<a href="<?= $item->href() ?>" target="_blank" rel="noopener nofollow noreferrer"><?= $item->title()->or( parse_url( (string)$item->href() )['host'] ) ?></a>
						</h4>
					</li>
				<?php endforeach ?>
			</ul>
		</section>

		<section class="contact">
			<h2>Contact</h2>
			<div class="mono">
				<a href="mailto:<?= $site->email() ?>"><?= $site->email() ?></a>
			</div>
		</section>

		<?php if( $logos = $site->supporters()->toFiles() ): ?>
			<section>
				<h2>Supporters</h2>
				<div class="supporter-logos">
					<?php foreach( $logos as $logo ): ?>
						<figure>
							<img title="Thank you" src="<?= $logo->url() ?>" alt="<?= $logo->description() ?>">
						</figure>
					<?php endforeach ?>
				</div>
			</section>
		<?php endif ?>

	</div>

</div>

<nav class="content mono footer-nav grid">
	<ul class="col-6">
		<li><?= $site->homePage()->toLink('Start') ?></li>
		<li><?= $site->find('info/imprint')->toLink() ?></li>
	</ul>
	<ul class="col-6">
		<?php if( $site->issn()->isNotEmpty() ): ?>
			<li><?= $site->issn() ?></li>
		<?php endif ?>
		<li>© 2019-<?= date('Y') ?></li>
	</ul>
</nav>
