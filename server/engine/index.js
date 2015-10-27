const App = {};
App.Controllers = {};
App.Models = {};

require('./lib/router')(App);
require('./lib/server')(App);
//require('./lib/socket')(App);

module.exports = App;
