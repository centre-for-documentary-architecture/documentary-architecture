<?php

if( !isset( $about ) ){
	$about = $site->find('about');
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

				<?php //echo $about->contact()->kirbytext() ?>
				<script type="text/javascript" language="javascript">
				// Email obfuscator script 2.1 by Tim Williams, University of Arizona
				// Random encryption key feature coded by Andrew Moulden
				// This code is freeware provided these four comment lines remain intact
				// A wizard to generate this code is at http://www.jottings.com/obfuscator/
				{ coded = "0qwZlq@jM0OGqwZRlD-Rl0idZq0ZOlq.Mlr"
				key = "W8leFL4RUB7bPm2AiMsOtvE0jfDk5rNwTzaI6Yq13XHhoCu9GxcdQyJZgpnVSK"
				shift=coded.length
				link=""
				for (i=0; i<coded.length; i++){
					if( key.indexOf(coded.charAt(i))==-1 ){
						ltr = coded.charAt(i)
						link += (ltr)
					} else {
						ltr = (key.indexOf(coded.charAt(i))-shift+key.length) % key.length
						link += (key.charAt(ltr))
					}
				}
				document.write("<a href='mailto:"+link+"'>"+link+"</a>")
				}
				</script><noscript>Switch on JavaScript to see the email address.</noscript>

			</div>
		</section>

		<?php if( $site->issn()->isNotEmpty() ): ?>
			<section>
				<p class="mono"><?= $site->issn() ?></p>
			</section>
		<?php endif ?>

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

<nav class="content mono footer-nav">
	<ul>
		<li><?= $site->homePage()->toLink('Start') ?></li>
		<li><?= $site->find('imprint-privacy-policy')->toLink() ?></li>
	</ul>
</nav>
