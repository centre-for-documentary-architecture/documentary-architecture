<?php

snippet('header');

snippet('footer', [
    'include' => [
        js('media/plugins/centre-for-documentary-architecture/frontend/public/bundle.js', ['defer'=>true]),
        css('media/plugins/centre-for-documentary-architecture/frontend/public/bundle.css')
    ]
]);
