module.exports = function(App) {
  App.controllers.Basic = {
    index: function(req, res, next){
      throw 'meaningless error';
      next()
    }
  };
  App.router.add({'/': App.controllers.Basic.index})
  App.router.add({'/account/:accountId/person/:personId': App.controllers.Basic.index})
};
