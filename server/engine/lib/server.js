const http      = require('http');
//const request   = require('./request');
//const response  = require('./response');
const final     = require('finalhandler');

module.exports = function(App) {
  App.before  = [];
  App.after   = [];

  App.useBefore  = function(func) { return App.before.push(func) };
  App.useAfter   = function(func) { return App.after.push(func) };

  App.runMiddleware = function(funcs, ctx, req, res) {
    (function next(){
      if (funcs.length > 0) {
        var f = funcs.shift();
        f.apply(ctx, [req, res, next])
      }
    })()
  };

  App.handler = function(req, res) {
    var match = App.router.match(req.path, req.method);
    var done = final(req, res);
    console.log('************')
    console.log(req);
    console.log('************')

    var middleware = [];
    middleware.concat(App.before);
    if (match.action) { middleware.push(match.action); }
    middleware.concat(App.after);
    middleware.push(done);

    var ctx = {req: req, res: res};
    App.runMiddleware(middleware, ctx, req, res);
  };

  App.server = http.createServer(App.handler);

  App.listen = function(port){
    App.server.listen(port, function(){
      console.log("Server listening on: http://localhost:%s", port);
    });
  };

};
