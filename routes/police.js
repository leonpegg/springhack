var http = require("http");
var url = require("url");

var baseUrl = 'data.police.uk';
var basePath = '/api/';

exports.policeCrimeData = function(req, res) {
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;
	
	var options = {
  		host: baseUrl,
  		path: basePath+'crimes-street/all-crime?lat='+latitude+'&lng='+longitude
	};    
	
	var body = '';
	http.get(options, function(data) {
	  		data.on("data", function(chunk) {
  			body += chunk;
  		});
  		data.on("end", function() {
  			//res.writeHead(200, {'Content-type': 'application/json'});
  			res.setHeader('Content-type', 'application/json');
  			res.send(body);		
  		});
	}).on('error', function(e) {
  		console.log('ERROR: ' + e.message);
	});
}

exports.policeNeighbourhoodData = function(req, res) {
	
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;
	
	var options = {
  		host: baseUrl,
  		path: basePath+'locate-neighbourhood?q='+latitude+','+longitude
	};    
	console.log(options);
	var body = '';
	http.get(options, function(data) {
  		data.on("data", function(chunk) {
  			body += chunk;
  		});
  		data.on("end", function() {
  			var data = JSON.parse(body);
  			console.log(body);
  			var neighbourhood = data.neighbourhood;
  			var force = data.force;

  			getNeighbourhoodData(res, neighbourhood, force);
  		});
	}).on('error', function(e) {
  		//console.log('ERROR: ' + e.message);
	});
}

function getNeighbourhoodData(res, neighbourhood, force)
{
	var options = {
  		host: baseUrl,
  		path: basePath+force+'/'+neighbourhood
	};

	console.log(options);
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