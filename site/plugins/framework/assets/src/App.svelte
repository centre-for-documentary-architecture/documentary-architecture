<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import NavHistory from './components/navigation/history.svelte';
	import NavArchive from './components/navigation/archive.svelte';
	import Entity from './components/entity.svelte';
	import Archive from './components/archive.svelte';

	function naviWorld( worlditem ){
		if( typeof lieblingHouseWorldInstance === undefined ){
			return;
		}
		if( !worlditem ){
			console.log('naviWorld() no world item to navigate to');
			return;
		}
		console.log('naviWorld() GameInstance goToItem: '+worlditem);
		lieblingHouseWorldInstance.SendMessage('GameManager', 'GoToItem', worlditem);
	}

	let entity = undefined;

	// function replaceEntityData( data ){
	window.replaceEntityData = async data => {
		entity = data;
	}

	function relocate( e = false, className = '' ){
		if( !e ){
			e = entity;
		}

		document.body.className = [ className, e.theme, e.layout, e.template, e.entity, e.type, e.category, 'dynamic' ].join(' ');

		document.title = e.title;

		history.pushState({
			title: entity.title,
			url: entity.url,
			worlditem: entity.worlditem
		}, entity.title, entity.url);

	}

	window.load = async url => {
		url = url.replace( '.json', '' );

		const location = new URL( url );
		url = location.origin + location.pathname + '.json' + location.search;

		console.log( 'load() '+ url );
		const response = await fetch( url );
		let data;
		if (response.ok) { // if HTTP-status is 200-299
			// get the response body (the method explained below)
			data = await response.json();
		} else {
			console.error("HTTP-Error: " + response.status);
		}
		return data.data;
	}

	window.navi = async event => {

		let target = event.target.closest('a');
		let template = target.dataset.template;

		if( template != 'entity' && template != 'archive' ){
			console.log('navi() Unload and follow link');
			return;
		}

		event.preventDefault();

		replaceEntityData( await load( target.href ) );

		console.log( entity );

		naviWorld( entity.worlditem );

		relocate();

	}

	// async function naviFromWorld( worlditemId ){
	window.showWorlditemContent = async worlditemId => {

		var href = window.location.origin + '/' + worlditemId;
		console.log( 'showWorlditemContent()', href );

		var worlditemContent = await load( href );

		// replaceEntityData( await load( href ) );

		worlditemContent.theme = entity.theme;
		entity.content = worlditemContent.content;
		entity.title = worlditemContent.title;

		console.log( 'showWorlditemContent()', entity );

		relocate( worlditemContent, 'liebling-house' );

	}

	window.onpopstate = async event => {
		console.log( event );
		if( event.state ){

			replaceEntityData( await load( event.state.url ) );

			document.body.className = [ entity.theme, entity.layout, entity.template, entity.entity, entity.type, entity.category, 'dynamic' ].join(' ');
			document.title = entity.title;

			console.log( 'history.back', entity );
		}
	}

	onMount(async () => {
		replaceEntityData( await load( window.location.href ) );
		console.log( 'initial data', entity );

		document.body.className = [ entity.theme, entity.layout, entity.template, entity.entity, entity.type, entity.category, 'dynamic' ].join(' ');

		history.replaceState({
			title: entity.title,
			url: entity.url,
			worlditem: entity.worlditem
		}, entity.title, entity.url);
	});

</script>

{#if entity !== undefined }

	<NavHistory entity={entity} />

	<div class="grid panels {entity.type == 'liebling-house' ? 'overlap' : '' }">

		{#if entity.template == 'entity' }

			<Entity entity={entity} />

		{:else if entity.template == 'archive'}

			<Archive archive={entity} />

		{/if}

	</div>

	<NavArchive />

{/if}
