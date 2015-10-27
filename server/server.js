const App = require('./engine');

App.router.add({
  '/': function(req, res, next) {
    res.write('hello world');
    console.log(req);
    next()
  }
});

App.listen(3000);
