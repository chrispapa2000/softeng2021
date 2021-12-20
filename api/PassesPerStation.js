var fs = require("fs");
const {spawn} = require('child_process') // for python

module.exports = function(app)
{
  app.route('/interoperability/api/PassesPerStation/:stationID/:date_from/:date_to')
    .get(fun);
}

function ConvertObjToCSV(obj) {
            var str = '';

            var line = '';
            for (var index in obj) {
                if (line != '') line += ','

                line += obj[index];
            }

            str += line + '\r\n';


            return str;
}

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }
        if (i === (array.length-1)) str += line + '"' + '\r\n';
        else str += line + '\r\n';
    }

    return str;
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
        toSend = dataToSend.join("");
        if (false)
        {
          response.send(toSend)
        }
        else{
          var header1 = {
            "Station": "Station",
            "StationOperator": "StationOperator",
            "RequestTimestamp": "RequestTimestamp",
            "PeriodFrom": "PeriodFrom",
            "PeriodTo": "PeriodTo",
            "NumberOfPasses": "NumberOfPasses",
            "PassesList": "PassesList"
          };

          var csvContent = ConvertObjToCSV(header1);
          var obj = JSON.parse(toSend);

          csvContent += obj.Station;
          csvContent += ',';
          csvContent += obj.StationOperator;
          csvContent += ',';
          csvContent += obj.RequestTimestamp;
          csvContent += ',';
          csvContent += obj.PeriodFrom;
          csvContent += ',';
          csvContent += obj.PeriodTo;
          csvContent += ',';
          csvContent += obj.NumberOfPasses;
          csvContent += ',';
          csvContent += '"';

          var header2 = {
            "PassIndex": "PassIndex",
            "PassID": "PassID",
            "PassTimeStamp": "PassTimeStamp",
            "VevicleID": "VevicleID",
            "TagProvider": "TagProvider",
            "PassType": "PassType",
            "PassCharge": "PassCharge"
          };

          csvContent += ConvertObjToCSV(header2);

          //csvContent += '\n';

          var passesList = obj.PassesList;
          csvContent += ConvertToCSV(passesList);
          //console.log(csvContent);
          response.send(csvContent);
        }
      }
      else
      {
        response.statusCode = 500; //internal server console.error
        response.end();
      }
    });

    //
}
