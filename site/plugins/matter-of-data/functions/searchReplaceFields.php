<?php

function searchReplaceFields( $search, $replace, $fieldname = 'thumbnail' ){
	/*
	* at the moment, this is only safe when using it for thumbnail fields
	*/
	$fieldname = 'thumbnail';

	// make index search
	$matches = kirby()->site()->search( $search, ['fields' => [$fieldname]] );

	foreach ($matches as $match){

		$matchedField = $match->content()->{ $fieldname }()->value();
		$newField = str_replace( $search, $replace, $matchedField );

		$update = [];
		$update[ $fieldname ] = $newField;
		$match->update( $update );

	}

}
