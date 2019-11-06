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

            {#if item.url == entity.url}
                <li class="current">
                    <a title="{item.title}" href="#top" class="smooth">
                        {item.title}
                    </a>
                </li>
            {:else}
                <li>
                    <a on:click={navi} title="{item.title}" href="{item.url}" data-template="{item.template}">
                        {item.title}
                    </a>
                </li>
            {/if}

        {/each}
    </ol>
</nav>
