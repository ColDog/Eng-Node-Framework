const Context = require('../lib/context');
const mock    = require('node-mocks-http');
const assert  = require('assert');
const req = mock.createRequest({
  method: 'GET', url: '/users/42?hello=bob', headers: { cookie: 'SQLiteManager_currentLangue=2; 9d4bb4a09f511681369671a08beff228=1960057a1d7425da8e8b786cba80304b; da0e0ec32fc289e9f021e3d8bc4e9c0f=1defbe0a4bae6f7abb4e53adf098c529; 6338a5217de3e85c1a237daeff2b4627=6a747d0da7abd5c318cae7753c5adde5; fabric_manage_cohortid=; fabric_manage_groupid=; fabric_guide=library%2Cadmin_home%2Cprofile%2C; _nnfab_session=VmR6ZlJQUEZEU2lTTVkxZEJRY0w2U1NONU1MNHlqdkJ3OW05c0gyNVNpaXoyYXFTUndjeTkwK21sYVNTUGdoVUFacXo5QnI5NU94L2twcCsxSHFVT0FEbzR4NlFSeUpnRGpUYnovTDJkdnhtbklSdUdRSUhSTjh4VVpGUDVxSnYwVkE4R3Y4S1NBYnNxQSsxbWdOTWprTW5Gd1hKM3NoZVBlajRPWEJ5R3Yxc1psQ0xkODNscGJBTSszckhTUGtwVmxwM2FyTTExRE5yVVgrekFuMXBrTzd3RWN2VHNQQzJEK3hZSmJ5SFJtMFZ3cElETzk4bEE2SGlHRGUvdGphUHJRUzkrZ3lxY0xKN2ZLaUJBd1RjMVBpdUN6b3FlOEhROFB2Z0xjZ3U4QVY1eGxnOHFPdk9kR0g0K2xBdVlrMUVLVU9HcTNVeUo5T0FoSjN2NE1VNERpeU5ITUhoa1J3aXU5K0M1aTd3aE83SHZUZTNDaFFVNjRDYitkSEgzZmU1eEhzMW1XQWViK3VSLzN5ejU1dU9iTVRQZFpTWkExVXhFRE1Ceko3Yzk2cz0tLUJuWFhwY0JuWU42a2hSN1NsNE9XZlE9PQ%3D%3D--4b1f6acdfbe07579a73f621ce4401a0d512d3da9; tabstyle=html-tab; __ngDebug=true; sessionid=3qd36xnt76gzk50o5qr9vxyyyxglrm3s; csrftoken=oMvsLl01G2HPFOxXDUJHmGWHLjTxoaJl' }
});
const res = mock.createResponse();
const ctx = new Context(req, res);

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
    ctx.error(500, 'Wtf');
    assert.equal(ctx.res.statusCode, 500);
    assert.equal(ctx.res.statusMessage, 'Internal Server Error');
    done()
  })
});

