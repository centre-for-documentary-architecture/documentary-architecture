<?php

use Kirby\Cms\Html;

/**
 * create link to archive search with query string
 */
function toKeyword(string $keyword, $text = false, $title = false)
{
	$keyword = trim($keyword, " -,.;+\t\n\r\0\x0B");
	if (!$keyword) {
		return;
	}
	$text = ucfirst(r($text, $text, $keyword));
	$title = ucfirst(r($title, $title, $keyword));
	return Html::a(
		kirby()->page('archive')->url() . '?research=' . $keyword,
		$text,
		[
			'title' => 'Research "' . $title . '" (' . esc($keyword) . ')',
			'rel' => 'search',
			'class' => 'follow'
		]
	);
}

/**
 * create multiple links
 */
function toKeywords($terms, string $delimiter = ',', string $glue = ', ')
{
	if (is_string($terms)) {
		$terms = explode($delimiter, $terms);
	}
	$return = [];
	foreach ($terms as $term) {
		$return[] = toKeyword($term);
	}
	return implode($glue, $return);
}

/**
 * external link
 */
function toLink($url, $text = false)
{
	if (!$text) {
		$host = parse_url($url);
		if ($host = $host['host']) {
			$text = $host;
		} else {
			$text = $url;
		}
	}
	$text = str_replace('www.', '', $text);
	return Html::a(
		$url,
		$text,
		[
			'target' => '_blank',
			'class' => 'follow',
			'title' => 'Open "' . $url . '"'
		]
	);
}

/**
 * create link to archive search with date query
 */
function toDateKeyword(string $date)
{

	// Decade YYY0s -> YYY
	if (preg_match('/^\d{3}(?=0s)/', $date, $match)) {
		return toKeyword($match[0], $date, $date);
	}

	$datetime = explode(' ', $date);
	$dates = explode('-', $datetime[0]);

	// YYYY-YYYY
	if (preg_match('/^\d{4}-\d{4}$/', $date)) {
		return toKeyword($dates[0]) . '-' . toKeyword($dates[1]);
	}

	// YYYY(-MM)(-DD)
	$return = [];
	$key = '';
	foreach ($dates as $date) {
		if ($key) {
			$key .= '-';
		}
		$key .= $date;
		$return[] = toKeyword($key, $date);
	}
	$datetime[0] = implode('-', $return);
	return implode(' ', $datetime);
}
