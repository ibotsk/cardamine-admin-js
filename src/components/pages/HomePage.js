import React from 'react';
import { Switch } from 'react-router-dom';

import CNavbar from '../segments/Navbar';
import Footer from '../segments/Footer';

import Cdata from './Cdata';
import Record from './CRecord';
import Publications from './Publications';
import Persons from './Persons';
import Checklist from './Checklist';
import PrivateRoute from '../wrappers/PrivateRoute';

const Routing = () => (
    <Switch>
        <PrivateRoute exact path="/chromosome-data" component={Cdata} />
        <PrivateRoute exact path="/chromosome-data/new" component={Record} />
        <PrivateRoute path="/chromosome-data/edit/:recordId" component={Record} />
        <PrivateRoute exact path="/publications" component={Publications} />
        <PrivateRoute exact path="/persons" component={Persons} />
        <PrivateRoute path='/names/:id?' component={Checklist} />
    </Switch>
);

const HomePage = () => (
    <React.Fragment>
        <CNavbar />
        <Routing />
        <Footer />
    </React.Fragment>
);

export default HomePage;