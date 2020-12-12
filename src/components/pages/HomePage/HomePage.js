import React from 'react';
import { Switch } from 'react-router-dom';

import CNavbar from './components/Navbar';
import Footer from './components/Footer';

import Cdata from '../Cdata/Cdata';
import Record from '../CRecord/CRecord';
import Publications from '../Publications/Publications';
import Persons from '../Persons/Persons';
import Checklist from '../Checklist/Checklist';
import PrivateRoute from '../../wrappers/PrivateRoute';
import Logout from '../../segments/Logout';
import Import from '../Cdata/Import';
import Coordinates from '../Coordinates/Coordinates';

const Routing = () => (
  <Switch>
    <PrivateRoute exact path="/chromosome-data" component={Cdata} />
    <PrivateRoute exact path="/chromosome-data/new" component={Record} />
    <PrivateRoute path="/chromosome-data/edit/:recordId" component={Record} />
    <PrivateRoute exact path="/chromosome-data/import" component={Import} />
    <PrivateRoute exact path="/publications" component={Publications} />
    <PrivateRoute exact path="/persons" component={Persons} />
    <PrivateRoute exact path="/coordinates" component={Coordinates} />
    <PrivateRoute path="/names/:id?" component={Checklist} />
    <PrivateRoute exact path="/logout" component={Logout} />
  </Switch>
);

const HomePage = () => (
  <>
    <CNavbar />
    <Routing />
    <Footer />
  </>
);

export default HomePage;
