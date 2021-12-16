var express = require('express');
var app = express();
var fs = require("fs");
var requestIp = require('request-ip');

const {spawn} = require('child_process') // for python

app.post('/', function(req, res){
  res.statusCode = 200;
  res.end();
})

app.get('/admin/healthcheck', function (req, res) {
   //call backend to check if connection is ok
   var ans;
   // spawn new child process to call the python script
   const python = spawn('python3', ['healthy.py', 'hello']);
   // collect data from script
   python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     ans = data.toString();
     if (ans === 'healthy\n')
     {
       fs.readFile( __dirname + "/jason/" + "connected.json", 'utf8', function (err, data) {
          //console.log( data );
          res.end( data );
       });
     }
     else
     {
       fs.readFile( __dirname + "/jason/" + "disconnected.json", 'utf8', function (err, data) {
          //console.log( data );
          res.end( data );
       });
     }
   });
})

app.get('/admin/resetpasses', function (req, res) {
   //call backend to reset passes
   /*
  if it is return:
   fs.readFile( __dirname + "/jason/" + "ok.json", 'utf8', function (err, data) {
      //console.log( data );
      res.end( data );
   });
   else return:
   fs.readFile( __dirname + "/jason/" + "failed.json", 'utf8', function (err, data) {
      //console.log( data );
      res.end( data );
   });
   */
})

app.get('/admin/resetstations', function (req, res) {
   //call backend to reset intitial stations
   /*
  if it is return:
   fs.readFile( __dirname + "/jason/" + "ok.json", 'utf8', function (err, data) {
      //console.log( data );
      res.end( data );
   });
   else return:
   fs.readFile( __dirname + "/jason/" + "failed.json", 'utf8', function (err, data) {
      //console.log( data );
      res.end( data );
   });
   */
})

app.get('/admin/resetvehicles', function (req, res) {
   //call backend to reset initial vehicles
   /*
  if it is return:
   fs.readFile( __dirname + "/jason/" + "ok.json", 'utf8', function (err, data) {
      //console.log( data );
      res.end( data );
   });
   else return:
   fs.readFile( __dirname + "/jason/" + "failed.json", 'utf8', function (err, data) {
      //console.log( data );
      res.end( data );
   });
   */
})

app.get('/PassesPerStation/:stationID/:date_from/:date_to',function(request, response) {
    var s_id = request.params.stationID;
    var date1 = request.params.date_from;
    var date2 = request.params.date_to;
    console.log(date1);
    console.log(date2);
    // call backend

    // create and run python child process
    //

    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python3', ['PassesPerStation.py', s_id, date1, date2]);
    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    response.statusCode = 200;
    response.send(dataToSend)
    });

    //
});

app.get('/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to',function(request, response) {
    var date1 = request.params.date_from;
    var date2 = request.params.date_to;
    console.log(date1);
    console.log(date2);
    response.statusCode = 200;
    response.end();
    //call backend
});

app.get('/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to',function(request, response) {
    var date1 = request.params.date_from;
    var date2 = request.params.date_to;
    console.log(date1);
    console.log(date2);
    response.statusCode = 200;
    response.end();
    //call backend
});

app.get('/ChargesBy/:op_ID/:date_from/:date_to',function(request, response) {
    var date1 = request.params.date_from;
    var date2 = request.params.date_to;
    console.log(date1);
    console.log(date2);
    response.statusCode = 200;
    response.end();
    //call backend
});

app.get('/hello',function(request, response) {
    var clientIp = requestIp.getClientIp(request);
    console.log("IP of connected client: ")
    console.log(clientIp);
    response.statusCode = 200;
    response.end("hello dear friend, welcome to my RESTful API!! your IP address is: " + clientIp);
});

app.get('*', function(request, response){
  response.statusCode = 400; //?error statusCode
  response.end("you send an invalid request")
})


var server = app.listen(8081, function (req, res) {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})

//http://127.0.0.1:8081/hello