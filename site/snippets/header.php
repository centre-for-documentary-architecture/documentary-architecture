<?php

/**
 * recieves
 * string $class (body class)
 */

// body class
$classlist = [
	$page->theme(),
	$page->layout(),
	$page->template(),
	$page->entity(),
	// $page->type(),
	// $page->category()
];
if( isset( $class ) ){
	$classlist[] = $class;
}

?>
<!doctype html>
<html lang="en">
<head>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width,initial-scale=1.0'>
	<meta name="robots" content="noindex,nofollow">
	<?php if( option('cdn-domain') ): ?>
		<link rel="dns-prefetch" href="<?= option('cdn-domain') ?>">
		<link rel="preconnect" href="<?= option('cdn-domain') ?>">
	<?php endif; ?>

	<title><?= $page->title()->html(); ?></title>

	<?= css( option('cdn').'/assets/fonts/fonts.css' ) ?>
	<?= css( option('cdn').'/assets/css/normalize.css') ?>
	<?= css( option('cdn').'/assets/css/reflex.css') ?>
	<?= css('assets/css/global.css') ?>

	<meta name="description" content="<?= $page->description()->html()->or('CDA') ?>">
	<meta name="keywords" content="<?= $page->keywords()->or('architecture, bauhaus, research, data') ?>">

	<?php snippet('header/favicon'); ?>

	<script>
		var lieblingHouseWorldContainer;
		var lieblingHouseWorldInstance;
	</script>

</head>
<body class="<?= implode(' ', array_unique($classlist) ) ?>">

	<?php snippet('navigation/cda'); ?>

	<div class="page-wrapper" id="frontend">
