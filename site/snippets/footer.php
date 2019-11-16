    </div><!-- .page-wrapper -->

    <?php
    if( isset( $include ) ){
        foreach( $include as $script ){
            echo $script;
        }
    }
    ?>

    <?= js('assets/es6/global.js', true) ?>
    <?= js( option('cdn').'assets/js/lazysizes.min.js', true) ?>
    <?= js( option('cdn').'assets/js/smooth-scroll.min.js') ?>

    <script>
        var scroll = new SmoothScroll('a.smooth[href*="#"]',{
            speed: 500,
            offset: 28
        });
    </script>

</body>
</html>
