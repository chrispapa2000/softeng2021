const http = require('http');

module.exports = { ret: ret };function ret(op1, op2, datefrom, dateto, format)
{
  http.get('http://localhost:9103/interoperability/api/passescost/'+op1+'/'+op2+'/'+datefrom+'/'+dateto+'/?format='+format, (resp) => {
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
        fs.writeFileSync('../responses/passescost.json', data);

        //write file in csv format
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: '../responses/passescost.csv',
          header: [
            {id: 'op1_ID', title: 'op1_ID'},
            {id: 'op2_ID', title: 'op2_ID'},
            {id: 'RequestTimestamp', title: 'RequestTimestamp'},
            {id: 'PeriodFrom', title: 'PeriodFrom'},
            {id: 'PeriodTo', title: 'PeriodTo'},
            {id: 'NumberOfPasses', title: 'NumberOfPasses'},
            {id: 'PassesCost', title: 'PassesCost'}
          ]
        });
        csvWriter
          .writeRecords([res])
          .then(()=> console.log('The CSV file was written successfully'));
      }
      else console.log(data)
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
