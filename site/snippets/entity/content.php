<?php

$classlist = [];
if( isset( $class ) ){
	$classlist[] = $class;
}

if( isset( $open ) && $open === true ){
	$classlist[] = 'open';
}

if( !isset( $display ) ){
	$display = 'accordion';
}
if( isset( $presentation ) ){
	$display = 'presentation';
}
if( isset( $accordion ) ){
	$display = 'accordion';
}
$classlist[] = $display;

if( !isset( $layout ) ){
	$layout = $page->content_layout()->value();
}

if( !isset( $collection ) ){
	if( $page->hasChildren() ){
		$collection = $page->children()->listed();
	} else {
		$collection = $page->contextualized()->toPages();
	}
}

$itemClasslist = [];
if( isset( $itemClass ) ){
	$itemClasslist[] = $itemClass;
}

?>
<section class="section content card <?= implode(' ',$classlist) ?>">
	<h3 class="section--header">

		<?php if( $page->content_headline()->isNotEmpty() ){
			echo $page->content_headline()->html();
		} else {
			echo "Content";
		} ?>

	</h3>
	<div class="section--content">

		<?php switch ( $layout ):
			case 'cards':
				snippet('list/cards',[
					'collection' => $collection,
					'columns' => 2,
					'itemClass' => $itemClasslist,
				]);
				break;
			case 'gallery':
				snippet('list/gallery',[
					'collection' => $collection,
					'columns' => 1,
					'itemClass' => $itemClasslist,
				]);
				break;
			default:
				snippet('list/list',[
					'collection' => $collection,
					'itemClass' => $itemClasslist,
				]);
				break;
		endswitch; ?>

	</div>
</section>
