<script>

    export let transcript;

    let cols = transcript.length === 2 ? 6 : 12;

    function code( lang ){
        return lang.slice(0,2).toLowerCase();
    }

</script>

<div class="transcript grid">
    {#each transcript as item}
        <div class="{code(item.language)} col-sm-{cols}">
            <h4>{item.language}</h4>
            {@html item.text}
        </div>
    {/each}
</div>
