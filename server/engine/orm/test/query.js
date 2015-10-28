'use strict';

const assert = require('assert');
const Fiber = require('fibers');
const DB = require('../index')({
  test: true,
  client: 'sqlite3',
  connection: {
    filename: './test.sqlite'
  }
});

DB.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    return DB.schema.createTable('users', function(t) {
      t.increments('id').primary();
      t.string('name', 100);
      t.string('email', 100);
      t.text('bio');
    });
  }
});

DB.schema.hasTable('books').then(function(exists) {
  if (!exists) {
    return DB.schema.createTable('books', function(t) {
      t.increments('id').primary();
      t.integer('user_id').references('id').inTable('users');
      t.text('info');
    });
  }
});

class Book extends DB.Model {
  constructor(attrs) {
    super(attrs)
  }

  user(){
    return this.belongsTo(User)
  }
}


class User extends DB.Model {
  constructor(attrs) {
    super(attrs)
  }

  books(){
    return this.hasMany(Book)
  }
}

var user = new User({
  name: 'Colin',
  email: 'colin@emailz.com',
  bio: 'I Love Fish'
});


describe('Initialization', function() {
  it('can get the email', function(done){
    assert.equal(user.email, 'colin@emailz.com');
    done()
  });
  it('can get the name', function(done){
    assert.equal(user.name, 'Colin');
    done()
  });
});


describe('DB', function() {
  it('should exist', function (done) {
    assert.notEqual(DB, undefined);
    done()
  });

  it('should have a model class', function (done) {
    assert.notEqual(DB.Model, undefined);
    done()
  });
});

describe('actions', function(){
  it('can create, update, delete', function(done) {
    Fiber(function() {
      var user = User.create({name: 'Colin'});
      assert.equal(user.name, 'Colin');
      assert.notEqual(user.id, undefined);

      user.update({name: 'Jimmy'});
      assert.equal(user.name, 'Jimmy');

      var id = user.id;
      assert.equal(User.find(id).id, id)
      user.destroy();
      assert.equal(User.find(id), null);

      done()
    }).run();

  });


  it('can have relationships', function(done) {
    Fiber(function() {

      var user = User.create({name: 'Person'});
      var id = user.id;
      Book.create({user_id: id, info: 'a book'});
      assert.equal(user.books()[0].info, 'a book');
      var hasOne = user.books()[0].user();
      assert.equal(hasOne.name, user.name);

      done()
    }).run();

  });

});

