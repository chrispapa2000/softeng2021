const http = require('http');

module.exports = { ret: ret };function ret(op1, op2, datefrom, dateto, format)
{
  http.get('http://localhost:9103/interoperability/api/passesanalysis/'+op1+'/'+op2+'/'+datefrom+'/'+dateto+'/?format=json', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //console.log(data);
      if (format == 'json')
      {
        var res = JSON.parse(data);
        //console.log(res)

        //write file in json format
        'use strict';
        const fs = require('fs');
        fs.writeFileSync('../responses/passesanalysis.json', data);
        console.log('Json file saved successfully')
      }
      else {
        //console.log(data)
        var res = JSON.parse(data);
        //write file in csv format
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: '../responses/passesanalysis.csv',
          header: [
            {id: 'PassIndex', title: 'PassIndex'},
            {id: 'PassID', title: 'PassID'},
            {id: 'StationID', title: 'StationID'},
            {id: 'TimeStamp', title: 'TimeStamp'},
            {id: 'VehicleID', title: 'VehicleID'},
            {id: 'Charge', title: 'Charge'},
          ]
        });
        csvWriter
          .writeRecords(res.PassesList)
          .then(()=> console.log('CSV file saved successfully'));
      }
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
