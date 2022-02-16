const http = require('http');

module.exports = { ret: ret };function ret(station, datefrom, dateto, format)
{
  http.get('http://localhost:9103/interoperability/api/passesperstation/'+station+'/'+datefrom+'/'+dateto+'/?format=json', (resp) => {
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
        fs.writeFileSync('passesperstation.json', data);
        console.log('Json file saved Successfully')
      }
      else
      {
        if (data == '') {console.log('No data was returned'); return;}
        var res = JSON.parse(data);
        //write file in csv format
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: 'passesperstation.csv',
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
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
