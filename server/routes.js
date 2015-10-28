module.exports = function(App){
  App.router.add({
    '/': App.controllers.Home.index
  })
};
