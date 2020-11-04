import React from 'react';
import { Route, BrowserRouter, Switch, } from 'react-router-dom';

import Home from './components/Home';
import Battle from './components/Battle';

const MainRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route component={Home} exact path="/"/>
      <Route component={Battle} path="/battle/:battleId/:playerId"/>
    </Switch>
  </BrowserRouter>
);

export default MainRoutes;