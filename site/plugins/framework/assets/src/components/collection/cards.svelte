<script>

    import Card from './card.svelte';

    export let list;

    export let columns = 2;
    let columnWidth = 12 / columns;
    if( list.length < 4 ){
        columnWidth = Math.min( columnWidth*2, 12 );
    }

</script>

<ul class="cards grid">
    {#each list as item}

        <Card item={item} width={columnWidth}/>

    {/each}
</ul>
