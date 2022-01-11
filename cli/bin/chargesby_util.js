const http = require('http');

module.exports = { ret: ret };function ret(op, datefrom, dateto, format)
{
  http.get('http://localhost:9103/interoperability/api/chargesby/'+op+'/'+datefrom+'/'+dateto+'/?format='+format, (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //console.log(data);
      var res = JSON.parse(data);
      console.log(res);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
