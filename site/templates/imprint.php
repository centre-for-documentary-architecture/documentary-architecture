<?php

snippet('header',[
	'class' => 'black imprint'
]);

snippet('navigation/history');

?>

<div class="grid">

	<section class="col-sm-6 panel content">

		<h1>Imprint</h1>
		<div>
			<?= $page->imprint()->kirbytext(); ?>
		</div>

	</section>

	<section class="col-sm-6 panel content">

		<h1>Privacy Policy</h1>
		<div>
			<?= $page->privacy()->kirbytext(); ?>
		</div>

	</section>

</div>

<?php

snippet('navigation/archive');

snippet('footer');
