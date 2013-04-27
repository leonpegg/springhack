/// <reference path="../../../../../frameworks_and_libraries/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="../../../../../frameworks_and_libraries/DefinitelyTyped/googlemaps/google.maps.d.ts" />

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
}

$('document').ready(function() {
    var lat = 51.51104050;
    var lng = -0.1137257;

	var map = new OpenLayers.Map('map-canvas');
	var layer = new OpenLayers.Layer.OSM();

	var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
	var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
	var position       = new OpenLayers.LonLat(lng,lat).transform( fromProjection, toProjection);
	var zoom           = 13; 
		
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
	map.setCenter(position, zoom);

    $.getJSON('../data/bikes', null, function (json) {
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
});	
// google.maps.event.addDomListener(window, 'load', initialize);
//@ sourceMappingURL=overlay.js.map
