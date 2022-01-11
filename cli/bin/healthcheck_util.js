const http = require('http');

module.exports = { healthy: healthy };function healthy()
{
  http.get('http://localhost:9103/interoperability/api/admin/healthcheck', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //var res = JSON.parse(data);
      //console.log(res);
      console.log(data)
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
