<script>

    export let list;

    export let columns = 2;
    let col = 12 / columns;
    if( list.length < 4 ){
        col = Math.min(col*2, 12);
    }

</script>

<ul class="cards grid">
    {#each list as item}

        <li class="card col-{col} {item.classlist}">

            <a on:click={window.navi} href={item.url} data-template={item.template}>
                <figure>
                    {#if item.thumbnail}{@html item.thumbnail}{/if}
                </figure>
                {#if item.count}<span class="count">{item.count}</span>{/if}
                <h4 class="title">{item.title}</h4>
            </a>

        </li>

    {/each}
</ul>
