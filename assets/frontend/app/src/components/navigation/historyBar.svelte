<script>
  import Link from '../../router/Link.svelte';

  import { onDestroy } from 'svelte';
  import { historyStore } from '../../router/historyStore.js';

  let list;
  const unsubscribe = historyStore.subscribe(value => {
    if( value.length > 50 ){
			value.splice(1,1);
		}

    let doubles = [];

		for( let i = value.length - 1; i >= 0; i--){
			if( doubles.includes( value[i].url) ){
				value[i].double = true;
			} else {
        value[i].double = false;
				doubles.push(value[i].url);
			}
		}

		list = value;
  });
  onDestroy(() => {
		unsubscribe();
	});

  let outerWidth, innerWidth;

  // ← →
</script>

<nav class="bar history horizontal white">
  <h3>
    <a href={window.location.origin} title="Start" >Start</a>
  </h3>
  <ol bind:offsetWidth={outerWidth} class="{ innerWidth > outerWidth ? 'alignright' : ''}">
    <div bind:offsetWidth={innerWidth}>
      {#each list as item}
        <li class="{ item.double ? 'double' : ''}">
          <Link target={item} />
        </li>
      {/each}
    </div>
  </ol>
</nav>
