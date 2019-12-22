<script context="module">

  let historyList = [];

  export function historyAdd( entity ){
    historyList = [...historyList, entity];
    console.log( historyList );
  }

</script>

<script>

  $: historyList;

  // export let entity;

  // ← →
</script>

<nav class="col-12 bar history horizontal white">
    <ol>
        {#each historyList as item, i}

            {i}

        {/each}
    </ol>
</nav>
