var http = require("http");

var TWITTER_UPDATE_INTERVAL = 1000 * 60;
	
exports.feed = function(req, res) {
	var twitterdata = {};
	if (global.twitterdata.data[req.params.screenname]) {
		twitterdata = global.twitterdata.data[req.params.screenname];
		var time_diff = Date.now() - global.twitterdata.timestamp;	//in milliseconds
		if (TWITTER_UPDATE_INTERVAL > time_diff) {
			res.end('cached data ' + req.params.screenname + ' ' + twitterdata);
			return;
		}
	}
	var body = '';
	var getReq = http.get('http://api.twitter.com/1/statuses/user_timeline.json?include_rts=1&count=20&exclude_replies=true&' + req.params.screenname, function(data) {
  		data.on("data", function(chunk) {
  			body += chunk;
  		});
  		data.on("end", function() {
			console.log('twitter data request complete');
			//sometimes tfl returns an empty string for the bike data
			if (!body || '' == body) {
				console.log('Twitter data returned empty string');
				if (global.twitterdata.data[req.params.screenname])	//send data from cache
					res.send(global.twitterdata.data[req.params.screenname]);
				return;
			}
			global.twitterdata.data[req.params.screenname] = body;
			global.twitterdata.timestamp = Date.now();
			res.end(body);
			return;
  		});
	}).on('error', function(e) {
  		console.log('ERROR downloading twitter data: ' + e.message);
		if (global.twitterdata.data[req.params.screenname])
			res.send(global.twitterdata.data[req.params.screenname]);	//send latest cache of bike data
			return;
	});
}