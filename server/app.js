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

console.log('app.db.Model', App.db);

require('./authorization')(App);

require('./migrations')(App.db);
require('./routes')(App);


App.listen(3000);
