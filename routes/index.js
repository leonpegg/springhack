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


exports.bikes = function(req, res) {

	var body = '';
	var getReq = http.get('http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml', function(data) {
  		data.on("data", function(chunk) {
  			body += chunk;
  		});
  		data.on("end", function() {
			// console.log('bikes_body', body);
			parseString(body, function (err, result) {
				res.send(result);
			});
  		});
	}).on('error', function(e) {
  		//console.log('ERROR: ' + e.message);
	});
};