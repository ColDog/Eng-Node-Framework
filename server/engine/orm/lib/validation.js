'use strict';

class Validator {
  constructor(attrs, errors){
    this.errors = errors;
    this.attrs = attrs;
  }

  present(field) {
    if (!this.attrs[field]) {
      this.errors.push(field + 'is empty.')
    }
  }

  length(field, length) {
    if (!this.attrs[field].length === length) {
      this.errors.push(field + ' is only ' + this.attrs[field].length + ' long, it should be '+ length + ' long.')
    }
  }

}

module.exports = Validator;
