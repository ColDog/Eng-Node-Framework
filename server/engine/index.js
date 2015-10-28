'use strict';

const http            = require('http');
const HttpContext     = require('./lib/http-context');
const SocketContext   = require('./lib/socket-context');
const WebSocketServer = require('ws').Server;
const unpipe          = require('unpipe');
const status          = require('statuses');
const methods         = require('./lib/methods');
const debug           = require('./lib/debug');
const router          = require('./lib/router');
const log             = require('./lib/log');

class App {
  constructor() {
    this.middleware = [];
    this.channels = [];
    this.timeout = 10000;
    this.methods = methods;
    this.handleServer = this.handleServer.bind(this);
    this.server = http.createServer(this.handleServer);
    this.ws = new WebSocketServer({server: this.server});
    this.router = router;
    this.initSocket();
  }

  run(ctx, req, res, final) {
    var runAsync = function(funcs, ctx, req, res) {
      (function next(){
        if (funcs.length > 0) {
          var f = funcs.shift();
          f.apply(ctx, [req, res, next])
        }
      })()
    };
    var funcs = this.middleware.concat([final]);
    runAsync(funcs, ctx, req, res)
  }

  handleServer(req, res) {
    try {
      req.start = Date.now();
      var timeout = setTimeout(function(){
        throw 'Request timed out after '+ this.timeout +', for '+ req.url +' make sure you call `next()` in your controllers.'
      }, this.timeout);

      res.on('finish', function(){
        log('finished', new Date - req.start, 'ms');
        clearTimeout(timeout);
      });

      var routes = this.router.routes;
      Fiber(function() {
        var ctx = new HttpContext(req, res, routes);
        this.run(ctx, req, res, function(req, res, next){
          methods.done(req, res, this._body);
        })
      }).run();

    } catch (err) {
      methods.error(req, res, err)
    }
  }

  listen(port) {
    log('middleware length', this.middleware.length);
    debug.verifyMiddleware(this.middleware);
    debug.verifyRoutes(this.router.routes);

    this.server.listen(port, function(){
      log('server starting', port);
    });
  }

  /** Websockets */

  send(client, msg) {
    client.send(JSON.stringify(msg))
  }

  broadcast(channel, message) {
    this.ws.clients.forEach(function(client){
      send(client, {
        channel: channel,
        message: message
      })
    })
  }

  initSocket() {
    let self = this;

    this.ws.on('connection', function(client){

      this.ws.onmessage = function(msg) {
        var req = JSON.parse(msg);
        if (req.id) {

          var ctx = new SocketContext(req, self.routes);
          run(ctx, ctx, ctx.res, function(req, res){
            send(client, res)
          });

        } else {

          var chan = (req.channel || 'message');
          for (var i=0;i<this.channels[chan].length;i++) {
            this.channels[chan][i](req)
          }

        }
      }

    })
  }

}
module.exports = new App();
