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

$('document').ready( function () {
	$('#police').on('click', function () {
		//$.get('/data/police/'+mapHandler.latitude+'/'+mapHandler.longitude, function(a) {
		//	console.log(a);
		//});
		$.getJSON('/data/police/crimes/'+mapHandler.latitude+'/'+mapHandler.longitude, function(data) {
			handleData(data);
		});
	});
});

function handleData(e) {
	current_crimes = {};
	streets = {};

	// loop through the categories
	$.each(categories, function(f, g) {
	    current_crimes[f] = []
	});

	category_totals = {};
	
	all_total = 0;
	
	$.each(e, function(g, f) {


	    if (category_totals[f.category]) {
	        category_totals[f.category]++;
	    } else {
	        category_totals[f.category] = 1;
	    }
	    
	    all_total++;
	    
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

	//streets = sortStreets(streets);
	//show_markers(category);
	
	$(".crimeTypes li a span").html("0");
 	$.each(category_totals, function(catName, catVal) {
 		var realName = categories[catName];
 		var d = $('<div></div>').html(realName+':'+catVal);
     	
     	$('#policeData').append(d).show();
 	});
 
 	$("#policeTotal").html(all_total+" crimes detected locally");

 	//if (mode == "streets") {
    //	crimes_street_roads()
 	//}
}

function showMarkers(a) {
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
	                d[g.location.street.id] = c;
	            } else {
	                d[g.location.street.id].total += 1;
	            }
	            total_crimes += 1;
	        })
	    })
	} else {
	    $.each(current_crimes[a], function(f, e) {
	        if (typeof(d[e.location.street.id]) == "undefined") {
	            c = new Object();
	            c.total = 1;
	            c.details = e.location.street;
	            d[e.location.street.id] = c;
	        } else {
	            d[e.location.street.id].total += 1;
	        }
	        total_crimes += 1;
	    })
	}

	
	$.each(d, function(g, f) {
	    var e = $.inArray(g, street_ids);
	    add_marker(streets[e].crimes[0], f.total)
	});

	// if (cluster) {
	//     cluster.clearMarkers()
	// }
	// cluster = new MarkerClusterer(map, markers, {
	//     maxZoom: zoom_max,
	//     gridSize: 40,
	//     styles: marker_icons[a]
	// });
}

function addMarker(o, total) {

}

function sortStreets(g) {
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