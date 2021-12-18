var requestIp = require('request-ip');

module.exports = function(app)
{
  app.route('/hello')
    .get(fun);
}

function fun(request, response) {
    var clientIp = requestIp.getClientIp(request);
    console.log("IP of connected client: ")
    console.log(clientIp);
    response.statusCode = 200;
    response.end("hello dear friend, welcome to my RESTful API!! your IP address is: " + clientIp);
};
