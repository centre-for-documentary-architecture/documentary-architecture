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

$title = 'C D A → ' . $page->title()->html();
$keywords = array_merge( $page->tags()->split(), $site->tags()->split() );

$description = $site->description();
if( !$page->isHomePage()){
	$page->description()->html()->or( 'Discover '. $page->title()->html()->value() .' at the Centre for Documentary Architecture' );
}

?>
<!doctype html>
<html lang="en">
<head>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width,initial-scale=1.0'>

	<title><?= $title ?></title>

	<link rel="canonical" href="<?= $page->url() ?>">
	<meta name="robots" content="index,follow">
	<meta name="google" content="notranslate">

	<meta name="generator" content="https://moritzebeling.com">
	<link rel="archives" href="<?= page('archive')->url() ?>">
	<link rel="author" href="<?= page('about')->url() ?>">
	<?php if( $parent = $page->parent() ): ?>
		<link rel="index" href="<?= $parent->url() ?>">
	<?php else: ?>
		<link rel="index" href="<?= $site->url() ?>">
	<?php endif ?>

	<?php if( option('cdn-domain') ): ?>
		<link rel="dns-prefetch" href="<?= option('cdn-domain') ?>">
		<link rel="preconnect" href="<?= option('cdn-domain') ?>">
	<?php endif ?>

	<?= css( option('cdn').'/assets/fonts/fonts.css' ) ?>
	<?= css( option('cdn').'/assets/css/reflex.css') ?>
	<?= css('assets/css/global.css') ?>

	<meta name="description" content="<?= $description ?>">
	<meta name="keywords" content="<?= implode(',',$keywords) ?>">

	<?php snippet('header/favicon') ?>

	<meta property="og:url" content="<?= $site->url() ?>" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="<?= $title ?>" />
	<meta property="og:description" content="<?= $description ?>" />
	<meta property="og:site_name" content="<?= $site->title() ?>" />
	<?php if($image = $site->thumbnail()->toFile()): ?>
		<meta property="og:image" content="<?= $image->url() ?>" />
	<?php endif ?>

	<script>
		var lieblingHouseWorldContainer;
		var lieblingHouseWorldInstance;
	</script>

</head>
<body class="<?= implode(' ', array_unique($classlist) ) ?>">

	<?php snippet('navigation/cda') ?>

	<div class="page-wrapper" id="frontend">
