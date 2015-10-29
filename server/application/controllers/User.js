
module.exports = function(App){
  App.controllers.User = {
    index: function(req, res, next){
      this.body = App.db.Models.User.all();
      next()
    },
    show: function(req, res, next) {
      this.body = App.db.Models.User.find(this.params.id);
      next()
    },
    create: function(req, res, next) {
      var rec = new App.db.Models.User(this.params);
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
      var rec = App.db.Models.User.find(this.params.id);
      if (rec.update(this.params)) {
        this.body = rec;
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    },
    destroy: function(req, res, next) {
      var rec = App.db.Models.User.find(this.params.id);
      if (rec.destroy()) {
        this.body = 'Destroyed successfully';
        next()
      } else {
        this.error(400, rec._errors);
        next()
      }
    }
  };

  App.router.resource('/users', App.controllers.User)
};
