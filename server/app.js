'use strict';

const App = require('engine');
App.db  = require('engine/orm')({
  client: 'sqlite3',
  connection: {
    filename: './test.sqlite'
  }
});

App.middleware = [
  App.router.match
];

require('./application')(App);
require('./db')(App);
require('./routes')(App);


App.listen(3000);
