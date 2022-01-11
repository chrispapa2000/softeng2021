const http = require('http');

module.exports = { ret: ret };function ret(station, datefrom, dateto, format)
{
  http.get('http://localhost:9103/interoperability/api/passesperstation/'+station+'/'+datefrom+'/'+dateto+'/?format='+format, (resp) => {
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
        console.log(res)

        //write file in json format
        'use strict';
        const fs = require('fs');
        fs.writeFileSync('../responses/passesperstation.json', data);

        //write file in csv format
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: 'out.csv',
          header: [
            {id: 'PassIndex', title: 'PassIndex'},
            {id: 'PassID', title: 'PassID'},
            {id: 'PassTimeStamp', title: 'PassTimeStamp'},
            {id: 'VehicleID', title: 'VehicleID'},
            {id: 'TagProvider', title: 'TagProvider'},
            {id: 'PassType', title: 'PassType'},
            {id: 'PassCharge', title: 'PassCharge'}
          ]
        });

        csvWriter
          .writeRecords(res.PassesList)
          .then(()=> console.log('The CSV file was written successfully'));
      }
      else console.log(data)
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
