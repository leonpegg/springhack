$(document).ready(function($) {
	$('.search').on('click', function () {
		$('#search').animate({
			width: '250px'
		}, 500, function() {
			// Animation complete.
		});
	});
	$('.twitter').on('click', function () {
		$('#twitter').animate({
			width: '250px'
		}, 500, function() {
			// Animation complete.
		});
	});
	mapHandler.initMap();
});
// to recenter the map
// mapHandler.setCoords(lat, lon)

/**
 * Simple singleton to handle the map installation and setting the centres
 * Should be enhanced to handle the layers, etc
 */
var mapHandler = {
	latitude: -1.788,
	longitude: 53.571,
	map : null,
	zoom: 13,

	// initialise the map and store the data
	initMap: function () {
		map = new OpenLayers.Map("map");
		var mapnik = new OpenLayers.Layer.OSM();
		map.addLayer(mapnik);

		// get the standard markers
		var markers = this.getMarkers();
		
		// set the markers
		map.addLayer(markers);
		
		//s tore the map
		this.map = map;

		// try and get the location from the browser
		this.requestLocation();

	},
	// request the browser to give us the location
	requestLocation : function () {
		// func(success, fail)
		navigator.geolocation.getCurrentPosition(this.locationGranted, this.locationDenied);
	},
	// centre a map with either the defailt lang and long or the new ones
	setCentre: function() {
		
		// creates a long and lat object for the base lat and long in this object
		var lonlat = new OpenLayers.LonLat(this.latitude, this.longitude).transform(
			new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
			new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator
		);	

		// set the center
		this.map.setCenter(lonlat, mapHandler.zoom);	
	},
	getMarkers : function() {
		// holder function
		return new OpenLayers.Layer.Markers( "Markers" );
	},
	// set the centre of a map
	setCoords: function (lat, long) {
		this.latitude = lat;
		this.longitude = long;
		this.setCentre();
	},
	locationDenied : function () {
		mapHandler.setCentre();
	},
	// we have the geo location, so we can see get the coords required
	locationGranted : function (position) {
		latitude = position.coords.latitude;
  		longitude = position.coords.longitude;	
  		
  		// set the centre
  		mapHandler.setCoords(longitude, latitude);
	}
};