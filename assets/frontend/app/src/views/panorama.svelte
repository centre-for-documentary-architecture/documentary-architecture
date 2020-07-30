<script>
	import LoadScript from '../helpers/loadScript.svelte';
	const dependencies = [
		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/three.min.js",
		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/OrbitControls.js",
	];

	export let view;
	export let classname;
	export let transcript;

	/*
	* this code should best be outsourced, babelized and embedded here
	*/

	// console.log( view.content.url )

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	var camera, scene, renderer, controls, object;

	var container, containerWidth, containerHeight;

	var autoRotate = true;

	var loaded = false;

	var isUserInteracting = false;
	var onPointerDownPointerX = 0;
	var onPointerDownPointerY = 0;
	var lon = 180;
	var onPointerDownLon = 180;
	var lat = 0;
	var onPointerDownLat = 0;
	var phi = 0;
	var theta = 0;

	var boxSize = 180;

	var cameraRotation = {
		lat: 0,
		lon: 0
	};

	function threeInit() {

		container = document.getElementById( 'view-3d' );

		containerWidth = container.parentElement.offsetWidth;
		containerHeight = container.parentElement.offsetHeight;

		init();
		animate();

	}

	function init() {

		// camera
		camera = new THREE.PerspectiveCamera( 100, containerWidth / containerHeight, 1, 1100 );
		// camera.position.set( 0, 0, 0 );
		camera.target = new THREE.Vector3( 20, 0, 0 );

		// scene
		scene = new THREE.Scene();

		// geo
		var geometry = new THREE.SphereGeometry( boxSize, 60, 40 );
		geometry.scale( - 1, 1, 1 );

		// texture
		var material = new THREE.MeshBasicMaterial( {
			map: new THREE.TextureLoader().load(
				view.content.url,
				function(){
					loaded = true;
				},
				undefined,
				function(err){
					console.log('panorama loading error');
				} )
		} );

		object = new THREE.Mesh( geometry, material );

		scene.add( object );

		// renderer
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( containerWidth, containerHeight );

		container.appendChild( renderer.domElement );

		// events
		window.addEventListener( 'resize', onWindowResize, false );

		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		// document.addEventListener( 'wheel', onDocumentMouseWheel, false );

	}

	function onWindowResize() {

		containerWidth = container.parentElement.offsetWidth;
		containerHeight = container.parentElement.offsetHeight;

		// windowHalfX = window.innerWidth / 2;
		// windowHalfY = window.innerHeight / 2;

		camera.aspect = containerWidth / containerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( containerWidth, containerHeight );

	}

	function animate() {

		requestAnimationFrame( animate );
		update();

	}

	function onDocumentMouseDown( event ) {

		event.preventDefault();

		isUserInteracting = true;

		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;

	}

	function onDocumentMouseMove( event ) {

		if ( isUserInteracting === true ) {

			lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
			lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

		}

	}

	function onDocumentMouseUp( event ) {

		isUserInteracting = false;

	}
	/*
	function onDocumentMouseWheel( event ) {

		camera.fov += event.deltaY * 0.05;
		camera.updateProjectionMatrix();

	}
	*/
	function update() {

		if ( isUserInteracting === false && autoRotate === true ) {

			lon += 0.09;

		}

		lat = Math.max( - 85, Math.min( 85, lat ) );
		phi = THREE.Math.degToRad( 90 - lat );
		theta = THREE.Math.degToRad( lon );

		camera.target.x = boxSize * Math.sin( phi ) * Math.cos( theta );
		camera.target.y = boxSize * Math.cos( phi );
		camera.target.z = boxSize * Math.sin( phi ) * Math.sin( theta );

		camera.lookAt( camera.target );

		cameraRotation.lat = Math.round( lat );
		cameraRotation.lon = Math.round( ( lon%360 )-180 );

		/*
		// distortion
		camera.position.copy( camera.target ).negate();
		*/

		renderer.render( scene, camera );

	}

	function startRotation(){
		autoRotate = true;
	}
	function stopRotation(){
		autoRotate = false;
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
				{#if autoRotate === true }
					<button class="3d-pause" on:click={stopRotation}>Pause</button>
				{:else}
					<button class="3d-play" on:click={startRotation}>Rotate</button>
				{/if}
			</span>
			<span class="right">
				<span class="3d-rotation">{ cameraRotation.lat }, { cameraRotation.lon }</span>
			</span>
		{/if}
	</div>

</section>
