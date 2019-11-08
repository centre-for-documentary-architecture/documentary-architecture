<script>

    export let pagination;

    // ← →
</script>

<nav class="pagination bar controls">

    {#if pagination.prev }
        <a on:click={navi} title="Previous: {pagination.prev.title}" href={pagination.prev.url} data-template={pagination.prev.template}>←</a>
    {/if}

    {#if pagination.siblings}
        <ol>
            {#each pagination.siblings as item, i}

                <li class="{ item.url == pagination.current.url ? 'current' : ''}">
                    <a on:click={navi} title="{item.title}" href="{item.url}" data-template="{item.template}">
                        <span class="num">{i+1}</span>
                        <span class="title">{item.title}</span>
                    </a>
                </li>

            {/each}
        </ol>
    {/if}


    {#if pagination.next }
        <a on:click={navi} title="Next: {pagination.next.title}" href="{pagination.next.url}" data-template="{pagination.next.template}">→</a>
    {:else}
        <a on:click={navi} title="Back to start" href="{pagination.parent.url}" data-template="{pagination.parent.template}">Back</a>
    {/if}

</nav>
