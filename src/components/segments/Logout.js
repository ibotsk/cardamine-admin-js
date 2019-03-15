import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { unsetAuthenticated } from '../../actions/index';
import userService from '../../services/user-service';
import { removeState } from '../../services/local-storage';

class Logout extends React.Component {

    async componentWillMount() {
        const accessToken = this.props.accessToken;
        await userService.logout(accessToken);
        this.props.unsetAuthenticated();
        removeState();
    }

    render() {
        return <Redirect to="/" />;
    }

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(
    mapStateToProps,
    {
        unsetAuthenticated
    }
)(Logout);