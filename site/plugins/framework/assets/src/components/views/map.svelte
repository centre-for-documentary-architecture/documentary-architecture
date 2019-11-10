<script>
	import { onMount } from 'svelte';

	export let view;
	export let classname;

	/*
	* mapbox api
	* https://docs.mapbox.com/mapbox-gl-js/api/
	*/

	var map;

	let mapPositions = {
		lat: 32.07,
		lon: 34.77,
		zoom: 13
	};

	var loaded = false;

	// var markers = false;

	/*
	* someone mixed up lat <-> lon, i dont know, just try, error, fix
	*/

	onMount(() => {

		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/moriwaan/cjzqsxone04y21ctdxp1dgogb',
			center: [ mapPositions.lon, mapPositions.lat ],
			zoom: mapPositions.zoom
		});

		map.on('load', function() {

			map.addSource("buildings", {
				"type": "geojson",
				"data": {
					"type": "FeatureCollection",
					"features": view.content
				},
				cluster: true,
				clusterMaxZoom: 6, // Max zoom to cluster points on
				clusterRadius: 15 // Radius of each cluster when clustering points (defaults to 50)
			});

			map.addLayer({
				"id": "dots",
				"type": "circle",
				"source": "buildings",
				"filter": ["==", "$type", "Point"],
				"paint": {
					'circle-radius': {
						// make circles larger as the user zooms from z12 to z22
						'base': 5,
						'stops': [ [2, 10], [7, 5], [10, 3], [13, 5], [16, 8], [22, 180] ]
					},
					'circle-color': '#00f'
				},
			});

			loaded = true;

		});

		map.on('move', function (e) {
			var center = map.getCenter();
			mapPositions.lat = round( center.lat );
			mapPositions.lon = round( center.lng );
		});

		map.on('zoom', function (e) {
			var zoom = map.getZoom();
			mapPositions.zoom = round( zoom, 0 );

			/*
			if( zoom > 15 && markers === false ){
				createMarkers();
			} else if ( zoom < 15 ){
				removeMarkers();
			}
			*/

		});

	});

	function round( f, d = 2 ){
		// round coords
		return f.toFixed(d);
	}

</script>

<style>
	#map {
		height: 100%;
	}
	:global(.marker){

		background-color: #ff0;

	}
</style>

<section class="{classname} {view.type}">

	<!--<h3 class="section--header">
		{ view.headline || 'Map' }
	</h3>-->

	<div class="section--content">
		<div id='map' style='width: 100%; height: 100%;'></div>
	</div>

	<div class="section--controls bar controls" id="map-controls">
		{#if loaded === false }
			<span class="message">Loading...</span>
		{:else}
			<span class="right">
				<span class="map-position">{mapPositions.lat}, {mapPositions.lon}, {mapPositions.zoom}</span>
			</span>
		{/if}
	</div>

</section>
