import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from './Login';
import HomePage from './HomePage';
import PrivateRoute from '../wrappers/PrivateRoute';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute component={HomePage} />
                </Switch>
            </React.Fragment>
        );
    }
}

export default App;
