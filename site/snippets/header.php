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
	<link rel="dns-prefetch" href="<?= option('cdn-host') ?>">

	<title><?= $page->title()->html(); ?></title>
	<meta name="description" content="<?= $page->description()->html()->or('CDA') ?>">
	<meta name="keywords" content="<?= $page->keywords()->or('architecture, bauhaus, research, data') ?>">

	<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png">
	<link rel="manifest" href="/assets/favicon/site.webmanifest">
	<link rel="mask-icon" href="/assets/favicon/safari-pinned-tab.svg" color="#222222">
	<link rel="shortcut icon" href="/assets/favicon/favicon.ico">
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="msapplication-config" content="/assets/favicon/browserconfig.xml">
	<meta name="theme-color" content="#ffffff">

	<?= js('assets/es6/global.js') ?>

	<?= css( option('cdn').'assets/fonts/fonts.css' ) ?>
	<?= css( option('cdn').'assets/css/normalize.css') ?>
	<?= css( option('cdn').'assets/css/reflex.css') ?>
	<?= css('assets/css/global.css') ?>

</head>
<body class="<?= implode(' ', array_unique($classlist) ) ?>">

	<?php snippet('navigation/cda'); ?>

	<div class="page-wrapper" id="framework">
