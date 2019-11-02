<script>

    export let tab;
    export let category;

</script>

<section class="tab text">

    <h3 class="section--header">{ tab.headline }</h3>

    <div class="bodytext">{@html tab.content.html || ''}</div>

</section>
