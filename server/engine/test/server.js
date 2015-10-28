const request = require('supertest');
const App     = require('../index');
const assert  = require('assert');

before(function(){
  App.router.add({
    '/': function(req, res, next){
      this.body = 'hello world';
      next()
    },
    '/pars/:id': function(req, res, next) {
      console.log('being matched to pars', this._body);
      //this.body = '';
      next()
    }
  });
  App.middleware = [App.router.match];
  App.listen(3000)
});

describe('basic server', function(){

  it('should return hello world', function(done){
    request('http://localhost:3000')
      .get('/')
      .expect(200, 'hello world', done());
  });

  it('should return parameters', function(done){
    request('http://localhost:3000')
      .get('/pars/242')
      .expect(200, '', done());
  })

});
