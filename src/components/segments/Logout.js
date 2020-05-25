import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import PropTypes from 'prop-types';

import {
  unsetAuthenticated as unsetAuthenticatedAction,
} from '../../actions/index';
import userService from '../../services/user-service';
import { removeState } from '../../services/local-storage';

class Logout extends React.Component {
  async componentWillMount() {
    const { accessToken, unsetAuthenticated } = this.props;
    await userService.logout(accessToken);
    unsetAuthenticated();
    removeState();
  }

  render() {
    return <Redirect to="/" />;
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps, {
  unsetAuthenticated: unsetAuthenticatedAction,
})(Logout);

Logout.propTypes = {
  unsetAuthenticated: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
};
