import React, { Component } from 'react';
import {
    Redirect
} from 'react-router-dom';

import {
    Grid, Col,
    Button,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import fakeAuth from '../../services/fake-auth';

class Login extends Component {

    constructor(props) {
        super(props);

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

    login = async () => {
        fakeAuth.authenticate(() => {
            this.setState({
                redirectToReferrer: true
            })
        });
    }

    handleSubmit = async e => {
        e.preventDefault();
        await this.login();
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

export default Login;