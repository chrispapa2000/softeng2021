const http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = { ret: ret };function ret()
{
  var url = 'http://localhost:9103/interoperability/api/admin/resetpasses';
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("error", transferFailed);
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  xhr.onload = function() {
    //console.log("HELLO")
    //console.log(this.responseText);
    var data = JSON.parse(this.responseText);
    console.log(data);
  }
  function transferFailed(evt) {
    console.log("An error occurred.");
  }
}
