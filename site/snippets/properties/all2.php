<?php if( $data->title()->isNotEmpty() ): ?>
    <dt class="fullwidth"><?= $data->title(); ?></dt>
<?php endif; ?>

<dd class="fullwidth"><?php

// dump( $data->kombi() );

foreach($data->kombi()->toBuilderBlocks() as $block):
    // dump( $block );
    snippet([
        'properties/'.$block->_key(),
        'properties/default'
    ], ['data' => $block]);
endforeach;

?></dd>