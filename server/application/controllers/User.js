'use strict';

module.exports = function(App){
  const User = require('../models/User')(App);

  App.controllers.User = {
    index: function(req, res, next){
      this.body = User.all();
      next()
    },
    show: function(req, res, next) {
      this.body = User.find( this.params.id );
      next()
    },
    create: function(req, res, next) {
      var rec = new User( safeParams(this.params) );
      if (rec.save()) {
        this.body = rec;
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    },
    update: function(req, res, next){
      var rec = User.find(this.params.id);
      if (rec.update( safeParams(this.params) )) {
        this.body = rec;
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    },
    destroy: function(req, res, next) {
      var rec = User.find(this.params.id);
      if (rec.destroy()) {
        this.body = 'Destroyed successfully';
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    }
  };

  function safeParams(params) {
    return App.db.helpers.safeParams(params, [
      'name', 'email', 'password'
    ])
  }

  App.router.resource('/users', App.controllers.User)
};
