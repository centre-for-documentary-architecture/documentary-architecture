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
  });

</script>

<nav class="bar archive horizontal">

  <div class="left">
    <Link {url} title="Archive" template="archive" />
  </div>

  {#if keywords}
    <div class="right keywords">
      {#each keywords as keyword}
        <Link url="{url+'?research='+keyword}" template="archive" title="{keyword}" />
      {/each}
    </div>
  {/if}

</nav>
