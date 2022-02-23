const http = require('http');

module.exports = { ret: ret };function ret(op1, datefrom, dateto, format)
{
  http.get('http://localhost:9103/interoperability/api/chargesby/'+op1+'/'+datefrom+'/'+dateto+'/?format=json', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //console.log(data);
      if (data == '') {console.log('No data was returned'); return;}
      if (format == 'json')
      {
        formJson(data);
      }
      else
      {
        formCSV(data);
      }
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

function formJson(data)
{
  var res = JSON.parse(data);
  //console.log(res)

  //write file in json format
  'use strict';
  const fs = require('fs');
  fs.writeFileSync('chargesby.json', data);
  console.log('Json file saved successfully')
}

function formCSV(data)
{
  var res = JSON.parse(data);
  //write file in csv format
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: 'chargesby.csv',
    header: [
      {id: 'VisitingOperator', title: 'VisitingOperator'},
      {id: 'NumberOfPasses', title: 'NumberOfPasses'},
      {id: 'PassesCost', title: 'PassesCost'}
    ]
  });
  csvWriter
    .writeRecords(res.PPOList)
    .then(()=> console.log('CSV file saved successfully'));
}
