<script>

    import Card from './card.svelte';

    export let list;

</script>

<ul class="list">
    {#each list as item}

        <Card item={item}/>

    {/each}
</ul>
