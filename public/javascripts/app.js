map = new OpenLayers.Map("mapdiv", { displayProjection: epsg4326} );
layerCloudMade = new OpenLayers.Layer.OSM("OSM CloudMade 'Pale dawn'",                                                   
                                           ["http://a.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/998/256/${z}/${x}/${y}.png",
                                            "http://b.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/998/256/${z}/${x}/${y}.png",
                                            "http://c.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/998/256/${z}/${x}/${y}.png"]);

layerOJW = new OpenLayers.Layer.OSM("OJW tubes", "http://ojw.dev.openstreetmap.org/map/tiles/rail/${z}/${x}/${y}.png");

layerMapnik = new OpenLayers.Layer.OSM();

map.addLayer(layerMapnik);
map.addLayer(layerCloudMade);
map.addLayer(layerOJW);