'use strict';

const Fiber = require('fibers');

const DB = require('./index')({
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

class User extends DB.Model {
  constructor(attrs) {
    super(attrs)
  }
}

Fiber(function() {
  var user = User.create({name: 'Colin'});
  console.log('user', user);
}).run();
