<?php

if( !isset( $about ) ){
	$about = $site->find('about');
}

?>

<section class="content">

	<div class="highlight">
		<?= $about->about()->kirbytext(); ?>
	</div>

</section>

<div class="grid">

	<section class="content col-sm-6 team">

		<h2>Team</h2>
		<ul class="columns-2 mono">
			<?php foreach( $about->team()->toUsers() as $user ): ?>
				<li>
					<?= $user->name() ?>
				</li>
			<?php endforeach; ?>
		</ul>

	</section>

	<div class="content col-sm-6">

		<section class="social-media">
			<h2>Social Media</h2>
			<ul class="columns-2 mono">
				<?php foreach( $about->social_media()->toStructure() as $item ): ?>
					<li>
						<a href="<?= $item->link(); ?>" target="_blank">
							<h4><?= parse_url( $item->link()->value() )['host']; ?></h4>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		</section>

		<section class="contact">
			<h2>Contact</h2>
			<div class="mono">

				<?php //echo $about->contact()->kirbytext(); ?>
				<script type="text/javascript" language="javascript">
				// Email obfuscator script 2.1 by Tim Williams, University of Arizona
				// Random encryption key feature coded by Andrew Moulden
				// This code is freeware provided these four comment lines remain intact
				// A wizard to generate this code is at http://www.jottings.com/obfuscator/
				{ coded = "0qwZlq@jM0OGqwZRlD-Rl0idZq0ZOlq.Mlr"
				key = "W8leFL4RUB7bPm2AiMsOtvE0jfDk5rNwTzaI6Yq13XHhoCu9GxcdQyJZgpnVSK"
				shift=coded.length
				link=""
				for (i=0; i<coded.length; i++) {
					if (key.indexOf(coded.charAt(i))==-1) {
						ltr = coded.charAt(i)
						link += (ltr)
					}
					else {
						ltr = (key.indexOf(coded.charAt(i))-shift+key.length) % key.length
						link += (key.charAt(ltr))
					}
				}
				document.write("<a href='mailto:"+link+"'>"+link+"</a>")
				}
				</script><noscript>Switch on JavaScript to see the email address.</noscript>

			</div>
		</section>

		<section>
			<h2>Supporters</h2>
			<div class="supporter-logos">
				<?php foreach( $about->supporter_logos()->toFiles() as $logo ): ?>
					<figure>
						<img src="<?= $logo->url() ?>" alt="Thank you">
					</figure>
				<?php endforeach; ?>
			</div>
		</section>

	</div>

</div>

<nav class="content mono footer-nav">
	<ul>

		<li><?= $site->homePage()->toLink('Home'); ?></li>
		<li><?= $site->find('imprint-privacy-policy')->toLink(); ?></li>

		<?php
		/*
		foreach($kirby->languages() as $language): ?>
		<li <?php e($kirby->language() === $language, ' class="active"') ?>>
			<a href="<?= $page->url($language->code()) ?>" hreflang="<?php echo $language->code() ?>">
				<?= html($language->name()) ?>
			</a>
		</li>
		<?php endforeach;
		*/
		?>

	</ul>
</nav>
