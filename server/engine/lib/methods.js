const unpipe = require('unpipe');
const status = require('statuses');
const log    = require('./log');

function done(req, res, body) {
  res.end(body);
  unpipe(req);
  req.resume();
}

function error(req, res, err) {
  var code      = (err.code || 500);
  var message   = (err.statusMessage || status[code]);
  var response  = (err.response || status[code]);
  var env       = (process.env.NODE_ENV || 'dev');
  var backtrace = env === 'dev' ? err.stack : '';

  log('ERROR', err.stack);

  res.statusCode = code;
  res.statusMessage = message;
  res.setHeader('Content-Type', 'application/json');
  var body = JSON.stringify({
    error: true,
    code: code,
    message: response,
    backtrace: backtrace
  });
  done(req, res, body)
}

module.exports.done = done;
module.exports.error = error;
