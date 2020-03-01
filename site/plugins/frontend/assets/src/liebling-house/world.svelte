<script>

	export let view;
	export let page;
	export let classname;

	import {replaceContent} from './replaceContent.js';
	import LoadScript from '../helpers/loadScript.svelte';

	const dependencies = [
		view.content.unityLoader || "https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/liebling-house/Build/UnityLoader.js"
	];

	console.log( dependencies );

	/*
	*	deprecated functions ??
	*/
	window.worldSetState = state => {
		console.warn('deprecated: window.worldSetState('+state+')');
		worldCallMethod( state );
	}
	window.goThroughGlass = event => {
		console.warn('deprecated: window.goThroughGlass('+event+')');
		worldCallMethod('FreeRoaming');
	}
	window.teleportToItem = itemName => {
		console.warn('deprecated: window.teleportToItem('+itemName+')');
		lieblingHouseWorldInstance.SendMessage('GameManager', 'TeleportToItem', itemName );
	}

	/*
	view.content
		worlditemStart: worlditem
		worlditemsList: ./i/liebling-house/worlditems.json
		unityLoader:    ./Build/UnityLoader.js
		unityJson:      ./Build/liebling-house-world.json

		Weltfunktionen sind wie gehabt über `gameInstance.SendMessage('GameManager', [FUNCTION], [ARGUMENT])` erreichbar.
		- GoToItem(string itemName)
		- TeleportToItem(string itemName)
		- FreeRoaming()
		- Kiosk()
		- Dollhouse()
		- Stop() stoppt `GoToItem`

		Verfügbare States
		- FreeRoaming
		- MovingToItem
		- ViewingDollhouse
		- ViewingItem
		- ViewingKiosk
		- (ViewingPlatform)
	*/

	var world = {
		loaded: false,
		progress: 0,
		setInitialState: false,
		tooltips: {
			item: false,
			help: false
		},
		roaming: "Start exploring",
		dollhouse: false,
		help: "Click on the builing to start exploring.",
		state: 'ViewingKiosk',
		states: {
			FreeRoaming: {
				roaming: false,
				dollhouse: true,
				help: "Use W A S D to navigate and ← ↑ ↓ → to rotate camera."
			},
			MovingToItem: {
				roaming: "Stop",
				dollhouse: false,
				help: false
			},
			ViewingDollhouse: {
				roaming: "Continue exploring",
				dollhouse: false,
				help: "Drag to rotate building or click on one of the highlighted spots."
			},
			ViewingItem: {
				roaming: "Continue exploring",
				dollhouse: true,
				help: "Click to start exploring."
			},
			ViewingKiosk: {
				roaming: "Start exploring",
				dollhouse: false,
				help: "Click on the builing to start exploring."
			},
		}
	};

	import { onDestroy } from 'svelte';
	onDestroy(() => {
		console.log("onDestroy()");
		lieblingHouseWorldInstance.Quit(function() {
		    console.log("lieblingHouseWorldInstance.Quit");
		});
		lieblingHouseWorldInstance = null;
	});
	/*
	* load and ini world
	*/
	function unityInit(){
		console.log("unityInit()");

		// return;

		// https://docs.unity3d.com/Manual/webgl-templates.html
		lieblingHouseWorldContainer = document.getElementById('worldContainer');
		lieblingHouseWorldInstance = UnityLoader.instantiate(
			lieblingHouseWorldContainer,
			view.content.unityJson,
			{ onProgress: UnityProgress }
		);

	};
	function UnityProgress(lieblingHouseWorldInstance, progress) {
		console.log("UnityProgress()");

		if (!lieblingHouseWorldInstance.Module) {
			return;
		}

		world.progress = Math.round( progress*100 );

		if (progress === 1 && !lieblingHouseWorldInstance.removeTimeout) {
			lieblingHouseWorldInstance.removeTimeout = setTimeout(function() {

				world.loaded = true;
				console.log('Unity loaded');

			}, 3000);
		}

	}
	/*
	* state management
	*/
	function worldCallMethod( state ){
		console.log( 'worldCallMethod('+state+')' );

		switch (state) {
			case 'Kiosk':
			case 'Dollhouse':
				break;
			default:
				state = 'FreeRoaming';
		}
		lieblingHouseWorldInstance.SendMessage('GameManager', state );
	}
	/*
	* alias
	*/
	window.worldCallMethod = state => {
		worldCallMethod( state );
	}
	/*
	* control world -> website
	*
	* onWorldReady
	* worldUpdateState
	* worldHoverItem
	* worldSelectItem
	* worldSelectTourstopOfItem
	*/
	window.onWorldReady = () => {
		console.log('window.onWorldReady()');

		if( page === 'overview' ){
			worldCallMethod('Kiosk');
		} else if( view.content.worlditemStart ){
			console.log( 'could navigate to "'+view.content.worlditemStart+'"' );
			lieblingHouseWorldInstance.SendMessage('GameManager', 'TeleportToItem', view.content.worlditemStart );
		} else {
			worldCallMethod('Kiosk');
		}

	}
	let setInitialState = false;
	window.worldUpdateState = state => {
		if( setInitialState === false && state === 'FreeRoaming' ){
			console.log('window.worldUpdateState('+state+') -> window.onWorldReady()');
			window.onWorldReady();
			setInitialState = true;
		}
		console.log('window.worldUpdateState('+state+')');

		switch (state) {
			case 'ViewingPlatform':
				console.warn('deprecated: ViewingPlatform state');
			case 'MovingToItem':
			case 'ViewingDollhouse':
			case 'ViewingItem':
			case 'ViewingKiosk':
				break;
			default:
				state = 'FreeRoaming';
		}

		world.state = state;

		world.roaming = world.states[ state ].roaming;
		world.dollhouse = world.states[ state ].dollhouse;
		world.help = world.states[ state ].help;

	}
	window.worldHoverItem = worlditemId => {
		console.log('window.worldHoverItem('+worlditemId+')');

		if( worlditemId == '' ){
			// console.log('worldHoverItem() mouse leave');
			world.tooltips.item = false;
		} else {
			world.tooltips.item = worlditemId;
		}
		// maybe highlight collection elements by id?
		return true;
	}
	window.worldSelectItem = worlditemId => {
		console.log('window.worldSelectItem('+worlditemId+')');
		if( worlditemId == '' ){
			return false;
		}
		/* will directly navigate to this entity */
		showWorlditemContent( worlditemId );
		return true;
	}
	window.worldSelectTourstopOfItem = tourstopId => {
		console.log('window.worldSelectTourstopOfItem('+tourstopId+')');
		if( tourstopId == '' ){
			return false;
		}
		/* will navigate to tourstop within world */
		naviFromWorld( tourstopId );
		return true;
	}
	/*
	* loading content
	*/
	async function showWorlditemContent(worlditemId){
		console.log('async function showWorlditemContent('+worlditemId+')');

		var href = window.location.origin + '/' + worlditemId;
		replaceContent( href, {}, true);
	}
	/*
	* helpers
	*/
	window.worldFreeRoaming = arg => {
		console.log('window.worldFreeRoaming()');
		worldCallMethod('FreeRoaming');
	}
	window.goToItem = itemName => {
		console.log('window.goToItem('+itemName+')');
		lieblingHouseWorldInstance.SendMessage('GameManager', 'GoToItem', itemName );
	}
	function canvasClick(){
		console.log('canvasClick()');
		if( world.state === 'Kiosk '){
			worldCallMethod('FreeRoaming');
		}
	}
