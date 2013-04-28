var crime_date = '2011-04-01';
var language = 'en-gb';
var categories = new Object();
circle_radius = 1609.344;
var category_order = [];

categories['all-crime'] = "All crime &amp; anti-social-behaviour";
category_order.push('all-crime');

categories['burglary'] = "Burglary";
category_order.push('burglary');

categories['anti-social-behaviour'] = "Anti-social behaviour";
category_order.push('anti-social-behaviour');

categories['robbery'] = "Robbery";
category_order.push('robbery');

categories['public-disorder-weapons'] = "Public disorder &amp; possession of weapons";
category_order.push('public-disorder-weapons');

categories['vehicle-crime'] = "Vehicle crime";
category_order.push('vehicle-crime');

categories['criminal-damage-arson'] = "Criminal damage &amp; arson";
category_order.push('criminal-damage-arson');

categories['violent-crime'] = "Violent crime";
category_order.push('violent-crime');

categories['shoplifting'] = "Shoplifting";
category_order.push('shoplifting');

categories['drugs'] = "Drugs";
category_order.push('drugs');

categories['other-theft'] = "Other theft";
category_order.push('other-theft');

categories['other-crime'] = "Other crime";
category_order.push('other-crime');

/*
    Crime maps scripts from police.uk
    Modified for Newsquest
*/

var months = new Array(null, 'January','February','March','April','May','June','July','August','September','October','November','December');
var map;
var zoom_start = 13;
var zoom_min = 8;
var zoom_max = 18;
var marker = new google.maps.Marker({
    draggable: true
});
var markers = [];
var marker_icons_single = new Object();
var marker_icons = new Object();
$.each(categories, function(b, a) {
   marker_icons_single[b] = new google.maps.MarkerImage("http://www.herefordtimes.com/resources/static/standard/images/crime/" + b + "-small.png", new google.maps.Size(30, 30));
    marker_icons[b] = [{
        url: "http://www.herefordtimes.com/resources/static/standard/images/crime/" + b + "-small.png",
        height: 30,
        width: 30,
        opt_anchor: [15, 0],
        opt_clickable: [[8, 8], [15, 15]],
        opt_textColor: "#ffffff",
        opt_textSize: 8
    },
    {
        url: "http://www.herefordtimes.com/resources/static/standard/images/crime/" + b + "-medium.png",
        height: 60,
        width: 60,
        opt_anchor: [30, 0],
        opt_clickable: [[19, 20], [23, 23]],
        opt_textColor: "#ffffff",
        opt_textSize: 12
    },
    {
        url: "http://www.herefordtimes.com/resources/static/standard/images/crime/" + b + "-large.png",
        height: 100,
        width: 100,
        opt_anchor: [50, 0],
        opt_clickable: [[27, 28], [45, 45]],
        opt_textColor: "#ffffff",
        opt_textSize: 14
    }]
});
var cluster = null;
var current_crimes = new Object();
var refresh_crimes_street = true;
var refresh_crimes_neighbourhood = true;
var streets = new Object();
var street_ids = [];
var kml_layer = null;
var circle_radius;
var circle = new google.maps.Circle({
    radius: circle_radius,
    fillColor: "#5eb1ff",
    fillOpacity: 0.26,
    strokeWeight: 2,
    strokeColor: "#4e6c89",
    strokeOpacity: 0.2,
    clickable: false
});
var info_windows = [];
var category = "all-crime";
var mode = "streets";
var resize_timeout;
var current_width = 0;

