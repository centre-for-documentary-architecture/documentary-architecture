<script>

    export let item;
    export let width;
    export let info = false;
    export let classname = '';

</script>

<li class="card {classname} {item.classlist} {width ? 'col-'+width : ''} {item.thumbnail ? '' : 'no-thumb'}">
    <a on:click={window.navi} href={item.url} data-template={item.template}>

        <figure>
            {#if item.thumbnail}{@html item.thumbnail}{/if}
        </figure>

        <div class="title">

            <span class="count">{item.count || ''}</span>
            <h4>{@html item.title}</h4>
            {#if info}<h5>{@html info}</h5>{/if}

        </div>

    </a>
</li>
