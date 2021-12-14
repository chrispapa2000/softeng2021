var express = require('express');
var app = express();
var fs = require("fs");
var requestIp = require('request-ip');


app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

app.get('/',function(request, response) {

    var clientIp = requestIp.getClientIp(request);
    console.log("IP of connected client: ")
    console.log(clientIp);
    response.end("IP of connected client: " + clientIp);

});

app.get('/hello',function(request, response) {

    var clientIp = requestIp.getClientIp(request);
    console.log("IP of connected client: ")
    console.log(clientIp);
    response.end("hello Ninos, welcome to my RESTful API!! your IP address is: " + clientIp);
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})

//http://127.0.0.1:8081/hello
