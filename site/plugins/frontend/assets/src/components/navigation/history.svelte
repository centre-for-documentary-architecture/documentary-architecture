<script>
  import { historyStore } from '../../router/historyStore.js';
  import Link from '../../router/Link.svelte';

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

  let outerWidth, innerWidth;

  // ← →
</script>

<nav class="col-12 bar history horizontal white">
  <h3>
    <Link title="Start" url={window.location.origin} />
  </h3>
  <ol bind:offsetWidth={outerWidth} class="{ innerWidth > outerWidth ? 'alignright' : ''}">
    <div bind:offsetWidth={innerWidth}>
      {#each list as item}

        <Link target={item} classList="{ item.double ? 'double' : ''}" />

      {/each}
    </div>
  </ol>
</nav>
