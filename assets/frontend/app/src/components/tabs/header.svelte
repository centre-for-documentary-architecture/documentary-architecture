<script>

    export let entity;
    export let tab;
    export let category;
    export let image;

    console.log( entity );

</script>

<header id="top" class="tab">

    <h1 class="title">{@html tab.content.h1}</h1>

    {#if tab.content.h2 }
        <h2 class="subtitle">{@html tab.content.h2}</h2>
    {/if}

    {#if entity === 'item' && image}
        <figure>
            {@html image}
        </figure>
    {/if}

    {#if tab.content.p }
        <div class="highlight">{@html tab.content.p}</div>
    {/if}

</header>
