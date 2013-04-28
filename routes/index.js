var http = require("http")
  , parseString = require('xml2js').parseString
  , lazy = require('lazy')
  , fs = require('fs');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

var BIKE_UPDATE_INTERVAL = 1000 * 60 * 3;	//3 minutes in ms

exports.transportBus = function(req, res) {

	var req_handler = function(buslocations, req, res) {
		console.log('sending bus line data');

		if (req.query['line']) {
			var	line = parseInt(req.query['line']);
			console.log('line is', line);
			var line_data = buslocations[line];
			res.send(line_data);
		}
		else {
			console.log('line not chosen');
			res.send(buslocations);
		}
	}

	if (global && global.buslocations && global.buslocations.length) {
		console.log('got bus data cached', global.buslocations.length);
		req_handler(global.buslocations, req, res);
	}
	else {
		var buslocations = {};
		console.log('reading bus data in');
		var lz = new lazy(fs.createReadStream('static_data/instant_V1_stopcode_lineid_lat_long_direction.txt'))
			.lines
			.forEach(function(line) {
				line = line.toString();
				var line_split = line.split(",");
				var stop_id = line_split[1].replace(/"/g, '');
				var lat = parseFloat(line_split[2]);
				var lng = parseFloat(line_split[3]);
				var line_id = line_split[4].replace(/"/g, '');
				var direction = parseInt(line_split[5]);
				var line_data = [];
				if (line_id in buslocations) {
					line_data = buslocations[line_id];
				}
				else {
					buslocations[line_id] = line_data;
				}
				line_data.push({stop_id: stop_id, lat: lat, lng: lng, dir: direction});
			}
		)
		.on('pipe', function() {
			global.buslocations = buslocations;
			console.log('read bus data in', buslocations.length);
			req_handler(buslocations, req, res);
		});
	}
};

exports.transportBikes = function(req, res) {

	var bikedata = {};
	if (global.bikedata) {
		bikedata = global.bikedata;
		var time_diff = Date.now() - bikedata.timestamp;	//in milliseconds
		if (BIKE_UPDATE_INTERVAL > time_diff) {
			console.log('sending bike data from global cache');
			res.send(bikedata.data);
			return;
		}
	}

	var body = '';
	var getReq = http.get('http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml', function(data) {
  		data.on("data", function(chunk) {
  			body += chunk;
  		});
  		data.on("end", function() {
			console.log('Bike data request complete');
			//sometimes tfl returns an empty string for the bike data
			if (!body || '' == body) {
				console.log('Bike data returned empty string');
				if (bikedata.data)	//send data from cache
					res.send(bikedata.data);
				return;
			}
			parseString(body, function (err, result) {
				console.log('succesfully parsed bike xml into json');
				global.bikedata = {data:result, timestamp: Date.now()};
				res.send(result);
			});
  		});
	}).on('error', function(e) {
  		console.log('ERROR downloading bike data: ' + e.message);
		if (bikedata)
			res.send(bikedata.data);	//send latest cache of bike data
	});
};
