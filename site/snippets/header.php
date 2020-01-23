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
	$page->type(),
	$page->category()
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

	<?php $fav_dir = $site->url()."/assets/favicon/"; ?>
  <link rel="apple-touch-icon" sizes="64x64"   href="<?= $fav_dir; ?>favicon-64.png">
  <link rel="apple-touch-icon" sizes="128x128" href="<?= $fav_dir; ?>favicon-128.png">
  <link rel="apple-touch-icon" sizes="180x180" href="<?= $fav_dir; ?>favicon-180.png">
  <link rel="apple-touch-icon" sizes="256x256" href="<?= $fav_dir; ?>favicon-256.png">
  <link rel="apple-touch-icon" sizes="512x512" href="<?= $fav_dir; ?>favicon-512.png">

  <link rel="icon" type="image/png" sizes="32x32"   href="<?= $fav_dir; ?>favicon-32.png">
  <link rel="icon" type="image/png" sizes="64x64"   href="<?= $fav_dir; ?>favicon-64.png">
  <link rel="icon" type="image/png" sizes="128x128" href="<?= $fav_dir; ?>favicon-128.png">
  <link rel="icon" type="image/png" sizes="180x180" href="<?= $fav_dir; ?>favicon-180.png">
  <link rel="icon" type="image/png" sizes="256x256" href="<?= $fav_dir; ?>favicon-256.png">
  <link rel="icon" type="image/png" sizes="512x512" href="<?= $fav_dir; ?>favicon-512.png">

	<link rel="mask-icon" href="<?= $fav_dir; ?>favicon.svg" color="#000000">

  <meta name="msapplication-TileImage" content="<?= $fav_dir; ?>favicon-144.png">
  <meta name="msapplication-TileColor" content="#000000">
  <meta name="theme-color" content="#000000">

	<script>
		var lieblingHouseWorldContainer;
		var lieblingHouseWorldInstance;
	</script>

</head>
<body class="<?= implode(' ', array_unique($classlist) ) ?>">

	<?php snippet('navigation/cda'); ?>

	<div class="page-wrapper" id="frontend">
