<script>
  import { historyList } from './historyListStore.js';

  let listItems;
  const unsubscribe = historyList.subscribe(value => {
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

  export let start;
  export let entityUrl = '';

  // ← →
</script>

<nav class="col-12 bar history horizontal white">
  <h3>
    <a on:click={window.navi} title="{start.title}" href="{start.url}" data-template="{start.template}">
        {start.title}
    </a>
  </h3>
  <ol>
    {#each listItems as item}

      <li class="{ item.url == entityUrl ? 'current' : ''} { item.double ? 'double' : ''}">
          <a on:click={window.navi} title="{item.title}" href="{item.url}" data-template="{item.template}">
              {item.title}
          </a>
      </li>

    {/each}
  </ol>
</nav>
