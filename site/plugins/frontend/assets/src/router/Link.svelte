<script>
  import { navigateTo } from './navigateTo.js';

	import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let target = {};

  export let url = undefined;
	export let title = undefined;
  export let template = false;

  target.url = url || target.url;
  target.title = title || target.title;
  target.template = template || target.template;

  export let replace = false;
  export let classList = '';
  export { classList as class };

  function onClick(event) {
    navigateTo( target.url, replace, target);
    dispatch('click', event);
  }
</script>

<a href={target.url} title={target.title} class={classList} class:current={target.url === window.location.href} on:click|preventDefault={onClick}>
	<slot>{target.title}</slot>
</a>
