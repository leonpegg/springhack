var http = require("http");
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