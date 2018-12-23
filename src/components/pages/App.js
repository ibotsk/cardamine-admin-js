import React, { Component } from 'react';
import CNavbar from '../segments/Navbar';

import Cdata from './Cdata';

import { Route, Switch } from 'react-router-dom';
import Record from './CRecord';

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/chromosome-data" component={Cdata} />
      <Route path="/chromosome-data/new" component={Record} />
      <Route path="/chromosome-data/edit/:recordId" component={Record} />
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
