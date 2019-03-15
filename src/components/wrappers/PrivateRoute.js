import React from 'react';
import { connect } from 'react-redux';
import {
    Route,
    Redirect
} from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated === true ? (
            <Component {...props} />
        ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}
                />
            )
    )} />
);

const mapStateToProps = state => ({
    isAuthenticated: !!state.authentication.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);