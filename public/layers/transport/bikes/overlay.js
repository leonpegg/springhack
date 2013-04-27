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
function initialize() {
    var lat = 51.51104050;//51.5;//112139;
    
    var lng = -0.1137257;
    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    $.getJSON('livecyclehireupdates.json', null, function (json) {
        var fewBikes = [];
        var fewSpaces = [];
        var safeSpaces = [];
        var threshold = 3;
        $.each(json.stations.station, function (i, e) {
            var location = new google.maps.LatLng(e.lat, e.long);
            var spaces = parseInt(e.nbEmptyDocks);
            var bikes = parseInt(e.nbBikes);
            var total = spaces + bikes;
            if(bikes < threshold) {
                var ins = {
                    location: location,
                    weight: threshold - bikes
                };
                fewBikes.push(ins);
            } else if(spaces < threshold) {
                var ins = {
                    location: location,
                    weight: threshold - spaces
                };
                fewSpaces.push(ins);
            } else {
                //var ins = { location: location, weight: threshold - spaces };
                safeSpaces.push(location);
            }
        });
        if(fewBikes.length > 0) {
            addToMap(fewBikes, map, [
                'transparent', 
                '#00FF00'
            ]);
        }
        if(fewSpaces.length > 0) {
            addToMap(fewSpaces, map, [
                'transparent', 
                '#FF0000'
            ]);
        }
        if(safeSpaces.length > 0) {
            addToMap(safeSpaces, map, [
                'transparent', 
                '#66ccff'
            ]);
        }
        if(console) {
            console.log('fewBikes:', fewBikes.length, ', fewSpaces:', fewSpaces.length, ', safeSpaces:', safeSpaces.length);
        }
    });
}
google.maps.event.addDomListener(window, 'load', initialize);
//@ sourceMappingURL=overlay.js.map
