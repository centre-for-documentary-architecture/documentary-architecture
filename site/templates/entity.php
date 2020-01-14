<?php

snippet('header');

snippet('noscript');

snippet('footer', [
    'include' => [
        js( option('frontend-js'), ['defer'=>true]),
        css( option('frontend-css') )
    ]
]);
