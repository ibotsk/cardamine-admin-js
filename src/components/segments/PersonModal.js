import React, { Component } from 'react';

import { 
    Button, Modal,
    Form, FormGroup, FormControl
} from 'react-bootstrap';

import axios from 'axios';
import template from 'url-template';

import config from '../../config/config';

class PersonModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            persName: ''
        }
    }

    getValidationState = () => {
        if (this.state.persName.length > 0) {
            return 'success';
        }
        return 'error';
    }

    handleChange = (e) => {
        this.setState({ persName: e.target.value });
    }

    handleHide = () => {
        this.setState({ persName: ''});
        this.props.onHide();
    }

    handleSave = () => {
        const personsUri = template.parse(config.uris.personsUri.baseUri).expand();
        axios.post(personsUri, {
            persName: this.state.persName
        }).then(() => this.handleHide());
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new person(s)</Modal.Title>
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
                    <Button onClick={ this.handleHide}>Close</Button>
                    <Button bsStyle="primary" onClick={this.handleSave}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        )
    }


}

export default PersonModal;