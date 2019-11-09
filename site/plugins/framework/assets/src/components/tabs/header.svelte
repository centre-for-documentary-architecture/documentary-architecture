<script>

    export let entity;
    export let tab;
    export let category;

</script>

<header id="top" class="tab">

    <h1 class="title">{@html tab.content.h1}</h1>

    {#if tab.content.h2 }
        <h2 class="subtitle">{@html tab.content.h2}</h2>
    {/if}

    {#if tab.content.p }
        <div class="highlight">{@html tab.content.p}</div>
    {/if}

    {#if category == 'overview'}
        <div class="invitation">
            <button class="blue" on:click={window.worldSetRoaming}>Start exploring →</button>
        </div>
    {/if}
    {#if category == 'tour'}
        <div class="invitation">
            <button class="blue" on:click={window.worldSetRoaming}>Start promenade →</button>
        </div>
    {/if}

</header>
