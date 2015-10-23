import React from 'react';
import Router from 'react-router';
import routes from './Routes';
import user from './user'


Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
