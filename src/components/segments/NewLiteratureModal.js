import React, { Component } from 'react';

import {
    Button, Modal,
    Form, FormGroup, FormControl
} from 'react-bootstrap';

import axios from 'axios';
import template from 'url-template';

import config from '../../config/config';

class NewLiteratureModal extends Component {

    displayTypes = config.mappings.displayType;

    constructor(props) {
        super(props);

        this.state = {
            displayType: '1',
            paperAuthor: '',
            paperTitle: '',
            seriesSource: '',
            volume: '',
            issue: '',
            publisher: '',
            editor: '',
            year: '',
            pages: '',
            journalName: '',
            inputDate: '',
            note: ''
        };
    }

    componentDidMount() {
        if (this.props.id) {
            const getByIdUri = template.parse(config.uris.literaturesUri.getByIdUri).expand({ id: this.props.id });
            axios.get(getByIdUri).then(response => {
                const data = response.data;
                this.setState({ ...data });
            });
        }
    }

    // at least one field must be non-empty - prevent accidental saving of all-empty
    getValidationState = () => {
        const { displayType, ...state } = this.state;
        for (const key in state) { // without displayType
            if (state[key].length > 0) {
                return true; //'success'
            }
        }
        return false; // 'error'
    }

    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    handleHide = () => {
        this.setState({
            displayType: '1',
            paperAuthor: '',
            paperTitle: '',
            seriesSource: '',
            volume: '',
            issue: '',
            publisher: '',
            editor: '',
            year: '',
            pages: '',
            journalName: '',
            inputDate: '',
            note: ''
        });
        this.props.onHide();
    }

    handleSave = () => {
        if (this.getValidationState()) {
            const literaturesUri = template.parse(config.uris.literaturesUri.baseUri).expand();
            axios.put(literaturesUri, {
                ...this.state
            }).then(() => this.handleHide());
        } else {
            alert('At least one field must not be empty!');
        }
    }

    render() {
        const displayType = this.state.displayType;
        return (
            <Modal show={this.props.show} onHide={this.handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new publication</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup controlId="displayType" bsSize='sm'>
                            <FormControl
                                componentClass="select"
                                placeholder="select"
                                onChange={this.handleChange} >
                                {
                                    Object.keys(this.displayTypes).map(k => <option value={k} key={k}>{this.displayTypes[k]}</option>)
                                }
                            </FormControl>
                        </FormGroup>
                        <FormGroup controlId="paperAuthor" bsSize='sm'>
                            <FormControl
                                type="text"
                                value={this.state.paperAuthor}
                                placeholder="Paper author"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="year" bsSize='sm'>
                            <FormControl
                                type="text"
                                value={this.state.year}
                                placeholder="Year"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        {
                            (displayType === '3' || displayType === '4' || displayType === '5') &&
                            <FormGroup controlId="seriesSource" bsSize='sm'>
                                <FormControl
                                    type="text"
                                    value={this.state.seriesSource}
                                    placeholder="Series source"
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        }
                        {
                            (displayType === '2' || displayType === '3' || displayType === '4') &&
                            <FormGroup controlId="publisher" bsSize='sm'>
                                <FormControl
                                    type="text"
                                    value={this.state.publisher}
                                    placeholder="Publisher"
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        }
                        {
                            (displayType === '1' || displayType === '5') &&
                            <FormGroup controlId="volume" bsSize='sm'>
                                <FormControl
                                    type="text"
                                    value={this.state.volume}
                                    placeholder="Volume"
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        }
                        {
                            (displayType === '1' || displayType === '5') &&
                            <FormGroup controlId="issue" bsSize='sm'>
                                <FormControl
                                    type="text"
                                    value={this.state.issue}
                                    placeholder="Issue"
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        }
                        {
                            (displayType === '3' || displayType === '4' || displayType === '5') &&
                            <FormGroup controlId="editor" bsSize='sm'>
                                <FormControl
                                    type="text"
                                    value={this.state.editor}
                                    placeholder="Editors"
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        }
                        <FormGroup controlId="pages" bsSize='sm'>
                            <FormControl
                                type="text"
                                value={this.state.pages}
                                placeholder="Pages"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="journalName" bsSize='sm'>
                            <FormControl
                                type="text"
                                value={this.state.journalName}
                                placeholder="Journal"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="note" bsSize='sm'>
                            <FormControl
                                componentClass="textarea"
                                value={this.state.note}
                                placeholder="Note"
                                onChange={this.handleChange}
                            />
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

export default NewLiteratureModal;