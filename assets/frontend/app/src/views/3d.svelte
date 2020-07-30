<script>

	import LoadScript from '../helpers/loadScript.svelte';
	const dependencies = [
		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/three.min.js",
		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/inflate.min.js",
		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/FBXLoader.js",
		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/OrbitControls.js",
	];

	export let view;
	export let classname;

	var loaded = false;

	var cameraRotation = {
		x: 0,
		y: 0,
		z: 0
	};

	var autoRotate = true;

	/*
	* this code should best be outsourced, babelized and embedded here
	*/

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	var camera, scene, renderer, controls, object;

	var container, containerWidth, containerHeight;

	function threeInit(){

		container = document.getElementById( 'view-3d' );

		containerWidth = container.parentElement.offsetWidth;
		containerHeight = container.parentElement.offsetHeight;

		init();
		animate();

	}

	function init() {

		// console.log('init');

		// camera
		camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 10000 );
		camera.position.set( 50, 50, 50 );

		// scene
		scene = new THREE.Scene();

		// 0.4
		var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
		scene.add( ambientLight );

		// 0.8
		var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
		camera.add( pointLight );
		scene.add( camera );


		// model
		var loader = new THREE.FBXLoader();
		loader.load( view.content.url, function ( object ) {

			loaded = true;
			scene.add( object );
			controls.autoRotate = true;

		}, undefined, function ( e ) {
			console.error( e );
		});

		// renderer
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( containerWidth, containerHeight );

		container.appendChild( renderer.domElement );

		// controls
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.target.set( 0, 0, 0 );
		controls.autoRotate = false;
		controls.update();

		// add guidelines
		var materialBlue = new THREE.LineBasicMaterial( { color: 0x0000ff } );
		var geometryGuides = new THREE.Geometry();
		geometryGuides.vertices.push( new THREE.Vector3( 20, 0, 0) );
		geometryGuides.vertices.push( new THREE.Vector3( 0, 0, 0) );
		geometryGuides.vertices.push( new THREE.Vector3( 0, 20, 0) );
		geometryGuides.vertices.push( new THREE.Vector3( 0, 0, 0) );
		geometryGuides.vertices.push( new THREE.Vector3( 0, 0, 20) );
		var line = new THREE.Line( geometryGuides, materialBlue );
		scene.add( line );

		// events
		window.addEventListener( 'resize', onWindowResize, false );

	}
	/**
	 * interactions
	 */
	function onWindowResize() {

		containerWidth = container.parentElement.offsetWidth;
		containerHeight = container.parentElement.offsetHeight;

		camera.aspect = containerWidth / containerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( containerWidth, containerHeight );

	}
	function animate() {

		requestAnimationFrame( animate );

		controls.update();
		cameraRotation.x = Math.round( camera.position.x );
		cameraRotation.y = Math.round( camera.position.y );
		cameraRotation.z = Math.round( camera.position.z );

		renderer.render( scene, camera );

	}
	function startRotation(){
		console.log('start 3d rotation');
		autoRotate = true;
		controls.autoRotate = true;
	}
	function stopRotation(){
		console.log('stop 3d rotation');
		autoRotate = false;
		controls.autoRotate = false;
	}

</script>

<LoadScript on:loaded={threeInit} dependencies={dependencies}/>

<section class="{classname} {view.type}">

	<div class="section--content">
		<div id="view-3d"></div>
	</div>

	<div class="bar controls section--controls" id="view-3d-controls">
		{#if loaded == false }
			<span class="message">Loading ...</span>
		{:else}
			<span class="left">
				{#if autoRotate === true}
					<button class="3d-pause" on:click={stopRotation}>Pause</button>
				{:else}
					<button class="3d-play" on:click={startRotation}>Rotate</button>
				{/if}
			</span>
			<span class="right">
				<span class="3d-rotation">{ cameraRotation.x }, { cameraRotation.y }, { cameraRotation.z }</span>
			</span>
		{/if}
	</div>

</section>
