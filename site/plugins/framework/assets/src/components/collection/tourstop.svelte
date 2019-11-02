<script>

    export let list;

</script>

<ul class="gallery">
    {#each list as item}
    
        {#if item.worlditem == null }

            <li class="card">

                <a on:click={navi} href={item.url} data-template={item.template}>
                    {#if item.thumbnail}
                        <figure>{@html item.thumbnail}</figure>
                    {/if}
                    <h4 class="title">{item.title}</h4>
                </a>
                
            </li>

        {:else}

            <li class="card worlditem">

                <a on:click={navi} href={item.url} data-template={item.template}>
                    {#if item.thumbnail}
                        <figure>{@html item.thumbnail}</figure>
                    {/if}
                    <h4 class="title">{item.title}</h4>
                </a>
                
            </li>

        {/if}
        
    {/each}
</ul>