<?php if( $page->date_start()->isNotEmpty() ): ?>
    <dt>Construction date</dt>
    <dd><?= $page->date_start()->toDateKeyword() ?></dd>
<?php endif ?>

<?php if( $page->location_start()->isNotEmpty() ): ?>
    <dt class="fullwidth">Address</dt>
    <dd class="fullwidth"><?= $page->location_start()->toLocation() ?></dd>
<?php endif ?>

<?php
$architects = $page->architects()->split();
if( count( $architects ) > 0 ): ?>
    <dt>Architects</dt>
    <dd>
    <?php
    $echo = [];
    foreach( $architects as $item ):
        $echo[] = toPageOrKeyword( $item );
    endforeach;
    echo implode( ', ', $echo );
    ?>
    </dd>
<?php endif; ?>