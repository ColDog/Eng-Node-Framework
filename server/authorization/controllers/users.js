'use strict';

module.exports = function(App){
  App.controllers.Home = {
    index: function(req, res, next){
      App.db.Models.User.all();
      next()
    }
  }
}
