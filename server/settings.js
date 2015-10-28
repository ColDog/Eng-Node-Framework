module.exports = function(App){
  App.DB({
    client: 'sqlite3',
    connection: {
      filename: './test.sqlite'
    }
  })


};
