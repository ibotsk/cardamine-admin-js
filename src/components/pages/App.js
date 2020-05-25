import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './Login';
import HomePage from './HomePage';
import PrivateRoute from '../wrappers/PrivateRoute';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <PrivateRoute component={HomePage} />
    </Switch>
  </BrowserRouter>
);

export default App;
