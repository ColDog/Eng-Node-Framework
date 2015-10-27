const WebSocket = require('ws').Server;

module.exports = function(App) {
  App.ws = new WebSocket({ server: App.server });
  App.socket = {};
  App.socket.channels = {};

  App.socket.on = function(channel, callback) {
    (App.socket.channels[channel] = (App.socket.channels[channel] || [])).push(callback)
  };

  App.socket.emit = function(channel, message) {
    App.ws.clients.forEach(function each(client) {
      client.send(JSON.stringify({
        channel: channel,
        data: message
      }));
    });
  };

  App.ws.on('connection', function(ws){
    console.log('websocket connected');


    ws.onmessage = function(msg) {
      var req = JSON.parse(msg.data);
      console.log('recieved message', msg.data);
      if (req.id) {

        var res = {};
        var middleware = [];
        middleware = middleware.concat(App.before);
        if (req.controller && req.action) {
          var func = App.Controllers[req.controller][req.action];
          if (typeof func === 'function') {
            middleware.push(func)
          }
        }

        middleware = middleware.concat(App.after)
        middleware.push(function(req, res){
          ws.send(JSON.stringify({
            id: req.id,
            data: res
          }))
        });

        var ctx = {req: req, res: res};
        App.runMiddleware(middleware, ctx, req, res);
      } else if (req.channel) {
        for (var i=0;i<socket.channels[data.channel].length;i++) {
          App.socket.channels[data.channel][i](data)
        }
      }

    }
  });
};
