var http = require("http");
var url = require("url");

var baseUrl = 'data.police.uk';
var basePAth = '/api/';

exports.policeData = function(req, res) {
	
	var lat = req.query['latitude'];
   	var lon = req.query['longitude'];
	
	var options = {
  		host: baseUrl,
  		path: basePath+'locate-neighbourhood?q='+latitude+','+longitude
	};    
	console.log(options);
	http.get(options, function(data) {
  		data.on("data", function(chunk) {
  			body += chunk;
  		});
  		data.on("end", function() {
  			var neightbourhood = body.neighbourhood;
  			var force = body.force;

  			getCrimeData(res, neighbourhood, force);
  		});
	}).on('error', function(e) {
  		//console.log('ERROR: ' + e.message);
	});
}

function getCrimeData(res, neightbourhood, force)
{
	var options = {
  		host: baseUrl,
  		path: basePath+force+'/'+neightbourhood+'/crime'
	};

	body = '';
	
	http.get(options, function(data) {
  		data.on("data", function(chunk) {
  			body += chunk;
  		});
  		data.on("end", function() {
  			res.send(body)
  		});
	}).on('error', function(e) {
  		//console.log('ERROR: ' + e.message);
	});
}

// exports.policeData = function(req, res) 
// 	var options = {
//   		host: 'data.police.uk',
//   		path: '/api/leicestershire/C01/crime'
// 	};

// 	var body = '';
// 	var getReq = http.get(options, function(data) {
//   		data.on("data", function(chunk) {
//   			body += chunk;
//   		});
//   		data.on("end", function() {
//   			res.send(body);
//   		});
// 	}).on('error', function(e) {
//   		//console.log('ERROR: ' + e.message);
// 	});
// };