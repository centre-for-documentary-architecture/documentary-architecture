<?php

foreach ( $data->value()->toEntities() as $p): ?>
	<div><?= $p->toLink(); ?></div>
<?php endforeach;
