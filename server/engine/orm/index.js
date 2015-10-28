'use strict';

module.exports = function(db_config){
  const DB = require('knex')(db_config);
  require('./lib/model')(DB);
  return DB
};
