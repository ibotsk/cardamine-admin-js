import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Button, Modal,
    Form, FormGroup, FormControl
} from 'react-bootstrap';

import personsFacade from '../../facades/persons';

const VALIDATION_STATE_SUCCESS = 'success';
const VALIDATION_STATE_ERROR = 'error';

const initialValues = {
    id: undefined,
    persName: ''
};

class PersonModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ...initialValues
        }
    }

    onEnter = async () => {
        if (this.props.id) {
            const accessToken = this.props.accessToken;
            const data = await personsFacade.getPersonsByIdCurated({ id: this.props.id, accessToken });
            this.setState({ ...data });
        }
    }

    getValidationState = () => {
        if (this.state.persName.length > 0) {
            return VALIDATION_STATE_SUCCESS;
        }
        return VALIDATION_STATE_ERROR;
    }

    handleChange = e => {
        this.setState({ persName: e.target.value });
    }

    handleHide = () => {
        this.setState({
            ...initialValues
        });
        this.props.onHide();
    }

    handleSave = async () => {
        if (this.getValidationState() === VALIDATION_STATE_SUCCESS) {
            const accessToken = this.props.accessToken;
            const data = { ...this.state };
            await personsFacade.savePerson({ data, accessToken });
            this.handleHide();
        } else {
            alert("Person's name must not be empty!");
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleHide} onEnter={this.onEnter}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.id ? 'Edit person(s)' : 'Create new person(s)'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup
                            controlId="person-name"
                            bsSize='sm'
                            validationState={this.getValidationState()}
                        >
                            <FormControl
                                type="text"
                                value={this.state.persName}
                                placeholder="Person name"
                                onChange={this.handleChange}
                            />
                            <FormControl.Feedback />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleHide}>Close</Button>
                    <Button bsStyle="primary" onClick={this.handleSave}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(PersonModal);