function category_cmp(f, e) {
    var d = $.inArray(f, category_order);
    var g = $.inArray(e, category_order);
    if (d > g) {
        return 1
    }
    return 0
}
function sort_categories(f) {
    var d = {},
    e,
    b = [];
    for (e in f) {
        if (f.hasOwnProperty(e)) {
            b.push(e)
        }
    }
    b.sort(category_cmp);
    for (e = 0; e < b.length; e++) {
        d[b[e]] = f[b[e]]
    }
    return d
}
function sort_streets(g) {
    var d = [],
    e,
    b = [];
    street_ids = [];
    for (e in g) {
        if (g.hasOwnProperty(e)) {
            b.push(g[e].details.name + "|" + e)
        }
    }
    b.sort();
    for (e = 0; e < b.length; e++) {
        var f = b[e].split("|");
        d.push(g[f[1]]);
        street_ids.push(f[1])
    }
    return d
}
function show_crime_street(g, a) {
    removeCrime("info_windows");
    var e = streets[$.inArray(g.toString(), street_ids)];
    var h = '<div class="popup"><h2 style="font-size:123.1%; margin-bottom: 1em; margin-right:20px;">' + e.details.name + ' <sup style="color:#888; font-size:60%; font-weight:normal;">&dagger;</sup></h2><table style="border:0; border-collapse:collapse; overflow:visible; width:100%;"><tr><th style="background:#EFF5FF; color:#888; padding:4px 16px 4px 8px; text-align:left;">Crime type</th><th style="background:#EFF5FF; color:#888; padding:4px 8px 4px 8px; text-align:center;">Total</th></tr>';
    var f = new Object();
    $.each(e.crimes, function(n, l) {
        if (typeof(f[l.category]) == "undefined") {
            var m = false;
            if (l.context) {
                m = true
            }
            f[l.category] = new Object({
                total: 1,
                context: m
            })
        } else {
            f[l.category].total += 1;
            if (l.context) {
                f[l.category].context = true
            }
        }
    });
    var k = sort_categories(f);
    $.each(k, function(l, m) {
        h += '<tr><td style="border-top:1px solid #D3D5D7; padding:4px 16px 4px 8px;"><span class="' + l + '">' + categories[l] + '</span>';
        h += '</td><td style="border-top:1px solid #D3D5D7; padding:4px 8px 4px 8px; text-align:center;">' + m.total + "</td></tr>"
    });
    h += '</table><p style="color:#999; line-height:110%; margin-top:1.5em; margin-bottom:0;"><small style="font-size:85%;"><sup style="font-size:77%">&dagger;</sup> <span style="font-style:italic;">To protect privacy, crimes are mapped to points on or near the road where they occurred.</span></small></p></div>';
    var d = e.crimes[0].location;
    var j = new google.maps.LatLng(d.latitude, d.longitude);
    if (a == "left_panel" && map.getZoom() != 16) {
        map.setCenter(j);
        map.setZoom(16)
    }
    var b = new google.maps.InfoWindow({
        content: h,
        maxWidth: 300,
        position: j
    });
    b.open(map);
    info_windows.push(b);
    
    google.maps.event.addListener(b, "domready", function() {
        $(".crimeRoads li a[rel=" + g + "]").addClass("highlight")
    });
    google.maps.event.addListener(b, "closeclick", function() {
        removeCrime("info_windows")
    })
}

function initPoliceMap() {
    //resize_map();
    map = mapHandler.map;
    request_crimes(mode);

}
function request_crimes(a) {
    mode = a;
    $(".crimeLoad").show();
    removeCrime("markers");
    removeCrime("info_windows");

    circle.setMap(mapHandler.map);
    //circle.setCenter(marker.getPosition());
    //if (refresh_crimes_street) {
        crimes_street()
    //} else {
    //    crimes_street_roads();
    //    show_markers(category)
    //}
}

