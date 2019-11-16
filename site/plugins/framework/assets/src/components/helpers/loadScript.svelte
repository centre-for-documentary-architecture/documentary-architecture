<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let script = document.createElement('script');

    export let src;
	script.src = src;
	script.onload = function() {
        setTimeout(() => dispatch('loaded', {
            loaded: true
        }), 1);
        console.log( 'Load script '+src );
	};
    document.body.appendChild(script);

    import { onDestroy } from 'svelte';

    onDestroy(() => {
        script.remove();
        console.log( 'Remove script '+src );
    });
</script>
