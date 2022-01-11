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
      }
      else console.log(data)
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
