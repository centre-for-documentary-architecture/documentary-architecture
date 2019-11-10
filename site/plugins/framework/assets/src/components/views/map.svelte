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

	let loaded = false;

	let popups = {
		visible: false,
		threshold: 16,
		elements: [],
		show: function(){

			console.log('show()');

			let els = this.elements;

			view.content.forEach(function(marker) {
				let item = marker.properties;
				let html = '<li class="card">'+
					'<a onclick="navi(event)" href="'+item.url+'" data-template="'+item.template+'">'+
						'<figure>';
							if(item.thumbnail){
								html += item.thumbnail;
							}
						html += '</figure>';
						if(item.count){
							html += '<span class="count">'+item.count+'</span>';
						}
						html += '<h4 class="title">'+item.title+'</h4>'+
					'</a>'+
				'</li>';
				var popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false, anchor: 'bottom-left' })
					.setLngLat( marker.geometry.coordinates )
					.setHTML( html )
					.addTo( map );
				els.push( popup );
			});
			this.visible = true;

		},
		hide: function(){
			for (const popup of this.elements) {
				popup.remove();
			}
			this.elements = [];
			this.visible = false;
		}
	};

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
				clusterRadius: 24 // Radius of each cluster when clustering points
			});

			map.addLayer({
				"id": "dots",
				"type": "circle",
				"source": "buildings",
				"filter": ["==", "$type", "Point"],
				"paint": {
					'circle-radius': {
						'base': 5,
						// adjust radius to zoom level [[zoom, radius],...]
						'stops': [ [2, 18], [6, 12], [8, 5], [10, 4], [13, 4], [16, 8], [22, 180] ]
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

			if( zoom > popups.threshold && popups.visible === false ){
				popups.show();
			} else if( zoom < popups.threshold && popups.visible === true ){
				popups.hide();
			}

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
				let zoomTo = map.getZoom() + 3;
				if( zoomTo > 10 ){
					zoomTo = popups.threshold + 0.2;
				}
				map.easeTo({
					center: features[0].geometry.coordinates,
					zoom: zoomTo
				});
			}
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

	/* Marker tweaks */
	#map :global(.mapboxgl-popup) {
		width: 20vw;
		font-size: 0.8rem;
		font-family: "Favorit Mono", "Favorit", Roboto Mono, Roboto, Helvetica, Arial, sans-serif;
	}

	#map :global(.mapboxgl-popup-content) {
		background-color: transparent;
		color: #000;
		border-radius: 0;
		padding: 0;
	}

	#map :global(.mapboxgl-popup-content:hover) {
		background-color: #00f;
		color: #fff;
		cursor: pointer;
	}

	#map :global(.mapboxgl-popup-content .count) {
		padding-bottom: 0;
	}

	#map :global(.mapboxgl-popup-content h4) {
		padding: 0.5rem 0.5rem;
		margin: 0;
		font-size: 0.8rem;
	}

	#map :global(.mapboxgl-popup > .mapboxgl-popup-tip) {
		display: none;
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
