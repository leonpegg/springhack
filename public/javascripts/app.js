$(document).ready(function($) {
	map = new OpenLayers.Map("map");
	var mapnik = new OpenLayers.Layer.OSM();
	map.addLayer(mapnik);

	var lonlat = new OpenLayers.LonLat(-1.788, 53.571).transform(
		new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
		new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator
	);

	var zoom = 13;

	var markers = new OpenLayers.Layer.Markers( "Markers" );
	map.addLayer(markers);

	map.setCenter(lonlat, zoom);
});