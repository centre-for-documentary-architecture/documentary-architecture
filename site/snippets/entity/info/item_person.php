<?php

$life = [];

$start = [];
if( $page->date_start()->isNotEmpty() ){
    $start[] = $page->date_start()->toDateKeyword();
}
if( $page->location_start()->isNotEmpty() ){
    if( empty( $start ) ){
        $start[] = $page->location_start()->toLocation();
    } else {
        $start[] = $page->location_start()->toLocation();
    }
}
if( !empty( $start ) ){
    $life[] = '* '.implode( ', ', $start );
}

$end = [];
if( $page->date_end()->isNotEmpty() ){
    $end[] = $page->date_end()->toDateKeyword();
}
if( $page->location_end()->isNotEmpty() ){
    if( empty( $end ) ){
        $end[] = $page->location_end()->toLocation();
    } else {
        $end[] = '('.$page->location_end()->toLocation().')';
    }
}
if( !empty( $end ) ){
    $life[] = '† '. implode( ' ', $end );
}

if( !empty( $life ) ): ?>
    <dt class="fullwidth">Life</dt>
    <dd class="fullwidth"><?= implode( '<br />', $life); ?></dd>
<?php endif; ?>

<?php if( $page->occupation()->isNotEmpty() ): ?>
    <dt class="fullwidth">Occupation</dt>
    <dd class="fullwidth"><?= $page->occupation()->toKeywords() ?></dd>
<?php endif ?>

<?php
$projects = $page->projects()->split();
if( count( $projects ) > 0 ): ?>
    <dt class="fullwidth">Projects</dt>
    <dd class="fullwidth">
    <?php
    $echo = [];
    foreach( $projects as $item ):
        $echo[] = toPageOrKeyword( $item );
    endforeach;
    echo implode( ', ', $echo );
    ?>
    </dd>
<?php endif; ?>

<?php if( $page->bio()->isNotEmpty() ): ?>
    <dt class="fullwidth">Bio</dt>
    <dd class="fullwidth"><?= $page->bio()->kirbytext() ?></dd>
<?php endif ?>

<?php
$education = $page->education()->toStructure();
if( $education->count() > 0 ): ?>
    <dt class="fullwidth">Education</dt>
    <dd class="fullwidth">
    <?php
    $echo = [];
    foreach( $education as $item ):
        $edu = [];

        // date (- date)
        if( $item->date_start()->isNotEmpty() ){
            $date = $item->date_start()->toDateKeyword();

            if( $item->date_end()->isNotEmpty() ){
                $date .= ' – '.$item->date_end()->toDateKeyword();
            }
            $edu[] = $date;
        }

        // text
        $edu[] = $item->text()->kirbytags();

        // location
        foreach( $item->location()->yaml() as $loc ):
        
            if( $loc['addresslocality'] ){
                $edu[] = toKeyword( $loc['addresslocality'] );
            }
            if( $loc['addresscountry'] ){
                $cc = strtoupper( $loc['addresscountry'] );
                $edu[] = toKeyword( $cc );
            }
        
        endforeach;

        $echo[] = implode( ', ', $edu );

    endforeach;
    echo implode( '<br />', $echo );
    ?>
    </dd>
<?php endif; ?>