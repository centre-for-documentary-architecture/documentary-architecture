<?php
/*
* several functions that create html anchor tags
*/

function wbr( string $text ): string
{
	$replace = [
        '-' => '-<wbr>',
        '_' => '_<wbr>',
        '.' => '.<wbr>'
	];
	return strtr( $text, $replace );
}

function toDateKeyword( string $date ){

	// Decade YYY0s -> YYY
	if( preg_match('/^\d{3}(?=0s)/', $date, $match ) ){
		return toKeyword( $match[0], $date, $date );
	}

	$datetime = explode(' ',$date);
	$dates = explode('-', $datetime[0] );

	// YYYY-YYYY
	if( preg_match('/^\d{4}-\d{4}$/', $date ) ){
		return toKeyword( $dates[0] ).'-'.toKeyword( $dates[1] );
	}

	// YYYY(-MM)(-DD)
	$return = [];
	$key = '';
	foreach ($dates as $date) {
		if($key){
			$key .= '-';
		}
		$key .= $date;
		$return[] = toKeyword( $key, $date );
	}
	$datetime[0] = implode( '-', $return );
	return implode( ' ', $datetime );
}


function toLocation( $location ){
	/*
	* recieves $location[
	*   title. streetaddress, postalcode, addresslocality, addresscountry, historic, lat, lon
	* ];
	*/
	$return = [];

	if( isset( $location['streetaddress']) ){
		$return[] = toKeyword( $location['streetaddress'] );
	}

	if( isset( $location['addresslocality']) ){
		$zip = '';
		if( isset( $location['postalcode'] ) ){
			$zip .= toKeyword( $location['postalcode'] ).' ';
		}
		$return[] = $zip . toKeyword( $location['addresslocality'] );

	}

	if( isset( $location['addresscountry']) ){
		$return[] = toKeyword( strtoupper( $location['addresscountry'] ) );
	}

	$return = implode(', ', array_filter($return) ).' ';

	if( isset( $location['addresscountryhistoric'] )){
		if( $location['addresscountryhistoric'] ){
			$return .= '(formerly '.toKeyword( $location['addresscountryhistoric'] ).')';
		}
	}

	if( isset( $location['title'] ) ){
		$title = toKeyword( $location['title'] );
		if( $title != '' ){
			$return = $title.'. '.$return;
		}
	}


	if( isset($location['lat']) && isset($location['lon']) ){
		// http://www.google.com/maps/place/lat,lng

		$geo = str_replace(',','.',strval( $location['lat'] )).','.str_replace(',','.',strval( $location['lon'] ));

		$return .= ' '.Html::a(
				'http://www.google.com/maps/place/'.$geo,
				'('.$geo.')',
				$attr = [
					'target' => '_blank',
					'title' => 'Show on map',
					'rel' => 'nofollow'
				]
		);

	}

	return $return;
}




function toSource( $source ){
	/*
	* recieves $source[
	*   title, author, date, publisher, website, country
	* ];
	*/
	return Html::a(
		$source['website'],
		'[1]',
		$attr = [
			'title' => $source['title'],
			'class' => 'inline-source'
		]
	);

	$return = [];

	if( $source['author'] ){
		$return[] = toKeywords( $source['author'] );
	}

	if( $source['title'] ){
		$return[] = toKeyword( $source['title'] );
	}

	if( $source['date'] ){
		$return[] = toDateKeyword( $source['date'] );
	}

	if( $source['publisher'] ){
		$return[] = toKeyword( $source['publisher'] );
	}

	if( $source['country'] ){
		$return[] = toKeyword( $source['country'] );
	}

	if( $source['website'] ){
		$return[] = toKeyword( $source['website'] );
	}

	return implode( ', ', $return );
}
