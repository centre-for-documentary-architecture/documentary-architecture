<script>

    import Card from './card.svelte';

    export let list;

    export let columns = 2;
    let columnWidth = 12 / columns;

    import { beforeUpdate } from 'svelte';
	beforeUpdate(() => {
        columnWidth = 12 / columns;
        if( list.length < 4 ){
            if( columns == 2 ){

                columnWidth = 12;

            }
        }
    });

</script>

<ul class="cards grid">
    {#each list as item}

        <Card item={item} width={columnWidth}/>

    {/each}
</ul>
