var proxyPath = '/api';

module.exports = function(app) {
  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  var proxy = require('http-proxy').createProxyServer({secure: false});

  proxy.on('error', function(err, req) {
    console.error(err, req.url); // eslint-disable-line no-console
  });

  app.use(proxyPath, function(req, res){
    // include root path in proxied request
    req.url = proxyPath + '/' + req.url;
    proxy.web(req, res, { target: 'http://localhost:5000' });
  });
};
