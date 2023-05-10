<?php

return function ($site) {

    $pages = $site->archive()->entities();

    return $pages->filter(function ($child) {
        return $child->contentIsIncomplete();
    })->sortBy(function ($child) {
        return $child->date_modified()->toObject()->modified()->toDate();
    }, 'desc');

};