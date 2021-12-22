var express = require('express');
var app = express();
var fs = require("fs");
var requestIp = require('request-ip');

const {spawn} = require('child_process') // for python

require('./hello')(app);
require('./healthcheck')(app);
require('./resetpasses')(app);
require('./resetstations')(app);
require('./resetvehicles')(app);
require('./PassesPerStation')(app);
require('./PassesAnalysis')(app);
require('./PassesCost')(app);
require('./ChargesBy')(app);


//catch all incorrect post calls
app.post('*', function(request, response){
  response.statusCode = 400; //?error statusCode
  response.end("you send an invalid post request")
})

//catch all incorrect get calls
app.get('*', function(request, response){
  response.statusCode = 400; //?error statusCode
  response.end("you send an invalid get request")
})


var server = app.listen(9103, function (req, res) {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})

//http://127.0.0.1:8081/hello
