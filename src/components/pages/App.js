import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import CNavbar from '../segments/Navbar';
import Footer from '../segments/Footer';

import Cdata from './Cdata';
import Record from './CRecord';
import Publications from './Publications';

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/chromosome-data" component={Cdata} />
      <Route path="/chromosome-data/new" component={Record} />
      <Route path="/chromosome-data/edit/:recordId" component={Record} />
      <Route exact path="/publications" component={Publications} />
    </Switch>
  );
}

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CNavbar />
        <Routing />
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
