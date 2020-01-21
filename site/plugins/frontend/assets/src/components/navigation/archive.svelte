<script>
  import Link from '../../router/Link.svelte';

  export let keywords = [];
  let url = location.origin + '/archive';

</script>

<nav class="col-12 bar archive horizontal">

  <div class="left">
    <Link {url} title="Archive" template="archive" />
  </div>
  {#if keywords.length > 0}
    <div class="right keywords">
      {#each keywords as keyword}
        <a on:click={window.navi} href="{url+'?research='+keyword}" data-template="archive">{keyword}</a>
      {/each}
    </div>
  {/if}

</nav>
