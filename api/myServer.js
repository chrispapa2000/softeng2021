var express = require('express');
var app = express();
var fs = require("fs");
var requestIp = require('request-ip');
var cors = require('cors');
const https = require('https');
/*var options = {
	key: fs.readFileSync('../../ssl.key'),
	cert: fs.readFileSync('../../ssl.cert')
};*/
app.use(cors())
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
require('./TimePeriodPasses')(app);

'use strict';
const multer = require('multer');
const csv = require('fast-csv');
const Router = express.Router;
const upload = multer({ dest: 'received' });
const router = new Router();

const bp = require('body-parser')
app.use(bp.json())

app.use('/handleFile', router);
router.post('/', upload.single('file'), function (req, res) {
  //console.log(req);
  if (req.file == undefined)
  {
    return res.status(500).send("problem\n");
  }
  const fileRows = [];

  // open uploaded file
  csv.parseFile(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      //console.log(fileRows)
      //fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
      //give the file a proper name
      fs.rename(req.file.path, 'received/new_passes.csv', function(err) {
          if (err) console.log('ERROR: ' + err);
      });
      //call python script to do the dirty job
      const python = spawn('python3', ['../backend/AddPasses.py']);
      python.stdout.on('data', (data)=>{console.log(`stdout: ${data}`)})
      python.stderr.on('data', (data)=>{console.log(`stderr: ${data}`)})
      python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        if (code === 0){res.send("passes updated succesfully\n")}
        else {res.send("a problem occurred\n")}
      })
    })
});


//catch all incorrect post calls
app.post('*', function(request, response){
  response.statusCode = 500; //?error statusCode
  response.end("you sent an invalid post request")
})

//catch all incorrect get calls
app.get('*', function(request, response){
  response.statusCode = 500; //?error statusCode
  response.end("you sent an invalid get request")
})


var server = app.listen(9103, function (req, res) {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
.on('error', function(err) {console.log(err)});

//https.createServer(options, app).listen(9103);
//http://127.0.0.1:8081/hello
