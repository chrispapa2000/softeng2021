// copy paste from resetvehicles_util.js for the time being
// backend and api utilities need to be implemented first
var fs = require("fs");
const http = require('http');
const request = require('request');

module.exports = { ret: ret };function ret(filepath)
{

  var url = 'http://localhost:9103/handleFile';
  var req = request.post(url, function (err, resp, body) {
    if (err) {
      console.log('Error!');
    } else {
      console.log(body);
    }
  });
  var form = req.form();
  form.append('file', fs.createReadStream(filepath), {
    filename: filepath,
    contentType: 'text/csv'
  });
}
