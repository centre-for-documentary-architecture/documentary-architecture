<script>

  import { slide } from 'svelte/transition';

  export let tab;
  export let category;
  export let entity;
  import CollectionList from '../collection/list.svelte';

  let open = false;

  /*
  function accordionToggle( event ){
      let parent = event.target.closest('.accordion');
      let content = parent.getElementsByClassName("section--content")[0];

      if( parent.classList.contains('open') ){
          parent.classList.remove('open');
          content.style.maxHeight = 0;
      } else {
          parent.classList.add('open');
          content.style.maxHeight = content.scrollHeight+'px';
      }
  }
  */

  function cellSize( str ){

      str = str.replace(/<[^>]+>/g, '');
      if ( str.length > 160 ){
          return 'long';
      }
      return '';

  }

  function tabClass( cl = '' ){
      cl = cl.toLowerCase();
      if( cl != 'meta' || entity == 'file' ){
          open = true;
      }
      return cl;
  }

</script>

<section class="tab accordion {tabClass( tab.headline )}" class:open>
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
