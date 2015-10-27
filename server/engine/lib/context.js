const statuses = require('statuses');
const cookie = require('cookie');
const url = require('url');
const unpipe = require('unpipe');

class Context {
  constructor(req, res) {
    this.parsedUrl = url.parse(req.url, true);
    this.req = req;
    this.res = res;
    this._body = '';
    this._cookies = null;
    this._intentionallySetStatus = false
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
    this.set('Content-Length', Buffer.byteLength(val));
  }

  error(code, message) {
    this.status = code;
    this.body = {error: true, message: message, statusMessage: statuses[code]};
  }

  finish() {
    this.res.end(this.body);
    unpipe(this.req);
  }

}

module.exports = Context;
