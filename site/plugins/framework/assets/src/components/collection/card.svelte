<script>

    export let item;
    export let width;
    export let info;

</script>

<li class="card {item.classlist} {width ? 'col-'+width : ''} {item.thumbnail ? '' : 'no-thumb'}">
    <a on:click={window.navi} href={item.url} data-template={item.template}>

        <figure>
            {#if item.thumbnail}{@html item.thumbnail}{/if}
        </figure>

        <div class="title">

            <span class="count">{item.count || 1}</span>
            <h4>{@html item.title}</h4>
            {#if info}<h5>{@html info}</h5>{/if}

        </div>

    </a>
</li>
