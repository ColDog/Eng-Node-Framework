var Route = require('route-parser');

module.exports = function(App){
  App.router = {};
  App.router.routes = [];

  App.router.add = function(obj) {
    for (var path in obj) {
      if (obj.hasOwnProperty(path)) {
        App.router.routes.push({
          path: new Route(path),
          action: obj[path]
        })
      }
    }
  };

  App.router.resource = function(path, controller){
    var routes = {};
    routes[path] = controller.index;
    routes[path+'/create'] = controller.create;
    routes[path+'/:id'] = controller.show;
    routes[path+'/:id/update'] = controller.update;
    routes[path+'/:id/destroy'] = controller.destroy;
    router.add(routes);
  };

  App.router.match = function(url) {
    var routes = App.router.routes;
    for (var i=0;i<routes.length;i++){
      var match = routes[i].path.match(url);
      if (match) {
        routes[i].params = match;
        return routes[i]
      }
    }
    return false
  };

}
