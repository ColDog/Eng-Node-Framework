var socket = {};
socket.url = (socket.url || 'ws://localhost:8000');
socket.ws = new WebSocket(socket.url);

socket.callbacks = {};
socket.channels = {};

socket.on = function(channel, callback) {
  (socket.channels[channel] = (socket.channels[channel] || [])).push(callback)
};

socket.emit = function(channel, data) {
  socket.ws.send(JSON.stringify({
    channel: channel,
    data: data
  }))
};

socket.onconnection = function() {
  console.log('socket connected')
};

socket.request = function(opts, callback) {
  var id = Math.random().toString(35).substring(2,30);
  if (typeof opts !== 'object') {
    opts = {data: opts}
  }
  opts.id = id;
  socket.ws.send(JSON.stringify(opts));
  socket.callbacks[id] = callback
};

socket.ws.onmessage = function(msg) {
  var data = JSON.parse(msg.data);
  if (data.id) {
    socket.callbacks[data.id](data.data)
  } else if (data.channel) {
    for (var i=0;i<socket.channels[data.channel].length;i++) {
      socket.channels[data.channel][i](data.data)
    }
  }
};

socket.ws.onopen = function(evt) {
  socket.onconnection(evt)
};

var post = function(url, params) {
  return new Promise(function(resolve, reject){
    var xhr;

    if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
    else {
      var versions = [
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
      ];

      for(var i = 0, len = versions.length; i < len; i++) {
        try { xhr = new ActiveXObject(versions[i]); break; }
        catch(e){}
      }
    }

    xhr.onreadystatechange = ensureReadiness;
    function ensureReadiness() {
      if(xhr.readyState < 4) { reject(xhr) }
      if(xhr.status !== 200) { reject(xhr) }
      if(xhr.readyState === 4) { resolve(xhr) }
    }

    xhr.open('POST', url, true);
    xhr.send(JSON.stringify(params));
  })
};

var Resource = function(opts) {
  if (!opts || !opts.name) { throw 'Resource definition requires a `name` attribute, ie: new Resource({name: "HomeController"})' }
  this.name       = opts['name'];                // controller name to be used on the server
  this.queries    = (opts['queries'] || {});     // a cache of queries called when the server says data has been updated
  this.mode       = (opts['mode'] || 'socket');  // mode of transportation 'http' or 'socket'.
  this.path       = opts['path'];                // path prefix for restful resourced
  this.before     = opts['before'];
  this.after      = opts['after'];

  this.fetch = function(opts) {
    var self        = this;
    var act         = (opts['action'] || '');
    var par         = (opts['params'] || {});
    var cache       = (opts['cache'] || false);
    var controller  = (opts['controller'] || self.name);
    var route       = (opts['route'] || '/');
    var mode        = (opts['mode'] || self.mode);


    console.log('this', this);
    return new Promise(function (resolve, reject) {
      try {
        if (cache) { self.queries[act] = par } // if is a reader request, cache the query
        var req = {controller: controller, action: act, params: par};
        if (typeof self.before === 'function') { self.before(req) }

        if (mode === 'socket') {

          socket.request(req, function (data) {
            if (typeof self.after === 'function') { self.after(data) }
            resolve(data);
          })

        } else if (mode === 'http') {

          post(self.path+route, req).then(function(data){
            if (typeof self.after === 'function') { self.after(data) }
            resolve(data);
          })

        } else {
          reject('Mode must be either http or socket')
        }
      } catch (err) {
        reject(err)
      }
    })
  }
};


Resource.prototype.show      = function(id)    { return this.fetch({mode: 'socket', action: 'show', params: {id: id}, cache: true }) }
Resource.prototype.where     = function(pars)  { return this.fetch({mode: 'socket', action: 'where', params: pars, cache: true }) }
Resource.prototype.all       = function()      { return this.fetch({mode: 'socket', action: 'all', params: {}, cache: true }) }
Resource.prototype.create    = function(pars)  { return this.fetch({mode: 'socket', action: 'create', params: pars, cache: false }) }
Resource.prototype.destroy   = function(id)    { return this.fetch({mode: 'socket', action: 'destroy', params: {id: id}, cache: false }) }
Resource.prototype.update    = function(pars)  { return this.fetch({mode: 'socket', action: 'update', params: pars, cache: false }) }
Resource.prototype.$show     = function(id)    { return this.fetch({route: '/'+id, mode: 'http', action: 'show', params: {id: id}, cache: true }) }
Resource.prototype.$where    = function(pars)  { return this.fetch({route: '/search', mode: 'http', action: 'where', params: pars, cache: true }) }
Resource.prototype.$all      = function()      { return this.fetch({route: '/', mode: 'http', action: 'all', params: {}, cache: true }) }
Resource.prototype.$create   = function(pars)  { return this.fetch({route: '/create', mode: 'http', action: 'create', params: pars, cache: false }) }
Resource.prototype.$destroy  = function(id)    { return this.fetch({route: '/'+id+'/destroy', mode: 'http', action: 'destroy', params: {id: id}, cache: false }) }
Resource.prototype.$update   = function(pars)  { return this.fetch({route: '/'+pars.id+'/update', mode: 'http', action: 'update', params: pars, cache: false }) }


if (typeof module === 'undefined') {
  window.socket = socket;
  window.Resource = Resource;
} else {
  module.exports.Resource = Resource;
  module.exports.socket = socket;
}
