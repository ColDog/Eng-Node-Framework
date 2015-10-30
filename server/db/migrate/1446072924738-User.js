'use strict';

module.exports = function(db){
  db.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return db.schema.createTable('users', function(t) {
        t.increments('id').primary();
        t.timestamps('updated_at');
        t.string('name');
        t.string('email');
      });
    }
  });
};
