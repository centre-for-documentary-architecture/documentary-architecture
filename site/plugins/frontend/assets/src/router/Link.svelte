<script>
  import { navigateTo } from './navigate.js';

	import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let href = '/';
	export let title = '';
  export let classList = '';
  export { classList as class };

  function onClick(event) {
    navigateTo(href);
    dispatch('click', event);
  }
</script>

<a {href} class={classList} {title} on:click|preventDefault={onClick}>
	<slot>{title}</slot>
</a>
