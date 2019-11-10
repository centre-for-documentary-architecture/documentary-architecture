<script>

    export let list;
    export let columns = 1;
    export let category = '';

</script>

<ul class="list">
    {#each list as item}

        <li class="card {item.classlist}">

            <a on:click={window.navi} href={item.url} data-template={item.template}>
                <figure>
                    {#if item.thumbnail}{@html item.thumbnail}{/if}
                </figure>
                <div class="title">
                    {#if item.count}<span class="count">{item.count}</span>{/if}
                    <h4>{item.title}</h4>
                    <h5>{item.info}</h5>
                </div>
            </a>

        </li>

    {/each}
</ul>
