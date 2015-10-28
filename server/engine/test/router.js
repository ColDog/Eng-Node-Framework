const assert  = require('assert');
const helper  = require('./helpers');
const App     = require('../index');

describe('Router', function() {
  it('should match a route', function(done){
    App.router.add({'/users': function(req, res, next) { res.body = 'hello world'; next() } });
    assert.doesNotThrow( function() {
      App.router.match( {}, {}, function() {} ) }
    );
    done()
  })
});
