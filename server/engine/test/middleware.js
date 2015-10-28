const assert  = require('assert');
const helper  = require('./helpers');
const App     = require('../index');
const HttpCtx = require('../lib/http-context');

describe('Middleware', function() {
  it('should run middleware', function(done){
    var test = function(req, res, next){
      this.body = 'hello world';
      next()
    };
    var responder = function(req, res, next) {
      assert.equal(this._body, 'hello world');
      next()
    };
    App.middleware = [test, App.router.match];
    App.router.add({ '/': responder });
    var req = helper.req_simple;
    var res = helper.res;
    var ctx = new HttpCtx(req, res, App.router.routes);
    App.run(ctx, req, res, function(req, res, next){
      assert.equal(this._body, 'hello world');
      return 'hello';
    });

    done()
  });
});
