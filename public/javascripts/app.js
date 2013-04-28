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
	
	$('.search-term').focus(function () {
		$('#search').css('z-index',1006);
	});
	$('.search-term').focusout(function () {
		$('#search').css('z-index',1000);
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

    // police click
    $('#police-crimes').on('click', function () {
        initPoliceMap();
        $(this).addClass('active');
    });

	$('#transport-bikes').click(function() {
        $(this).toggleClass('active');
		var active = $(this).hasClass('active');
		var map = mapHandler.map;
		if (active) {
			mapHandler.bikeLayers = addBikesToGoogleMap('data/transport/bikes', map);
		}
		else if (mapHandler.bikeLayers) {
			$.each(mapHandler.bikeLayers, function(i, e) {
				e.setMap(null);	//dunno if this works
			});
		}
	});
	
    var line_box = $('input#bus-route');
    var remove_layer_fn = function() {
        if (mapHandler && mapHandler.busLayers) {
            var busLayers = mapHandler.busLayers;
            mapHandler.busLayers = [];
            $.each(busLayers, function(i, e) {
                e.setMap(null);	//dunno if this works
            });
        }
    };
    var update_bus_fn = function() {
        remove_layer_fn();
        var url = 'data/transport/bus';
        var line = line_box.val();
        if (line) {
            url += '?line=' + line;
            addBusesToGoogleMap(url, mapHandler.map, mapHandler.busLayers);
        }
    };
    line_box.keypress(function (e) {
		if (e.which == 13) {
            update_bus_fn();
        }
    });
    
	$('#transport-buses').click(function() {
		$(this).toggleClass('active').parent().find('.filter-options').slideToggle();
        // $(this).toggleClass('active');
		var active = $(this).hasClass('active');

		if (active) {
            update_bus_fn();
		}
		else if (mapHandler.busLayers) {
            remove_layer_fn();
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
    busLayers: [],
	
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
		 
		 google.maps.event.addListener(this.marker, "dragend", function() {
		     
		 });
		 google.maps.event.addListener(this.map, "zoom_changed", function() {
		     
		 });

	},
	// request the browser to give us the location
	requestLocation : function () {
		// func(success, fail)
		navigator.geolocation.getCurrentPosition(this.locationGranted, this.locationDenied);
	},
	// centre a map with either the defailt lang and long or the new ones
	setCenter: function(location) {
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
	},
    getCurrentCenter : function () {
        var center = this.map.getCenter();
        console.log(center);
        return [center.lat(), center.lng()];
    }
};