<script>
  import Link from '../../router/Link.svelte';

  export let item;
  export let width = false;
  export let info = false;
  export let classname = '';

</script>

<li class="card {classname} {item.classlist} {width ? 'col-'+width : ''} {item.thumbnail ? '' : 'no-thumb'}">

  <Link target={item}>

      <figure>
          {#if item.thumbnail}{@html item.thumbnail}{/if}
      </figure>

      <div class="title">

          <span class="count">{item.count || ''}</span>
          <h4>{@html item.title}</h4>
          {#if info}<h5>{@html info}</h5>{/if}

      </div>

  </Link>
</li>
