'use strict';

module.exports = function(App) {

  class User extends App.db.Model {
    constructor(attrs) {
      super(attrs)
    }
  }

  return User
};
