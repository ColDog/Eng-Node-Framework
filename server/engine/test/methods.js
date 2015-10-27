const request = require('supertest');
const App     = require('../index');
const assert  = require('assert');

describe('everything attached', function(){
  it('should have a router', function(done){
    assert.notEqual(App.router, undefined);
    assert.notEqual(App.router.add, undefined);
    assert.notEqual(App.router.routes, undefined);
    assert.notEqual(App.router.resource, undefined);
    assert.notEqual(App.router.match, undefined);
    done()
  });
  it('should have middleware', function(done){
    assert.notEqual(App.before, undefined);
    assert.notEqual(App.after, undefined);
    assert.notEqual(App.useBefore, undefined);
    assert.notEqual(App.useAfter, undefined);
    done()
  });
  it('should be able to add a route', function(done){
    App.router.add({
      '/': function(req, res, next) {
        res.write('hello world');
        next()
      }
    });
    assert.equal(App.router.routes[0].path.spec, "/");
    done()
  })
});

