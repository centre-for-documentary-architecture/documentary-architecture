<script>

    import Card from './card.svelte';

    export let list;

</script>

<ul class="entityinfo">
    {#each list as item}

        <Card item={item} info={item.info}/>

    {/each}
</ul>
