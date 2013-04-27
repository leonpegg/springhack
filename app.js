
global.bikedata = {};
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
<<<<<<< HEAD
app.get('/data/police', police.policeData);
=======
app.get('/data/police', routes.policeData);
app.get('/data/bikes', routes.bikes);
>>>>>>> c4bce43855f0ad17e0ad7ef86ad3a68d61b544e8

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
