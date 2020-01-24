<script>

  import Link from '../../router/Link.svelte';
  export let pagination;

  // ← →
</script>

<nav class="pagination bar controls">
    {#if pagination.prev }
      <Link target={pagination.prev} >←</Link>
    {/if}

    {#if pagination.siblings}
      <ol>
        {#each pagination.siblings as item, i}

          <li class="{ item.url == pagination.current.url ? 'current' : ''}">

            <Link target={item} >
              <span class="num">{i+1}</span>
              <span class="title">{item.title}</span>
            </Link>

          </li>

        {/each}
      </ol>
    {/if}

    {#if pagination.next }
      <Link target={pagination.next} >
        <abbr title="Previous: {pagination.next.title}">→</abbr>
      </Link>
    {:else}
      <Link target={pagination.parent} >
        <abbr title="Back to start">Back</abbr>
      </Link>
    {/if}
</nav>
