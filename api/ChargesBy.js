var fs = require("fs");
const {spawn} = require('child_process') // for python

module.exports = function(app)
{
  app.route('/interoperability/api/ChargesBy/:op_ID/:date_from/:date_to')
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
    var op_id = request.params.op_ID;
    var date1 = request.params.date_from;
    var date2 = request.params.date_to;
    //console.log(date1);
    //console.log(date2);
    //call backend

    var dataToSend = [];
    // spawn new child process to call the python script
    const python = spawn('python3', ['../backend/ChargesBy.py', op_id, date1, date2]);
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
            "op_ID": "op_ID",
            "RequestTimestamp": "RequestTimestamp",
            "PeriodFrom": "PeriodFrom",
            "PeriodTo": "PeriodTo",
            "PPOList": "PPOList"
          };

          var csvContent = ConvertObjToCSV(header1);
          var obj = JSON.parse(toSend);

          csvContent += obj.op_id;
          csvContent += ',';
          csvContent += obj.RequestTimestamp;
          csvContent += ',';
          csvContent += obj.PeriodFrom;
          csvContent += ',';
          csvContent += obj.PeriodTo;
          csvContent += ',';
          csvContent += '"';

          var header2 = {
            "VisitingOperator": "VisitingOperator",
            "NumberOfPasses": "NumberOfPasses",
            "PassesCost": "PassesCost"
          };

          csvContent += ConvertObjToCSV(header2);

          //csvContent += '\n';

          var pPOList = obj.PPOList;
          csvContent += ConvertToCSV(pPOList);
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
