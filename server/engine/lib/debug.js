function verifyMiddleware(middleware) {
  middleware.forEach(function(func){
    if (typeof func !== 'function') {
      console.log('your middleware: ', middleware);
      throw 'An item in your middleware is not a function'
    }
  })
}

function verifyRoutes(routes) {
  routes.forEach(function(route){
    if (typeof route.action !== 'function') {
      throw 'Your route "'+ route.path +'" does not map to a function'
    }
  })
}

module.exports.verifyRoutes = verifyRoutes;
module.exports.verifyMiddleware = verifyMiddleware;
