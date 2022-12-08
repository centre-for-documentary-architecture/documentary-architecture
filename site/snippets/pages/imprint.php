<div class="grid">

	<section class="col-sm-6 panel content imprint">

		<h1>Imprint</h1>
		<div>
			<?= $page->imprint()->kirbytext() ?>
			<p class="mono">© 2019–<?= date('Y') ?></p>
		</div>

	</section>

	<section class="col-sm-6 panel content imprint">

		<h1>Privacy Policy</h1>
		<div>
			<?= $page->privacy()->kirbytext() ?>
		</div>

	</section>

</div>
