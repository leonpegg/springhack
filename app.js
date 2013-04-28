global.twitterdata = {};
global.twitterdata.data = {};
global.bikedata = {};
global.buslocations = {};
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , police = require('./routes/police.js')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/data/police/crimes/:latitude/:longitude', police.policeCrimeData);
app.get('/data/police/neighbourhood/:latitude/:longitude', police.policeNeighbourhoodData);
app.get('/data/police/force/:force', police.policeForceData);
app.get('/data/police/force/:force/:neighbourhood', police.policeTeam);
app.get('/data/transport/bikes', routes.transportBikes);
app.get('/data/transport/bus', routes.transportBus);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