function crimes_street() {
     $(".crimeLoad").show();
     $(".crimeTypes,.crimeFacets h4,.crimeRoads").hide();
    var d = marker.getPosition();
    var a = circle_radius / 1609.344;
    var latLon = mapHandler.getCurrentCenter();
    var b = '/data/police/crimes/'+latLon[0]+'/'+latLon[1]; 
    
    $.ajax({
        type: "GET",
        dataType: "json",
        url: b,
        success: function(e) {
            current_crimes = new Object();
            streets = new Object();
            $.each(categories, function(f, g) {
                current_crimes[f] = []
            });
            category_totals = new Object();
            all_total = 0;
            dBool = false;
            $.each(e, function(g, f) {

                if ( !dBool)
                {
                    dBool = true;
                    dates = f.month.split('-');
                    year = parseInt(dates[0], 10);
                    month = parseInt(dates[1], 10);
                    month = months[month];
                    dStr = month+' '+year;

                    $('#last_date').html(dStr);
                }
                if (category_totals[f.category]) {
                    category_totals[f.category] += 1
                } else {
                    category_totals[f.category] = 1
                }
                all_total += 1;
                current_crimes[f.category].push(f);
                if (typeof(streets[f.location.street.id]) == "undefined") {
                    var h = new Object();
                    h.details = f.location.street;
                    h.context = false;
                    h.crimes = [];
                    h.categories = [f.category];
                    streets[f.location.street.id] = h
                }
                if (f.context) {
                    streets[f.location.street.id].context = true
                }
                streets[f.location.street.id].crimes.push(f);
                if ($.inArray(f.category, streets[f.location.street.id].categories) == -1) {
                    streets[f.location.street.id].categories.push(f.category)
                }
            });
            streets = sort_streets(streets);
            show_markers(category);
            $(".crimeTypes li a span").html("0");
            $.each(category_totals, function(f, g) {
                $("." + f + " a span").html(g)
            });
            var html = '';
            $.each(category_totals, function(catName, catVal) {
                var realName = categories[catName];

                html += realName+' ('+catVal+' reported) &nbsp; ';

            });
            scroller.set(html);

            $("#policeTotal").html(all_total+" crimes detected locally");
            
            if (mode == "streets") {
                crimes_street_roads()
            }
            refresh_crimes_street = false;
            $(".crimeLoad").hide();
            $(".crimeTypes,.crimeFacets h4,.crimeRoads").show();
        },
        error:function(x,e){
            if(x.status==0){
                $(".crimeLoad").hide();
                $(".crimeSubhead").before('<p class="crimeAttention"><strong>Sorry, we were unable to load the information</strong><br />(User offline)</p>')
            }else if(x.status==404){
                $(".crimeLoad").hide();
                $(".crimeSubhead").before('<p class="crimeAttention"><strong>Sorry, we were unable to load the information</strong><br />(Requested URL not found)</p>')
            }else if(x.status==500){
                $(".crimeLoad").hide();
                $(".crimeSubhead").before('<p class="crimeAttention"><strong>Sorry, we were unable to load the information</strong><br />(Internel Server Error)</p>')
            }else if(e=='parsererror'){
                $(".crimeLoad").hide();
                $(".crimeSubhead").before('<p class="crimeAttention"><strong>Sorry, we were unable to load the information</strong><br />(Parsing JSON Request failed)</p>')
            }else if(e=='timeout'){
                $(".crimeLoad").hide();
                $(".crimeSubhead").before('<p class="crimeAttention"><strong>Sorry, we were unable to load the information</strong><br />(Request Time out)</p>')
            }else {
                $(".crimeLoad").hide();
                $(".crimeSubhead").before('<p class="crimeAttention"><strong>Sorry, we were unable to load the information</strong><br />(Unknow Error '+x.responseText+')</p>')
            }
        }
    })
}
function crimes_street_roads() {
    var d = 0;
    if ($(".crimeRoads li").length == 0 || refresh_crimes_street) {
        
        var e = new Object();
        var b = [];
        if (streets.length > 0) {
            $.each(streets, function(h, j) {
                var g = [];
                $.each(categories, function(l, k) {
                    if (l != "all-crime") {
                        if ($.inArray(l, j.categories) != -1) {
                            g.push('<li class="' + l + '" title="' + k + '">' + k + '</li>')
                        } else {
                            g.push('<li title="' + k + '">' + k + '</li>')
                        }
                    }
                });
                
                var f = '<li><a href="#" rel="' + j.details.id + '">' + j.details.name + "";
                f += '<ul class="categories">' + g.join("") + "</ul></a></li>";
                b.push(f)
            });
            $(".crimeRoads li").remove();
            var a = b.join("");
            $(".crimeRoads").append(a);
            
        } else {
            $(".crimeRoads li").remove();
            $(".crimeRoads").append('<li>There have been no crimes reported in this area.</li>');
        }
    }
}
/*
function crimes_street_commentary(b) {
    var g = streets[$.inArray(b.attr("rel").toString(), street_ids)];
    var f = new Object();
    $.each(g.crimes,
    function(h, a) {
        if (a.context) {
            if (typeof(f[a.category]) == "undefined") {
                f[a.category] = [a]
            } else {
                f[a.category].push(a)
            }
        }
    });
    var e = sort_categories(f);
    var d = "<h2>" + g.details.name + "</h2>";
    $.each(e,
    function(a, h) {
        d += '<div class="category"><h3><img src="http://www.herefordtimes.com/resources/static/standard/images/crime/colours/' + a + '.png" alt="' + categories[a] + '"/> ' + categories[a] + "</h3>";
        $.each(h,
        function(k, j) {
            var l = "<p>" + j.context.replace("\n", "<br/>") + "</p>";
            d += '<div class="crime">' + l + "</div>"
        });
        d += "</div>"
    });
    //$.fancybox('<div id="street_commentary">' + d + "</div>")
}
*/

