<script>

  export let keywords = [];
  let url = location.origin + '/archive';

</script>

<nav class="col-12 bar archive horizontal">

  <div class="left">
    <a on:click={window.navi} title="Go to Archive" href="{url}" data-template="archive">Archive</a>
  </div>
  {#if keywords.length > 0}
    <div class="right keywords">
      {#each keywords as keyword}
        <a on:click={window.navi} href="{url+'?research='+keyword}" data-template="archive">{keyword}</a>
      {/each}
    </div>
  {/if}

</nav>
