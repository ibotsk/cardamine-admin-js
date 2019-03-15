import React from 'react';
import { connect } from 'react-redux';

import { Link, Switch } from 'react-router-dom';

import CNavbar from '../segments/Navbar';
import Footer from '../segments/Footer';

import Cdata from './Cdata';
import Record from './CRecord';
import Publications from './Publications';
import Persons from './Persons';
import Checklist from './Checklist';
import PrivateRoute from '../wrappers/PrivateRoute';

const Routing = ({ auth }) => (
    <Switch>
        <PrivateRoute exact path="/chromosome-data" component={Cdata} isAuthenticated={auth} />
        <PrivateRoute exact path="/chromosome-data/new" component={Record} isAuthenticated={auth} />
        <PrivateRoute path="/chromosome-data/edit/:recordId" component={Record} isAuthenticated={auth} />
        <PrivateRoute exact path="/publications" component={Publications} isAuthenticated={auth} />
        <PrivateRoute exact path="/persons" component={Persons} isAuthenticated={auth} />
        <PrivateRoute path='/names/:id?' component={Checklist} isAuthenticated={auth} />
    </Switch>
);

const HomePage = ({ isAuthenticated }) => (
    <React.Fragment>
        <CNavbar />
        <Routing auth={isAuthenticated} />
        <Footer />
    </React.Fragment>
);

const mapStateToProps = state => ({
    isAuthenticated: !!state.authentication.isAuthenticated
});

export default connect(mapStateToProps)(HomePage);