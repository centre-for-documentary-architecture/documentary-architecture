<script>
	import { onMount } from 'svelte';

	export let view;
	export let classname;
	export let transcript;

	/*
	* mapbox api
	* https://docs.mapbox.com/mapbox-gl-js/api/
	*/

	var map;

	let mapPositions = {
		lat: 44,
		lon: 23,
		zoom: 3
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
				clusterMaxZoom: 7, // Max zoom to cluster points on
				clusterRadius: 24 // Radius of each cluster when clustering points (defaults to 50)
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
						'stops': [ [2, 20], [6, 12], [8, 5], [10, 4], [13, 4], [16, 8], [22, 180] ]
					},
					'circle-color': '#00f'
				},
			});

			/*
			map.addLayer({
				"id": "label",
				"type": "symbol",
				"source": "buildings",
				// "filter": ["!=", "cluster", true],
				"layout": {
					// "text-field": ["number-format", ["get", "mag"], {"min-fraction-digits": 1, "max-fraction-digits": 1}],
					// "text-field": "yoy",
					"text-field": ["format",
						["get", "title"], { "font-scale": 1.2 },
						"bar", { "font-scale": 0.8 }
					],
					"text-size": 40
				},
				"paint": {
					"text-color": "#fff"
				}
			});
			*/

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

		});

		map.on('mouseenter', 'dots', function () {
			map.getCanvas().style.cursor = 'pointer';
		});
		map.on('mouseleave', 'dots', function () {
			map.getCanvas().style.cursor = '';
		});

		map.on('click', 'dots', function (e) {
			var features = map.queryRenderedFeatures(e.point, { layers: ['dots'] });
			console.log( features[0] );
			var cluster_id = features[0].properties.cluster_id;
			if( cluster_id !== undefined ){
				map.getSource('buildings').getClusterExpansionZoom(cluster_id, function (err, zoom) {
						if (err){ return; }
					map.easeTo({
						center: features[0].geometry.coordinates,
						zoom: zoom
					});
				});
			} else {
				map.easeTo({
					center: features[0].geometry.coordinates,
					zoom: map.getZoom()+3
				});
				createPopUp( features[0] );
			}
		});

		function createPopUp(currentFeature) {
			var popUps = document.getElementsByClassName('mapboxgl-popup');
			// Check if there is already a popup on the map and if so, remove it
			if (popUps[0]) popUps[0].remove();

			var popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false, anchor: 'top' })
				.setLngLat(currentFeature.geometry.coordinates)
				.setHTML(
					'<h4>' + currentFeature.properties.title + '</h4>'
				)
				.addTo(map);
		}

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

	/* Marker tweaks */
	#map :global(.mapboxgl-popup) {
		width: 25vw;
	}

	#map :global(.mapboxgl-popup-content) {
		font-family: "Favorit Mono", "Favorit", Roboto Mono, Roboto, Helvetica, Arial, sans-serif;
		background-color: #fff;
		color: #000;
		border-radius: 0;
		padding: 0;
	}

	#map :global(.mapboxgl-popup-content:hover) {
		background-color: #00f;
		color: #fff;
		cursor: pointer;
	}

	#map :global(.mapboxgl-popup-content h4) {
		padding: 0 0.5rem;
		margin: 0.5rem 0;
	}

	#map :global(.mapboxgl-popup > .mapboxgl-popup-tip) {
		display: none;
	}

	/*
	#map :global(.mapboxgl-popup-content-wrapper) {
		padding: 1%;
	}

	#map :global(.mapboxgl-popup-content h3) {
		background: #91c949;
		color: #fff;
		margin: 0;
		display: block;
		padding: 10px;
		font-weight: 700;
		margin-top: -15px;
	}

	#map :global(.mapboxgl-popup-close-button) {
		display: none;
	}



	#map :global(.mapboxgl-popup-content div) {
		padding: 10px;
	}

	#map :global(.mapboxgl-container .leaflet-marker-icon) {
		cursor: pointer;
	}

	#map :global(.mapboxgl-popup-anchor-top > .mapboxgl-popup-content) {
		margin-top: 15px;
	}

	*/
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
