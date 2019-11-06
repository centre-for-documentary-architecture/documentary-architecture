<nav class="bar pagination card">

    <ol class="left">
    <?php $i = 1; foreach( $page->siblings() as $sibling ):
        if( $sibling->is( $page ) ){
            $class = 'active';
        } else {
            $class = '';
        }
        echo Html::a( $sibling->url(), $i, [
            'title' => 'Tourstop '.$i.': '.$sibling->title()->html(),
            'class' => $class.' ajax'
        ]);
        $i++;
    endforeach; ?>
    </ol>

    <?php if( $page->hasNextListed() ):
        echo Html::a( $page->nextListed()->url(), 'Next', [
            'rel' => 'next',
            'class' => 'ajax'
        ]);
    endif ?>

</nav>
