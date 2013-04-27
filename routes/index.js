var http = require("http");
var url = require("url");
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

