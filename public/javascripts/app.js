$(document).ready(function($) {
	$('.filter').on('click', function () {
	    if ($('#filter').width() > 0) {
			$('#filter').animate({
				opacity: 0,
				width: '0em'
			}, 500);
	    } else {
			$('#twitter').animate({
				opacity: 0,
	    		width: '0em' 
	    	}, 250);
			$('#filter').animate({
				opacity: 1,
				width: '15em'
			}, 500);
	    }
	});

	$('.twitter').on('click', function () {
		if ($('#twitter').width() > 0) {
			$('#twitter').animate({
				opacity: 0,
				width: '0em' 
			}, 250);
		} else {
			$('#filter').animate({
				opacity: 0,
				width: '0em' 
			}, 250);
			$('#twitter').animate({
				opacity: 1,
				width: '15em'
			}, 500);
		}
	});
	
	$('.search-term').keypress(function (e) {
		if (e.which == 13) {
			var address = $('.search-term').val();
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode( { 'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					mapHandler.setCenter(results[0].geometry.location);
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});
			$(this).blur();
		}
	});
	
	twitter.screenname = 'tfltravelalerts';
	twitter.updateTweets();
	
	mapHandler.init();
});
// to recenter the map
// mapHandler.setCoords(lat, lon)

/**
 * Simple singleton to handle the map installation and setting the centres
 * Should be enhanced to handle the layers, etc
 */
var mapHandler = {
	
	latitude: 53.571,
	longitude: -1.788,
	map : null,
	zoom: 13,
	marker: new google.maps.Marker({
    	draggable: true
	}),
	
	init: function() {
		// request location will do so, then draw the maps afterwards
		this.requestLocation();
	},

	// initialise the map and store the data
	initMap: function () {
		this.map = new google.maps.Map(document.getElementById("map"), {
		     zoom: mapHandler.zoom,
		     center: new google.maps.LatLng(mapHandler.latitude, mapHandler.longitude),
		     scrollwheel: false,
		     scaleControl: true,
		     mapTypeControl: false,
		     streetViewControl: false,
		     keyboardShortcuts: false,
		     mapTypeId: google.maps.MapTypeId.ROADMAP,
		     panControl: true,
		     panControlOptions: {
			     position: google.maps.ControlPosition.RIGHT_TOP
			 },
			 zoomControl: true,
			 zoomControlOptions: {
				 style: google.maps.ZoomControlStyle.LARGE,
				 position: google.maps.ControlPosition.RIGHT_TOP
			 }
		 });
		 //this.marker.setPosition(map.getCenter());
		 //this.marker.setMap(map);

		 //request_crimes(mode);

		 google.maps.event.addListener(this.marker, "dragend", function() {
		     
		 });
		 google.maps.event.addListener(map, "zoom_changed", function() {
		     
		 });

	 	//this.map = map;
	},
	// request the browser to give us the location
	requestLocation : function () {
		// func(success, fail)
		navigator.geolocation.getCurrentPosition(this.locationGranted, this.locationDenied);
	},
	// centre a map with either the defailt lang and long or the new ones
	setCenter: function(location) {
		
		// // creates a long and lat object for the base lat and long in this object
		// var lonlat = new OpenLayers.LonLat(this.longitude, this.latitude).transform(
		// 	new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
		// 	new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator
		// );	

		// // set the center
		console.log(this.map);
		console.log(location);
		this.map.setCenter(location);	
	},
	getMarkers : function() {
		// holder function
		//return new OpenLayers.Layer.Markers( "Markers" );
	},
	// set the centre of a map
	setCoords: function (latitude, longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
	},
	locationDenied : function () {
		console.log('denied');
		mapHandler.init();
		// do nothing
	},
	// we have the geo location, so we can see get the coords required
	locationGranted : function (position) {
		mapHandler.latitude = position.coords.latitude;
  		mapHandler.longitude = position.coords.longitude;	
  		mapHandler.initMap();
	}
};