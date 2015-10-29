'use strict';

const fs = require('fs');
const pluralize = require('pluralize');
const path = require('path');

var name = process.argv[2];
var lowered = pluralize(name.toLowerCase());

var controller = `
module.exports = function(App){
  App.controllers.${name} = {
    index: function(req, res, next){
      this.body = App.db.Models.${name}.all();
      next()
    },
    show: function(req, res, next) {
      this.body = App.db.Models.${name}.find(this.params.id);
      next()
    },
    create: function(req, res, next) {
      var rec = new App.db.Models.${name}(this.params);
      if (rec.save()) {
        this.body = rec;
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
      next()
    },
    update: function(req, res, next){
      var rec = App.db.Models.${name}.find(this.params.id);
      if (rec.update(this.params)) {
        this.body = rec;
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    },
    destroy: function(req, res, next) {
      var rec = App.db.Models.${name}.find(this.params.id);
      if (rec.destroy()) {
        this.body = 'Destroyed successfully';
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    }
  };

  App.router.resource('/${lowered}', App.controllers.${name})
};
`;

fs.writeFile(path.resolve(__dirname, '../', 'application', 'controllers', `${name}.js`), controller);
