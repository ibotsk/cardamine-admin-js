import React, { Component } from 'react';

import {
    Button, Modal,
    Form, FormGroup, FormControl
} from 'react-bootstrap';

import axios from 'axios';
import template from 'url-template';

import config from '../../config/config';
import utils from '../../utils/utils';

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

    onEnter = () => {
        if (this.props.id) {
            const getByIdUri = template.parse(config.uris.personsUri.getByIdUri).expand({ id: this.props.id });
            axios.get(getByIdUri).then(response => {
                let data = utils.nullToEmpty(response.data);
                this.setState({ ...data });
            });
        }
    }

    getValidationState = () => {
        if (this.state.persName.length > 0) {
            return VALIDATION_STATE_SUCCESS;
        }
        return VALIDATION_STATE_ERROR;
    }

    handleChange = (e) => {
        this.setState({ persName: e.target.value });
    }

    handleHide = () => {
        this.setState({
            ...initialValues
        });
        this.props.onHide();
    }

    handleSave = () => {
        if (this.getValidationState() === VALIDATION_STATE_SUCCESS) {
            const personsUri = template.parse(config.uris.personsUri.baseUri).expand();
            axios.put(personsUri, {
                ...this.state
            }).then(() => this.handleHide());
        } else {
            alert('Person name must not be empty!');
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

export default PersonModal;