function add_marker(b, d) {
    var a = new google.maps.Marker({
        position: new google.maps.LatLng(b.location.latitude, b.location.longitude),
        icon: marker_icons_single[category]
    });
    $.data(a, "street", b.location.street.id.toString());
    $.data(a, "total", d);
    markers.push(a)
}
function show_markers(a) { 
    removeCrime("markers");
    var b = $(".crimeTypes");
    var d = new Object();
    total_crimes = 0;
    if (a == "all-crime") {
        $.each(current_crimes, function(e, f) {
            $.each(f, function(h, g) {
                if (typeof(d[g.location.street.id]) == "undefined") {
                    c = new Object();
                    c.total = 1;
                    c.details = g.location.street;
                    d[g.location.street.id] = c
                } else {
                    d[g.location.street.id].total += 1
                }
                total_crimes += 1
            })
        })
    } else {
        $.each(current_crimes[a], function(f, e) {
            if (typeof(d[e.location.street.id]) == "undefined") {
                c = new Object();
                c.total = 1;
                c.details = e.location.street;
                d[e.location.street.id] = c
            } else {
                d[e.location.street.id].total += 1
            }
            total_crimes += 1
        })
    }
    $.each(d, function(g, f) {
        var e = $.inArray(g, street_ids);
        add_marker(streets[e].crimes[0], f.total)
    });
    
    if (cluster) {
        cluster.clearMarkers()
    }
    cluster = new MarkerClusterer(map, markers, {
        maxZoom: zoom_max,
        gridSize: 40,
        styles: marker_icons[a]
    });
}
function removeCrime(b) {
    if (b == "markers") {
        for (i in markers) {
            markers[i].setMap(null)
        }
        markers.length = 0;
        if (cluster) {
            cluster.clearMarkers()
        }
    } else {
        if (b == "info_windows") {
            for (i in info_windows) {
                try {
                    google.maps.event.clearInstanceListeners(info_windows[i]);
                    info_windows[i].close()
                } catch(a) {}
            }
            info_windows.length = 0
        }
    }
};


/* Neighbourhood map */
var mapNeighbourhood;
var markerNeighbourhood = new google.maps.Marker({
    clickable: false
});
var station;
var kml_layer = null;

// function initNeighbourhood(c, b) {

//     markerNeighbourhood.setPosition(mapNeighbourhood.getCenter());
//     markerNeighbourhood.setMap(mapNeighbourhood);
//     if (station) {
//         station.setMap(mapNeighbourhood);
//         $("#police_station").click(function () {
//             var d = new google.maps.LatLngBounds();
//             d.extend(marker.getPosition());
//             d.extend(station.getPosition());
//             map.fitBounds(d)
//         })
//     }
// }

function initNeighbourhood() {
    var latLon = mapHandler.getCurrentCenter();
    var b = '/data/police/neighbourhood/'+latLon[0]+'/'+latLon[1]; 
    $.ajax({
        type: "GET",
        dataType: "json",
        url: b,
        success: function (data) {
            addKml(data.neighbourhood, data.force);
            initForceData(data.force);
            getPoliceTeam(data.neighbourhood, data.force);
        }
    });
}

function getPoliceTeam(neighbourhood, force) {
    var b = '/data/police/force/'+force+'/'+neighbourhood; 
    $.ajax({
        type: "GET",
        dataType: "json",
        url: b,
        success: function (data) {
            console.log(data);
        }
    });
}

function initForceData(force) {
    var b = '/data/police/force/'+force; 
    $.ajax({
        type: "GET",
        dataType: "json",
        url: b,
        success: function (data) {
            $.each(data.engagement_methods, function (f, g) {
                if (g.title.toLowerCase() == 'twitter') {
                    var url = g.url.replace('twitter.com/', '');
                    url = url.replace('www.', '');
                    url = url.replace('http://', '');
                    twitterName = url.replace('https://', '');
                    twitter.screenname = twitterName;
                    twitter.updateTweets();
                }
            });
        }
    });
}

function addKml(neighbourhood, force) {
    var a = "http://crimemapper2.s3.amazonaws.com/frontend/kmls/boundaries/" + force + "/" + neighbourhood + ".kml";
    kml_layer = new google.maps.KmlLayer(a, {
        map: mapHandler.map,
        suppressInfoWindows: true
    })
}

function removeNeighbourhood() {
    kml_layer.setMap(null);
}

/* Feeds */
// $( function() {
//     //YouTube    
//     $('.crimeYouTube').youTubeChannel({ 
//         userName: $('.crimeYouTube').attr('rel'),
//         numberToDisplay: 3
//     });
    
//      $('.crimeTwitter').getTwitter({
//         userName: $('.crimeTwitter').attr('rel'),
//         numTweets: 3
//     });
     
//     $('.crimeRss').rssfeed($('.crimeRss').attr('rel'), {
//         limit: 3
//     });
    
//     $('.crimeEvents').find("li:last").addClass("last");
    
//     $('.crimeEvents li .crimeEventDesc').condense(
//             { 
//               condensedLength: 100          
//             }
//         );  
//    
//});
