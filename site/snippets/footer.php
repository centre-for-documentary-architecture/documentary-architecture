    </div><!-- .page-wrapper -->
    
    <?= js('assets/js/lazysizes.min.js', true) ?>

    <?= js('assets/js/smooth-scroll.min.js') ?>
    <script>
        var scroll = new SmoothScroll('a.smooth[href*="#"]',{
            speed: 500,
            offset: 28
        });
    </script>

    <?php
    if( isset( $include ) ){
        foreach( $include as $script ){
            echo $script;
        }
    }
    ?>
    
</body>
</html>