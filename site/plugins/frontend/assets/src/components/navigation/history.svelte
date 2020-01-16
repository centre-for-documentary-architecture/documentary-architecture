<script>
  import { historyList } from './historyListStore.js';

  let listItems;
  const unsubscribe = historyList.subscribe(value => {
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

		listItems = value;
  });

  export let entityUrl = '';

  let outerWidth, innerWidth;

  // ← →
</script>

<nav class="col-12 bar history horizontal white">
  <h3>
    <a class="item" title="Go to start page" href="{window.location.origin}">
        Start
    </a>
  </h3>
  <ol bind:offsetWidth={outerWidth} class="{ innerWidth > outerWidth ? 'alignright' : ''}">
    <div bind:offsetWidth={innerWidth}>
      {#each listItems as item}
        {#if item.url == entityUrl }

          <li class="current { item.double ? 'double' : ''}">
              <span class="item" title="{item.title}">
                  {item.title}
              </span>
          </li>

        {:else}

          <li class="{ item.double ? 'double' : ''}">
              <a class="item" on:click={window.navi} title="{item.title}" href="{item.url}" data-template="{item.template}">
                  {item.title}
              </a>
          </li>

        {/if}
      {/each}
    </div>
  </ol>
</nav>
