'use strict';

const App = require('./engine');
require('./settings')(App);

App.middleware = [ App.router.match ];

require('./migrations')(App.DB);
require('./routes')(App.router);

App.listen(3000);


module.exports = App;
