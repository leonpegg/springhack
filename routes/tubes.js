var http = require('http');

var TUBE_UPDATE_INTERVAL = 1000 * 60 * 15;

exports.performance = function (req, res) {
	var tubedata = {};
	if (global.tubedata) {
		tubedata = global.tubedata;
		var time_diff = Date.now() - tubedata.timestamp;	//in milliseconds
		if (TUBE_UPDATE_INTERVAL > time_diff) {
			console.log('sending tube data from global cache');
			res.send(tubedata.data);
			return;
		}
	}
	
	var body = '';
	var getReq = http.get('http://transportapi.com/v3/uk/tube/dashboard.json?api_key=93f76ecac8f9bdfa63868d3f35f3c834&app_id=b8521156', function(data) {
  		data.on("data", function(chunk) {
  			body += chunk;
  		});
  		data.on("end", function() {
			console.log('Tube data request complete');
			//sometimes tfl returns an empty string for the bike data
			if (!body || '' == body) {
				console.log('Tube data returned empty string');
				if (tubedata.data)	//send data from cache
					res.send(tubedata.data);
				return;
			}
			var returnData = {};
			JSON.parse(body).forEach(function(item) {
				returnData[item[0].split(':')[1].toUpperCase()] = item[1];
			});
			console.log(returnData);
			//console.log(body);
			global.tubedata = {data:returnData, timestamp: Date.now()};
			res.send(returnData);
			return;
  		});
	}).on('error', function(e) {
  		console.log('ERROR downloading Tube data: ' + e.message);
		if (tubedata)
			res.send(tubedata.data);	//send latest cache of bike data
	});
	// http://transportapi.com/v3/uk/tube/dashboard.json?api_key=93f76ecac8f9bdfa63868d3f35f3c834&app_id=b8521156
}