<script>

    export let entity;

    // const location = new URL( url );
    let url = location.origin + '/archive';

</script>

<nav class="col-12 bar archive horizontal">
    <ul>
        <li>
            <a on:click={window.navi} title="Go to Archive" href="{url}" data-template="archive">
                Archive
            </a>
        </li>
    </ul>
</nav>
