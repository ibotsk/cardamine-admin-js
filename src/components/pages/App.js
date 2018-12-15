import React, { Component } from 'react';
import CNavbar from '../segments/Navbar';

import Cdata from './Cdata';

import { Route, Switch } from 'react-router-dom';

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/chromosome-data" component={Cdata} />
    </Switch>
  );
}

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CNavbar />
        <Routing />
      </React.Fragment>
    );
  }
}

export default App;
