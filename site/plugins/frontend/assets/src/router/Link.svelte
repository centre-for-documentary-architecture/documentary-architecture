<script>
  import { navigateTo } from './navigateTo.js';
  import { replaceContent } from '../liebling-house/replaceContent.js';

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let target = {};

  export let url = false;
  export let title = false;
  export let template = false;

  target.url = url || target.url;
  target.title = title || target.title;
  target.template = template || target.template;

  export let replace = false;
  export let classList = '';
  export { classList as class };

  function onClick(event) {
    if( target.worlditem && document.body.classList.contains('liebling-house') ){
      replaceContent( target.url, target, replace);
    } else {
      navigateTo( target.url, target, replace);
    }
    dispatch('click', event);
  }
</script>

<a href={target.url} title={target.title} class={classList} class:current={target.url === window.location.href} on:click|preventDefault={onClick}>
	<slot>{target.title}</slot>
</a>
