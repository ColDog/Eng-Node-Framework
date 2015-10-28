const Context = require('../lib/http-context');
const assert  = require('assert');
const helper  = require('./helpers')
const ctx = new Context(helper.req, helper.res);

describe('Context', function(){
  it('should parse the url', function(done){
    assert.equal(ctx.search['hello'], 'bob' );
    assert.equal(ctx.path, '/users/42');
    done()
  });
  it('can set a cookie', function(done){
    ctx.cookie = ['my', 'cookie', {maxAge: '2000'}];
    assert.equal(ctx.res._headers['Set-Cookie'], 'my=cookie; Max-Age=2000');
    done()
  });
  it('can get cookies', function(done){
    assert.equal(ctx.cookies['SQLiteManager_currentLangue'], 2);
    assert.equal(ctx.cookies.csrftoken, 'oMvsLl01G2HPFOxXDUJHmGWHLjTxoaJl');
    done()
  });
  it('can set a plain text body', function(done){
    ctx.body = 'hello world';
    assert.equal(ctx.res.statusCode, 200);
    assert.equal(ctx.res.getHeader('Content-Type'), 'text/plain');
    assert.equal(ctx.res.getHeader('Content-Length'), 11);
    done()
  });
  it('can set a json body', function(done){
    var dict = {'hi': 'bob'};
    ctx.body = dict;
    assert.equal(ctx.res.statusCode, 200);
    assert.equal(ctx.res.getHeader('Content-Type'), 'application/json');
    assert.equal(ctx.res.getHeader('Content-Length'), 12);
    assert.equal(ctx._body, JSON.stringify(dict));
    done()
  });
  it('can set an html body', function(done){
    ctx.body = '<p></p>';
    assert.equal(ctx.res.getHeader('Content-Type'), 'text/html');
    done()
  });
  it('can set an error message', function(done){
    //assert.throws( ctx.error(500, 'Wtf') );
    done()
  })
});

