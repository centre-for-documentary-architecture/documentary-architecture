<div id="cda" class="bar cda vertical" onclick="openAboutBar(event)">

    <a class="logo abbr">
        <?= svg('assets/img/cda-logo-bar.svg'); ?>
    </a>
    <a class="logo full" onclick="closeAboutBar(event)">
        <?= svg('assets/img/cda-logo-full.svg'); ?>
    </a>

    <aside class="about">
        <?php snippet('about/about'); ?>
    </aside>

    <button class="bar-close" onclick="closeAboutBar(event)">&times;</button>

</div>
<div class="glass" onclick="closeAboutBar(event)"></div>
