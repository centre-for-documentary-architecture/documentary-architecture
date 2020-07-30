<script>

    export let transcript;

    console.log( transcript );

    function columnWidth(){
        if ( transcript.en && transcript.de ){
            return 6;
        }
        return 12;
    }

</script>

<div class="transcript grid">
    {#if transcript.en}
        <div class="en col-sm-{columnWidth()}">
            <h4>EN</h4>
            {@html transcript.en}
        </div>
    {/if}
    {#if transcript.de}
        <div class="de col-sm-{columnWidth()}">
            <h4>DE</h4>
            {@html transcript.de}
        </div>
    {/if}
</div>
