const fileTools = require('engine/file-tools');
const path = require('path');

module.exports = function(App){
  fileTools.requireAllWith(path.resolve(__dirname, 'controllers'), [App]);
  fileTools.requireAllWith(path.resolve(__dirname, 'models'), [App]);
};
