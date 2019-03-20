import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Redirect
} from 'react-router-dom';

import {
    Grid, Col,
    Button,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import userService from '../../services/user-service';
import { setAuthenticated, unsetAuthenticated } from '../../actions';

class Login extends Component {

    constructor(props) {
        super(props);

        this.props.unsetAuthenticated();
        this.state = {
            username: "",
            password: "",
            redirectToReferrer: false
        }
    }

    validateForm = () => {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async e => {
        e.preventDefault();
        const { username, password } = this.state;

        // stop here if form is invalid
        if (!(username && password)) {
            return;
        }
        // call login endpoint
        const responseData = await userService.login(username, password);
        if (!responseData.id) {
            return;
        }
        this.props.setAuthenticated(responseData.id);
        this.setState({ redirectToReferrer: true });
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer === true) {
            return <Redirect to={from} />;
        }

        return (
            <div id="login-page">
                <Grid>
                    <Col xs={12} md={4} mdOffset={4} >
                        <h2>Login</h2>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup controlId="username" bsSize="large">
                                <ControlLabel>Username</ControlLabel>
                                <FormControl
                                    autoFocus
                                    type="text"
                                    value={this.state.username}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="password" bsSize="large">
                                <ControlLabel>Password</ControlLabel>
                                <FormControl
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <Button block bsSize="large" disabled={!this.validateForm()} type="submit" bsStyle="primary" >Login</Button>
                        </Form>
                    </Col>
                </Grid>
            </div>
        );
    }
}

export default connect(
    null,
    {
        setAuthenticated,
        unsetAuthenticated
    }
)(Login);
