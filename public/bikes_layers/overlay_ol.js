

function addBikesToOpenStreetMap(bike_url, map) {

	var layer = new OpenLayers.Layer.OSM();
	var projection = new OpenLayers.Projection("EPSG:4326");

	var heatmapFewBikes = new OpenLayers.Layer.Heatmap("Few Bikes Layer"
		, map
		, layer
		, {visible: true, radius:10}
		, {isBaseLayer: false, opacity: 0.9, projection: projection, gradient:{0:'rgb(0,0,0)', 1:'rgb(0,255,0)'}});
	var heatmapFewSpaces = new OpenLayers.Layer.Heatmap("Few Bikes Layer"
		, map
		, layer
		, {visible: true, radius:10}
		, {isBaseLayer: false, opacity: 0.9, projection: projection, gradient:{0:'rgb(0,0,0)', 1:'rgb(255,0,0)'}});
	var heatmapSafeSpaces = new OpenLayers.Layer.Heatmap("Few Bikes Layer"
		, map
		, layer
		, {visible: true, radius:10}
		, {isBaseLayer: false, opacity: 0.9, projection: projection, gradient:{0:'rgb(0,0,0)', 1:'rgb(102, 204, 255'}});
   
	var markers = new OpenLayers.Layer.Markers( "Bike Markers"
		, {isBaseLayer: false, projection: projection});
	var size = new OpenLayers.Size(24,32);
	var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
	var icon = new OpenLayers.Icon('/images/cycle-hire-pushpin-icon.gif', size, offset);

	var layers = [layer, heatmapFewBikes, heatmapFewSpaces, heatmapSafeSpaces, markers];
		
	map.addLayers(layers);

    $.getJSON(bike_url, null, function (json) {
        var fewbikes = [];
        var fewspaces = [];
        var safespaces = [];
        var threshold = 3;
        $.each(json.stations.station, function (i, e) {
			var location = new OpenLayers.LonLat(parseFloat(e.long), parseFloat(e.lat));
			var marker = new OpenLayers.Marker(location, icon.clone());
			markers.addMarker(marker);
            var spaces = parseInt(e.nbEmptyDocks);
            var bikes = parseInt(e.nbBikes);
            var total = spaces + bikes;
            if(bikes < threshold) {
                var ins = {
                    lonlat: location,
					count: threshold - bikes
                };
                fewbikes.push(ins);
            } else if(spaces < threshold) {
                var ins = {
                    lonlat: location,
   					count: threshold - spaces
                };
                fewspaces.push(ins);
            } else {
                var ins = {
                    lonlat: location,
   					count: 1
                };
                safespaces.push(ins);
            }
        });
        if(fewbikes.length > 0) {
			var transformedTestData = { max: threshold , data: fewbikes };
			heatmapFewBikes.setDataSet(transformedTestData);
        }
        if(fewspaces.length > 0) {
			var transformedTestData = { max: threshold , data: fewspaces };
			heatmapFewSpaces.setDataSet(transformedTestData);
        }
        if(safespaces.length > 0) {
			var transformedTestData = { max: threshold , data: safespaces };
			heatmapSafeSpaces.setDataSet(transformedTestData);
        }

        if(console) {
            console.log('fewbikes:', fewbikes.length, ', fewspaces:', fewspaces.length, ', safespaces:', safespaces.length);
        }
    });
	
	return layers;
}
function addToMap(data, map, colours) {
    var options = {
        map: null,
        data: data,
        dissipating: //dissipating: false,
        true,
        opacity: 0.9,
        gradient: colours,
        maxIntensity: null,
        radius: 25
    };
    var heatmap = new google.maps.visualization.HeatmapLayer(options);
    heatmap.setMap(map);
	return heatmap;
}

function addBikesToGoogleMap(bike_url, map) {

	var layers = [];
		
    $.getJSON(bike_url, null, function (json) {
        var fewBikes = [];
        var fewSpaces = [];
        var safeSpaces = [];
        var markers = [];
        var threshold = 3;
        $.each(json.stations.station, function (i, e) {
            var location = new google.maps.LatLng(parseFloat(e.lat), parseFloat(e.long));

            var spaces = parseInt(e.nbEmptyDocks);
            var bikes = parseInt(e.nbBikes);
            var total = spaces + bikes;
			var marker = new google.maps.Marker({
				position: location,
				icon: '/images/cycle-hire-pushpin-icon.gif',
				title: e.name
			});
            if(bikes < threshold) {
                var ins = {
                    location: location,
                    weight: threshold - bikes
                };
                fewBikes.push(ins);

				marker.setAnimation(google.maps.Animation.BOUNCE);
			} else if(spaces < threshold) {
                var ins = {
                    location: location,
                    weight: threshold - spaces
                };
                fewSpaces.push(ins);
				marker.setAnimation(google.maps.Animation.BOUNCE);
            } else {
                //var ins = { location: location, weight: threshold - spaces };
                safeSpaces.push(location);
            }
			layers.push(marker);
			markers.push(markers);
        });
        if(fewBikes.length > 0) {
            var heatmap = addToMap(fewBikes, map, [
                'transparent', 
                '#00FF00'
            ]);
			layers.push(heatmap);
        }
        if(fewSpaces.length > 0) {
            var heatmap = addToMap(fewSpaces, map, [
                'transparent', 
                '#FF0000'
            ]);
			layers.push(heatmap);
        }
        if(safeSpaces.length > 0) {
            var heatmap = addToMap(safeSpaces, map, [
                'transparent', 
                '#66ccff'
            ]);
			layers.push(heatmap);
        }
		
		$.each(markers, function(i, e) {
			e.setMap(map);
		});

        if(console) {
            console.log('fewbikes:', fewbikes.length, ', fewspaces:', fewspaces.length, ', safespaces:', safespaces.length);
        }
    });
	
	return layers;
}

function renderGoogleMap(checked) {
	var map = mapHandler.map;
	if (checked) {
		mapHandler.bikeLayers = addBikesToMap('data/bikes', map);
	}
	else if (mapHandler.bikeLayers) {
		$.each(mapHandler.bikeLayers, function(i, e) {
			e.setMap(null);	//dunno if this works
		});
	}
}

function renderOpenStreetMap(checked) {
	var map = mapHandler.map;
	if (checked) {
		mapHandler.bikeLayers = addBikesToMap('data/bikes', map);
	}
	else if (mapHandler.bikeLayers) {
		$.each(mapHandler.bikeLayers, function(i, e) {
			map.removeLayer(e);
		});
	}
}

$('document').ready(function() {
	
	$('input#bikes').click(function() {
		var checked = $(this).is(':checked');
		renderGoogleMap(checked);
		// renderOpenStreetMap(checked);
	});
});

