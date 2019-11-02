<?php if( $page->date_start()->isNotEmpty() ): ?>
    <dt>Date of Recording</dt>
    <dd><?= $page->date_start()->toDateKeyword() ?></dd>
<?php endif ?>

<?php
$location_start = $page->location_start()->yaml();
if( count( $location_start ) > 0 ): ?>
    <dt class="fullwidth">Locations of Recording</dt>
    <dd class="fullwidth">
    <?php
    $echo = [];
    foreach( $location_start as $item ):
        $loc = [];
        if( $item['addresslocality'] ){
            $loc[] = toKeyword( $item['addresslocality'] );
        }
        if( $item['addresscountry'] ){
            $cc = strtoupper( $item['addresscountry'] );
            $loc[] = toKeyword( $cc );
        }
        $echo[] = implode(', ', $loc);
    endforeach;
    echo implode(', ',$echo);
    ?>
    </dd>
<?php endif; ?>

<?php
$starring = $page->starring()->toPages();
if( $starring->count() > 0 ): ?>
    <dt class="fullwidth">Starring</dt>
    <dd class="fullwidth">
    <?php
    $echo = [];
    foreach( $starring as $star ):
        $echo[] = $star->toLink();
    endforeach;
    echo implode(', ',$echo);
    ?>
    </dd>
<?php endif; ?>