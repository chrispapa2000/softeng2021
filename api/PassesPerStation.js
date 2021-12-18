var fs = require("fs");
const {spawn} = require('child_process') // for python

module.exports = function(app)
{
  app.route('/PassesPerStation/:stationID/:date_from/:date_to')
    .get(fun);
}

//resetpasses
function fun (request, response) {
    var s_id = request.params.stationID;
    var date1 = request.params.date_from;
    var date2 = request.params.date_to;
    //console.log(date1);
    //console.log(date2);

    // call backend

    // create and run python child process
    //
    var dataToSend = [];
    // spawn new child process to call the python script
    const python = spawn('python3', ['../backend/PassesPerStation.py', s_id, date1, date2]);
    // collect data from script
    python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      dataToSend.push(data)//.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      if (code === 0)
      {
        //if python script closed without errors
        //send data to browser
        response.statusCode = 200; //status ok
        response.send(dataToSend.join(""))
      }
      else
      {
        response.statusCode = 500; //internal server console.error
        response.end();
      }
    });

    //
}
