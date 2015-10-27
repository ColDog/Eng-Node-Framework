const request = require('supertest');
const App     = require('../index');
const assert  = require('assert');

before(function(){
  App.router.add({
    '/': function(req, res, next) {
      console.log(req);
      next()
    }
  });
  App.listen(3000)
});

describe('basic server', function(){

  it('should return hello world', function(done){
    request('http://localhost:3000')
      .get('/')
      .expect(200, 'hello world', done);
  })

});
