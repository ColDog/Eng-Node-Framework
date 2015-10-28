const log = function(){
  console.log( '[' + new Date().toISOString() + ']=> ' + Array.prototype.slice.call(arguments).join(' ') )
};

module.exports = log;
