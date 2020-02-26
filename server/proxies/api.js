var proxyPath = '/api';
var zlib = require('zlib');

function streamToString (stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

module.exports = function(app) {
  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  var proxy = require('http-proxy').createProxyServer({secure: false});

  proxy.on('error', function(err, req) {
    console.error(err, req.url); // eslint-disable-line no-console
  });

  proxy.on('proxyRes', async function (proxyRes, req, res) {
    var gunzip = zlib.createGunzip();
    let body = await streamToString(proxyRes.pipe(gunzip));

    return res.end(body.replace(/https:\/\/localhost/g, 'http://localhost'));
  });

  app.use(proxyPath, function(req, res){
    // include root path in proxied request
    req.url = proxyPath + '/' + req.url;
    proxy.web(req, res, {
      target: 'https://emberobserver.com' ,
      selfHandleResponse : true
    });
  });
};
