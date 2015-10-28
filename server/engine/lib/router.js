'use strict';

const router = {};
const Route  = require('route-parser');
const log    = require('./log');

router.match = function(req, res, next) {
  log('matching route');
  var routes = this.routes;
  for (var i=0;i<routes.length;i++){
    var match = routes[i].path.match(req.path);
    if (match) {
      log('matched route', routes[i].path.spec, 'to', routes[i].action);
      routes[i].action.apply(this, [req, res, function(){
        next()
      }]);
      return;
    }
  }
  next()
};

router.add = function(obj) {
  for (var path in obj) {
    if (obj.hasOwnProperty(path)) {
      log('adding route', path);
      router.routes.push({
        path: new Route(path),
        action: obj[path]
      })
    }
  }
};

router.resource = function(path, controller) {
  var routes = {};
  routes[path]                = controller.index;
  routes[path+'/create']      = controller.create;
  routes[path+'/:id']         = controller.show;
  routes[path+'/:id/update']  = controller.update;
  routes[path+'/:id/destroy'] = controller.destroy;
  router.add(routes);
};

router.routes = [];

module.exports = router;
