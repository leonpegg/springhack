

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
				icon: '/images/cycle-hire-pushpin-icon.gif'//,
//				title: e.name
			});
            if(bikes < threshold) {
                var ins = {
                    location: location,
                    weight: threshold - bikes
                };
                fewBikes.push(ins);

				// marker.setAnimation(google.maps.Animation.BOUNCE);
			} else if(spaces < threshold) {
                var ins = {
                    location: location,
                    weight: threshold - spaces
                };
                fewSpaces.push(ins);
				// marker.setAnimation(google.maps.Animation.BOUNCE);
            } else {
                //var ins = { location: location, weight: threshold - spaces };
                safeSpaces.push(location);
            }
			markers.push(marker);
			layers.push(marker);
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
    });
	
	return layers;
}

function renderGoogleMap(checked) {
	var map = mapHandler.map;
	if (checked) {
		mapHandler.bikeLayers = addBikesToGoogleMap('data/bikes', map);
	}
	else if (mapHandler.bikeLayers) {
		$.each(mapHandler.bikeLayers, function(i, e) {
			e.setMap(null);	//dunno if this works
		});
	}
}

$('document').ready(function() {
	
	$('input#transport-bikes').click(function() {
		var checked = $(this).is(':checked');
		renderGoogleMap(checked);
	});
});

