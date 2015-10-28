'use strict';

const statuses  = require('statuses');
const cookie    = require('cookie');
const url       = require('url');
const log       = require('./log');

class Context {
  constructor(req, res, routes) {
    this.routes = routes;
    this.parsedUrl = url.parse(req.url, true);
    this.req = req;
    this.req.path = this.parsedUrl.pathname;
    this.res = res;
    this._body = '';
    this._cookies = null;
    this._intentionallySetStatus = false;
    this.params = {};
  }

  get href() {
    return this.parsedUrl.href
  }

  get search() {
    return this.parsedUrl.query
  }

  get path() {
    return this.parsedUrl.pathname
  }

  set cookie(ary) {
    this.set('Set-Cookie', cookie.serialize(ary[0], ary[1], ary[2]))
  }

  get cookies() {
    if (this._cookies) {
      return this._cookies
    } else {
      var cookies = this.req.headers.cookie;
      if (cookies) {
        this._cookies = cookie.parse(cookies);
        return this._cookies
      }
    }
  }

  set(name, value) {
    return this.res.setHeader(name, value)
  }

  get status() {
    return this.res.statusCode
  }

  set status(val) {
    if (typeof val != 'number') { throw 'Status must be a number' }
    this._intentionallySetStatus = true;
    this.res.statusCode = val;
    this.res.statusMessage = statuses[val]
  }

  get length() {
    this.res.getHeader('Content-Length')
  }

  set length(n) {
    this.set('Content-Length', n);
  }

  get body() {
    return this._body
  }

  error(code, msg) {
    if (!msg && typeof code == 'string') {
      msg = code;
      code = null;
    }

    var err = new Error();
    err.message = msg;
    err.response = msg;
    err.code = code;
    throw err
  }

  set body(val) {
    if (null == val) {
      this.status = 204;
      this.res.removeHeader('Content-Type');
      this.res.removeHeader('Content-Length');
      return;
    }

    if (typeof val == 'string') {
      var type = /<[a-z][\s\S]*>/i.test(val) ? 'text/html' : 'text/plain';
      this.set('Content-Type', type);

    } else if (typeof val == 'object') {
      val = JSON.stringify(val);
      this.set('Content-Type', 'application/json');

    } else {
      throw 'Body must be either a string or an object, got type = ' + typeof val
    }

    if (!this._intentionallySetStatus) { this.status = 200 }
    this._body = val;
    this.set('Content-Length', val.length);
  }

}

module.exports = Context;
