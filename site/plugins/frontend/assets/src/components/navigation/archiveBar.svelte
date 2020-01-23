<script>
  import Link from '../../router/Link.svelte';

  let url = location.origin + '/archive';

  let keywords = false;
	import { pageStore } 	from '../../router/pageStore.js';
  const unsubscribe = pageStore.subscribe(value => {
    if( value.loading === true ){
      return;
    }
		keywords = value.keywords;
    console.log( keywords );
  });

</script>

<nav class="col-12 bar archive horizontal">

  <div class="left">
    <Link {url} title="Archive" template="archive" />
  </div>

  {#if keywords}
    <div class="right keywords">
      {#each keywords as keyword}
        <a on:click={window.navi} href="{url+'?research='+keyword}" data-template="archive">{keyword}</a>
      {/each}
    </div>
  {/if}

</nav>
