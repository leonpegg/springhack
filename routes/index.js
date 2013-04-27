var http = require("http")
	, parseString = require('xml2js').parseString;

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.policeData = function(req, res) {
	var options = {
  		host: 'data.police.uk',
  		path: '/api/leicestershire/C01/crime'
	};

	var body = '';
	var getReq = http.get(options, function(data) {
  		data.on("data", function(chunk) {
  			body += chunk;
  		});
  		data.on("end", function() {
  			res.send(body);
  		});
	}).on('error', function(e) {
  		//console.log('ERROR: ' + e.message);
	});
};

var BIKE_UPDATE_INTERVAL = 1000 * 60 * 3;	//3 minutes in ms

exports.bikes = function(req, res) {

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
			if (!body || '' == body && bikedata.data) {
				console.log('Bike data returned empty string');
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