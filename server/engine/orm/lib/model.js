'use strict';

const pluralize = require('pluralize');
const Validator = require('./validation');
const Fiber = require('fibers');
module.exports = function(DB) {

  class Model {
    constructor(attrs){
      this._attrs = {};
      this._addAttrs(attrs);
      this._errors = [];
    }

    _before(){
    }

    _after(){
    }

    _validates(v){
    }

    _addAttrs(attrs) {
      var self = this;
      for (var attr in attrs) {
        if (attrs.hasOwnProperty(attr)){

          (function(attr){
            self._attrs[attr] = attrs[attr];

            Object.defineProperty(self, attr, {
              set: function(val)  { return self._attrs[attr] = val },
              get: function()     { return self._attrs[attr] },
              configurable: true
            })

          })(attr)

        }
      }
    }

    set id(val){
      this._attrs.id = val
    }

    get id() {
      return this._attrs.id
    }

    _toJson() {
      return JSON.stringify(this._attrs)
    }

    save() {
      var self = this;

      this._validates(
        new Validator(this._attrs, this._errors)
      );
      this._before();

      // if (this._errors.exists) { return false }

      var fiber = Fiber.current;

      DB(this.table).where('id', self.id).update(self._attrs)
        .catch(function(err)  { self._errors = err ; fiber.run( false ) })
        .then (function()     { self._after() ; fiber.run( self ) });

      return Fiber.yield();
    }

    destroy() {
      var self = this;
      var fiber = Fiber.current;
      DB(self.table).where('id', self.id).del()
        .catch(function(err)  { self._errors = err ; fiber.run( false ) })
        .then (function(data) { fiber.run( data ) });

      return Fiber.yield();
    }

    update(attrs) {
      this._addAttrs(attrs);
      return this.save();
    }

    hasMany(Model) {
      var key = this.key;
      var id = this.id;
      var fiber = Fiber.current;

      DB(Model.table).where(key, id)
        .catch(function(err)  { fiber.run(function(){ throw err }) })
        .then (function(dat) {
          dat.forEach(function(attrs, idx){
            dat[idx] = new Model(attrs)
          });
          fiber.run( dat );
        });

      return Fiber.yield();
    }

    belongsTo(Model) {
      var fiber = Fiber.current;
      var id = this._attrs[Model.key];
      DB(Model.table).where('id', id)
        .catch(function(err)  {
          fiber.run(function(){ throw err })
        })
        .then (function(dat) {
          if (dat[0]){
            dat = new Model( dat[0] )
          } else {
            dat = null
          }
          fiber.run( dat )
        });

      return Fiber.yield();
    }

    hasOne(Model) {
      var fiber = Fiber.current;
      var id = this.id;
      var key = this.key;

      DB(Model.table).where(key, id)
        .catch(function(err)  {
          fiber.run(function(){ throw err })
        })
        .then (function(dat) {
        if (dat[0]){
          dat = new Model( dat[0] )
        } else {
          dat = null
        }
        fiber.run( dat )
      });

      return Fiber.yield();
    }

    static create(attrs) {
      var rec = new this(attrs);
      var self = this

      rec._validates(
        new Validator(rec._attrs, rec._errors)
      );
      rec._before();

      //if (rec._errors === []) { return false }

      var fiber = Fiber.current;
      DB(self.table).insert(rec._attrs)
        .catch(function(err)  { rec._errors = err ; fiber.run( false ) })
        .then (function(dat)  { rec._after() ; rec.id = dat[0] ;  fiber.run( rec ) });

      return Fiber.yield();
    }

    static all() {
      var self = this;
      var fiber = Fiber.current();
      DB.select().from(self.table)
        .catch(function(err) { fiber.run( function() { throw err } ) })
        .then (function(dat) {
          dat.forEach(function(attrs, idx){
            dat[idx] = new self(attrs)
          });
          fiber.run( dat );
        });

      return fiber.yield();
    }

    static find(id) {
      var self = this;
      var fiber = Fiber.current;
      DB(self.table).where('id', id)
        .catch(function(err)  { fiber.run(function(){ throw err }) })
        .then (function(dat)  {
          if (dat[0]){
            dat = new self( dat[0] )
          } else {
            dat = null
          }
          fiber.run( dat )
        });
      return Fiber.yield();
    }

    static where(obj) {
      var self = this;
      var fiber = Fiber.current;
      DB(self.table).where(obj)
        .catch(function(err) { fiber.run( function() { throw err } ) })
        .then (function(dat) {
          dat.forEach(function(attrs, idx){
            dat[idx] = new self(attrs)
          });
          fiber.run( dat );
        });
      return Fiber.yield()
    }

    static query(block) {
      var self = this;
      var fiber = Fiber.current;

      block( self.table )
        .catch(function(err) { fiber.run( function() { throw err } ) })
        .then (function(dat) {
          dat.forEach(function(attrs, idx){
            dat[idx] = new self(attrs)
          });
          fiber.run( dat );
        });

      return Fiber.yield()
    }

    static get table() {
      return pluralize(this.name.toLowerCase())
    }

    get table() {
      return pluralize(this.constructor.name.toLowerCase())
    }

    static get key() {
      return pluralize(this.name.toLowerCase(), 1)+'_id'
    }

    get key() {
      return pluralize(this.constructor.name.toLowerCase(), 1)+'_id'
    }

  }

  return DB.Model = Model;
};

