<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let script = document.createElement('script');

    export let src;
	script.src = src;
	script.onload = function() {
        dispatch('loaded', {
            loaded: true
        });
        console.log( 'Load script '+src );
	};
    document.body.appendChild(script);

    import { onDestroy } from 'svelte';

    onDestroy(() => {
        script.remove();
        console.log( 'Remove script '+src );
    });
</script>
