<script>

    import { onMount, onDestroy } from 'svelte';
    import { slide } from 'svelte/transition';

    export let tab;
    export let category;
    export let entity;
    import CollectionList from '../collection/list.svelte';

    let open = isOpen();

    function cellSize( str ){
        str = str.replace(/<[^>]+>/g, '');
        if ( str.length > 160 ){
            return 'long';
        }
        return '';
    }

    function isOpen() {
        if( tab.headline.toLowerCase() === 'meta' ){
            return entity == 'file';
        } else {
            return true;
        }
    }

</script>

<section class="tab accordion {tab.headline.toLowerCase()}" class:open>
    <h3 class="section--header" on:click={() => open = !open}>{ tab.headline || 'Info' }</h3>
    {#if open}
      <dl class="section--content table" transition:slide="{{ duration: 200 }}">
          {#each tab.content as line}
              <div>

                  {#if line.key == ''}
                      <dt class="empty">Description</dt>
                  {:else}
                      <dt>{line.key}</dt>
                  {/if}

                  {#if line.type && line.type == 'collection'}

                      <CollectionList list={line.value} />

                  {:else if Array.isArray( line.value ) }
                      <div>
                      {#each line.value as bit}
                          <dd class="{cellSize( line.key + line.value )}">{@html bit}</dd>
                      {/each}
                      </div>
                  {:else}
                      <dd class="{cellSize( line.key + line.value )}">{@html line.value}</dd>
                  {/if}

              </div>
          {/each}
      </dl>
    {/if}
</section>
