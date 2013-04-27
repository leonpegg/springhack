

function addBikesToMap(bike_url, map) {

	var layer = new OpenLayers.Layer.OSM();
	var heatmapFewBikes = new OpenLayers.Layer.Heatmap("Few Bikes Layer"
		, map
		, layer
		, {visible: true, radius:10}
		, {isBaseLayer: false, opacity: 0.9, projection: new OpenLayers.Projection("EPSG:4326"), gradient:{0:'rgb(0,0,0)', 1:'rgb(0,255,0)'}});
	var heatmapFewSpaces = new OpenLayers.Layer.Heatmap("Few Bikes Layer"
		, map
		, layer
		, {visible: true, radius:10}
		, {isBaseLayer: false, opacity: 0.9, projection: new OpenLayers.Projection("EPSG:4326"), gradient:{0:'rgb(0,0,0)', 1:'rgb(255,0,0)'}});
	var heatmapSafeSpaces = new OpenLayers.Layer.Heatmap("Few Bikes Layer"
		, map
		, layer
		, {visible: true, radius:10}
		, {isBaseLayer: false, opacity: 0.9, projection: new OpenLayers.Projection("EPSG:4326"), gradient:{0:'rgb(0,0,0)', 1:'rgb(102, 204, 255'}});
   
	var layers = [layer, heatmapFewBikes, heatmapFewSpaces, heatmapSafeSpaces];
		
	map.addLayers(layers);

    $.getJSON(bike_url, null, function (json) {
        var fewbikes = [];
        var fewspaces = [];
        var safespaces = [];
        var threshold = 3;
        $.each(json.stations.station, function (i, e) {
			var location = new OpenLayers.LonLat(parseFloat(e.long), parseFloat(e.lat));
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

$('document').ready(function() {
	
	$('input#bikes').click(function() {
		var checked = $(this).is(':checked');
		var map = mapHandler.map;
		if (checked) {
			mapHandler.bikeLayers = addBikesToMap('data/bikes', map);
			}
		else if (mapHandler.bikeLayers) {
			$.each(mapHandler.bikeLayers, function(i, e) {
				map.removeLayer(e);
			});
		}
	});
});

