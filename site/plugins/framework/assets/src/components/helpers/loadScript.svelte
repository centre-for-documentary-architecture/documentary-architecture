<script>
    import { onDestroy } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    /**
     * array of urls
     */
    export let dependencies;
    let dependenciesLoaded = 0;

    let scripts = [];
    for (const src of dependencies) {
        let script = document.createElement('script');
        script.src = src;
        script.onload = function() {

            dependenciesLoaded++;
            console.log( 'Load '+dependenciesLoaded+' of '+dependencies.length+': '+src);
            if( dependenciesLoaded < dependencies.length ){
                return;
            }

            setTimeout(() => dispatch('loaded', {
                loaded: true
            }), 1);
        };
        document.body.appendChild(script);
        scripts.push( script );
    }

    onDestroy(() => {
        for (const script of scripts) {
            console.log( 'Remove script '+script.src );
            script.remove();
        }
        scripts = [];
    });
</script>
