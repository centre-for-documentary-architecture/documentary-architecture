<?php

return function ($site) {

    $pages = $site->archive()->entities();

    return $pages->sortBy(function ($child) {
        return $child->date_modified()->toObject()->modified()->toDate();
    }, 'desc');

};