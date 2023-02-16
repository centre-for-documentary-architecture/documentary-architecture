<?php

function migrateLocation( $old ){

    $cc_map = [
        'il' => 'Israel',
        'de' => 'Germany',
        'at' => 'Austria',
        'pl' => 'Poland',
        'gb' => 'United Kingdom',
        'ua' => 'Ukraine',
        'us' => 'United States',
        'uz' => 'Uzbekistan',
        'fr' => 'France',
        'cz' => 'Czech Republic',
        'lv' => 'Latvia',
        'lb' => 'Lebanon',
        'br' => 'Brazil',
        'cn' => 'China',
        'lt' => 'Lithuania',
        'ch' => 'Switzerland',
        'ro' => 'Romania',
        'hu' => 'Hungary',
        'gi' => 'Gibraltar',
        'hr' => 'Croatia',
        'fi' => 'Finland',
    ];

    $country = array_key_exists('addresscountry',$old) ? $old['addresscountry'] : '';
    $country = array_key_exists($country,$cc_map) ? $cc_map[$country] : $country;
    
    $number = '';
    $street = '';

    if( array_key_exists('streetaddress',$old) ){

        preg_match("/\s\d+$|^\d+\s/", $old['streetaddress'], $number_match);
        if( $number_match ){
            $number = trim($number_match[0]);
            $street = trim(str_replace( $number_match, '', $old['streetaddress'] ));
        }

    }

    $new = [
        'lat' => $old['lat'] ?? '',
        'lon' => $old['lon'] ?? '',
        'number' => $number,
        'address' => $street,
        'city' => $old['addresslocality'] ?? '',
        'country' => $country,
    ];

    return $new;
}