<?php

snippet('header');

// snippet('navigation/history');

?>

<div id="framework" class="grid panels"></div>

<?php

// snippet('navigation/archive');

snippet('footer', [
    'include' => [
        js('media/plugins/centre-for-documentary-architecture/framework/public/bundle.js', ['defer'=>true]),
        css('media/plugins/centre-for-documentary-architecture/framework/public/bundle.css')
    ]
]);
