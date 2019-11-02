<?php

snippet('header',[
	'class' => 'black',
]);

snippet('navigation/history');

?>

<header class="card sticky-top" id="top">
	<h1>Archive</h1>

	<form id="search">
		<input class="input" type="search" value="<?= html($query) ?>" name="q" placeholder="Type here">
		<input class="button" type="submit" value="Search" title="Search">
	</form>

	<?php foreach( $site->archive()->children()->filter(function ($child) {
			return $child->hasListedChildren();
		}) as $filter ): ?>
		<a href="<?= $filter->url() ?>"><?= $filter->title() ?></a>
	<?php endforeach; ?>

</header>

<?php

snippet('footer');