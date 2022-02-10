var fs = require("fs");
const {spawn} = require('child_process') // for python

module.exports = function(app)
{
  app.route('/interoperability/api/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to')
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

function fun (request, response) {
    var op1 = request.params.op1_ID;
    var op2 = request.params.op2_ID;
    var date1 = request.params.date_from;
    var date2 = request.params.date_to;
    var format = request.query.format;
    if ((typeof format) === "undefined") format = "json";
    //console.log(date1);
    //console.log(date2);
    //check parameters
    var ops = new Set(["AO", "OO", "GF", "KO", "EG", "MR", "NE"]);
    if (!ops.has(op1.substring(0,2))){response.statusCode = 400; response.end(); return;}
    if (!ops.has(op2.substring(0,2))){response.statusCode = 400; response.end(); return;}
    if (!ops.has(op1.substring(0,2))){response.statusCode = 400; response.end(); return;}
    if (format != "json" && format != "csv"){response.statusCode = 400; response.end(); return;}
    //call backend

    var dataToSend = [];
    // spawn new child process to call the python script
    const python = spawn('python3', ['../backend/PassesAnalysis.py', op1, op2, date1, date2]);
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
        toSend = dataToSend.join("");
        if (JSON.parse(toSend).NumberOfPasses === 0) response.statusCode = 402;
        else response.statusCode = 200; //status ok
        if (format === "json")
        {
          response.send(toSend)
        }
        else{
          var header1 = {
            "op1_ID": "op1_ID",
            "op2_ID": "op2_ID",
            "RequestTimestamp": "RequestTimestamp",
            "PeriodFrom": "PeriodFrom",
            "PeriodTo": "PeriodTo",
            "NumberOfPasses": "NumberOfPasses",
            "PassesList": "PassesList"
          };

          var csvContent = ConvertObjToCSV(header1);
          var obj = JSON.parse(toSend);

          csvContent += obj.op1_ID;
          csvContent += ',';
          csvContent += obj.op2_ID;
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
            "StationID": "StationID",
            "TimeStamp": "TimeStamp",
            "VehicleID": "VehicleID",
            "Charge": "Charge"
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
}
