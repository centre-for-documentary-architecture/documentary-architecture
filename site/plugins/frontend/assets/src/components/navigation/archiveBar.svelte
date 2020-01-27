<script>
  import Link from '../../router/Link.svelte';

  let url = location.origin + '/archive';

  export let page;

</script>

<nav class="bar archive horizontal">

  <div class="left">
    <Link {url} title="Archive" template="archive" />
  </div>

  {#if page.keywords}
    <div class="right keywords">
      {#each page.keywords as keyword}
        <Link url="{url+'?research='+keyword}" template="archive" title="{keyword}" />
      {/each}
    </div>
  {/if}

</nav>
