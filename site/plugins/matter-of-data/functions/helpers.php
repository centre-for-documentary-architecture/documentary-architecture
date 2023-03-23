<?php

function entity(string $id, $site = null)
{

    if (!$site) {
        $site = kirby()->site();
    }

    if ($page = $site->find($id)) {
        return $page;
    }
    return $site->file($id);
}

function wbr(string $text): string
{
    $replace = [
        '-' => '-<wbr>',
        '_' => '_<wbr>',
        '/' => '/<wbr>',
        '.' => '.<wbr>'
    ];
    return strtr($text, $replace);
}
