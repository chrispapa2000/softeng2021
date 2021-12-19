var fs = require("fs");
const {spawn} = require('child_process') // for python

module.exports = function(app)
{
  app.route('/interoperability/api/admin/resetpasses')
    .post(fun);
}

//resetpasses
function fun (req, response) {
   //call backend to check if connection is ok
   var ans;
   // spawn new child process to call the python script
   const python = spawn('python3', ['../backend/ResetPasses.py']);
   // collect data from script
   python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     ans = data.toString();
   });

   python.on('close', (code) => {
     console.log(`child process close all stdio with code ${code}`);
     if (code === 0)
     {
       // send data to browser
       response.statusCode = 200;
       fs.readFile( __dirname + "/json/" + "ok.json", 'utf8', function (err, data) {
          //console.log( data );
          response.end( data );
       });
     }
     else
     {
       response.statusCode = 500; //internal server error
       fs.readFile( __dirname + "/json/" + "failed.json", 'utf8', function (err, data) {
          //console.log( data );
          response.end( data );
       });
     }
   });
}
