'use strict';
const log = require('./log');

class Context {
  constructor(req, routes) {
    this.routes = routes;
    this.action = req.action;
    this.path = req.path;
    this.id = req.id;
    this.params = req.params;
    this.res = {};
  }

  set body(val) {
    this.res = val;
  }

}
