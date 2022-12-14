var fs = require("fs");
const {spawn} = require('child_process') // for python

module.exports = function(app)
{
  app.route('/interoperability/api/admin/healthcheck')
    .get(fun);
}

function remove_linebreaks(str) {
	return str.replace( /[\r\n]+/gm, "" );
}

function fun (req, response) {
   //call backend to check if connection is ok
   var ans;
   // spawn new child process to call the python script
   const python = spawn('python3', ['../backend/healthy.py']);
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

       fs.readFile( __dirname + "/json/" + "connected.json", 'utf8', function (err, data) {
	     //console.log( data + ans);
	     response.end(remove_linebreaks(data + ans + "}"));
       });
     }
     else if (code === 2)
     {
       response.statusCode = 200;
       fs.readFile( __dirname + "/json/" + "disconnected.json", 'utf8', function (err, data) {
          //console.log( data );
          response.end(remove_linebreaks(data + ans + "}"));
       });
     }
     else
     {
       response.statusCode = 500; //internal server error
       response.end();
     }
   });
}
