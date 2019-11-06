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

	if( isset( $location['title'] ) ){
		$return[] = $location['title'];
	}

	if( isset( $location['streetaddress']) ){
		$return[] = toKeyword( $location['streetaddress'] );
	}

	if( isset( $location['addresslocality']) ){

		$address = '';
		if( isset( $location['postalcode'] ) ){
			$address .= toKeyword( $location['postalcode'] ).' ';
		}
		$return[] = $address . toKeyword( $location['addresslocality'] );

	}

	if( isset( $location['addresscountry']) ){

		$country = toKeyword( strtoupper( $location['addresscountry'] ) );

		if( isset( $location['addresscountryhistoric'] )){
			if( $historic = toKeyword( $location['addresscountryhistoric'] ) ){
				$country .= ' (formerly '.$historic.')';
			}
		}

		$return[] = $country;

	}

	if( isset($location['lat']) && isset($location['lon']) ){
		// http://www.google.com/maps/place/lat,lng

		$geo = strtr( strval( $location['lat'] ), ',', '.' ).','.strtr( strval( $location['lon'] ), ',', '.' );

		$return[] = ' '.Html::a(
			'http://www.google.com/maps/place/'.$geo,
			'('.$geo.')',
			$attr = [
				'target' => '_blank',
				'title' => 'Show on map',
				'rel' => 'nofollow'
			]
		);

	}

	$return = implode('<br />', array_filter($return) ).' ';

	return $return;
}




function toSource( $source, $website ){
	/*
	* recieves $source[
	*   declaration, website
	* ];
	*/

	if( $website ){
		return toLink( $website, $source );
	}
	return toKeyword( $source );
}
