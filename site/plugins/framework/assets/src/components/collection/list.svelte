<script>

    export let list;
    export let columns = 1;
    export let category = '';

</script>

<ul class="list">
    {#each list as item}

        <li class="card {item.classlist}">

            <a on:click={navi} href={item.url} data-template={item.template}>
                {#if item.thumbnail}
                    <figure>{@html item.thumbnail}</figure>
                {/if}
                <h4 class="title">{item.title}</h4>
            </a>

        </li>

    {/each}
</ul>