</script>

<style>
	.hover {
		/* cursor: help; */
		background-color: #66f;
	}
	.section--content {
		position: relative;
	}
	.is-loading {
		width: 100%;
		height: 100%;
		background-color: #000;
		/* z-index: 30; */
		position: absolute;
		top: 0;
		left: 0;
	}
	.is-loading:after {
		background-color: #fff;
	}
</style>

<LoadScript on:loaded={unityInit} dependencies={dependencies}/>

<section class="{classname} {view.type}">

	<div class="section--content" id="view-liebling-house">
		<div id="worldContainer" class="presentation-container" on:click="{canvasClick}"></div>
		{#if world.loaded === false }
			<div class="is-loading"></div>
		{/if}
	</div>

	<div class="bar controls section--controls {world.tooltips.item ? 'hover' : ''}" id="view-liebling-house-controls">
		{#if world.loaded === false }
			<span class="message">Loading {world.progress}% ... Please wait.</span>
		{:else}

			{#if world.tooltips.item !== false}
				<span class="message">{world.tooltips.item}</span>
			{:else if world.help !== false }

				<span class="message">{world.help}</span>

				<span class="right">
					{#if world.roaming }

						<button on:click={() => worldCallMethod('FreeRoaming')}>{world.roaming}</button>

					{/if}
					{#if world.dollhouse }

						<button on:click={() => worldCallMethod('Dollhouse')}>Overview</button>

					{/if}
				</span>

			{/if}

		{/if}

	</div>

</section>
