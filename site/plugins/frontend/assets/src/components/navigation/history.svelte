<script>

    export let entity;

    function isEqual( x, y, echo){
        return echo;
    }

    // ← →
</script>

<nav class="col-12 bar history horizontal white">
    <ol>
        {#each entity.breadcrumbs as item}

            <li class="{ item.url == entity.url ? 'current' : ''}">
                <a on:click={window.navi} title="{item.title}" href="{item.url}" data-template="{item.template}">
                    {item.title}
                </a>
            </li>

        {/each}
    </ol>
</nav>
