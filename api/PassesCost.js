var fs = require("fs");
const {spawn} = require('child_process') // for python

module.exports = function(app)
{
  app.route('/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to')
    .get(fun);
}

function ConvertToCSV(obj) {
            var str = '';

            var line = '';
            for (var index in obj) {
                if (line != '') line += ','

                line += obj[index];
            }

            str += line + '\r\n';


            return str;
}
/*
function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}
*/
function fun (request, response) {
    var op1 = request.params.op1_ID;
    var op2 = request.params.op2_ID;
    var date1 = request.params.date_from;
    var date2 = request.params.date_to;
    //console.log(date1);
    //console.log(date2);
    //call backend

    var dataToSend = [];
    // spawn new child process to call the python script
    const python = spawn('python3', ['../backend/PassesCost.py', op1, op2, date1, date2]);
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
        toSend = dataToSend.join("")
        if (false)
        {
          console.log(toSend);
          response.send(toSend);
        }
        else {
          var headers = {
            "op1_ID": "op1_ID",
            "op2_ID": "op2_ID",
            "RequestTimestamp": "RequestTimestamp",
            "PeriodFrom": "PeriodFrom",
            "PeriodTo": "PeriodTo",
            "NumberOfPasses": "NumberOfPasses",
            "PassesCost": "PassesCost"
          };

          var csvContent = ConvertToCSV(headers);
          csvContent += ConvertToCSV(JSON.parse(toSend));
          console.log(csvContent);
          response.send(csvContent);

          var download = function(content, fileName, mimeType) {
            var a = document.createElement('a');
            mimeType = mimeType || 'application/octet-stream';

            if (navigator.msSaveBlob) { // IE10
              navigator.msSaveBlob(new Blob([content], {
                type: mimeType
              }), fileName);
            } else if (URL && 'download' in a) { //html5 A[download]
              a.href = URL.createObjectURL(new Blob([content], {
                type: mimeType
              }));
              a.setAttribute('download', fileName);
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } else {
              location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
            }
          }

          download(csvContent, 'dowload.csv', 'text/csv;encoding:utf-8');
        }
      }
      else
      {
        response.statusCode = 500; //internal server console.error
        response.end();
      }
    });
}
