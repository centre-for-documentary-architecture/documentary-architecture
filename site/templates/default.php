<?php

snippet('header');

?>

<div class="view">
	<main>

		<?php
		
		snippet('entity/header');

		snippet('entity/presentation',[
			'open' => true
		]);

		snippet('entity/info');

		snippet('entity/contexts',[
			'collection' => $page->contexts()->toEntities()
		]);

		snippet('entity/meta');

		?>

	</main>
</div>

<?php

snippet('footer');