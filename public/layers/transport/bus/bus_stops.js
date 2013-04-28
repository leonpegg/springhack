

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

function addBusesToGoogleMap(bus_url, map, markers) {
		
    $.getJSON(bus_url, null, function (json) {
        $.each(json, function (i, e) {
            var location = new google.maps.LatLng(parseFloat(e.lat), parseFloat(e.lng));

			var title = e.stop_id;
			var marker = new MarkerWithLabel({
					position: location,
					// icon: '/images/cycle-hire-pushpin-icon.gif',
					title: title,
					// labelText: bikes,
				   // labelClass: "bike-labels-empty", // the CSS class for the label
				   // labelStyle: {top: "0px", left: "-10px", opacity: 0.75},
				   labelVisible: false
				});
                
            marker.setMap(map);
			markers.push(marker);
        });
    });
}

function renderGoogleMap(checked) {
	var map = mapHandler.map;
}
