import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Login from './Login';
import HomePage from './HomePage';
import PrivateRoute from '../wrappers/PrivateRoute';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute component={HomePage} isAuthenticated={this.props.isAuthenticated} />
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken,
    isAuthenticated: !!state.authentication.isAuthenticated
});

export default connect(mapStateToProps)(App);
