import React from 'react';
import {
    Modal, Button, Checkbox,
    Tabs, Tab,
    FormGroup, FormControl, ControlLabel,
    Row, Col
} from 'react-bootstrap';

import exportconfig from '../../../config/export'

const EXPORT_CHROMDATA = 'chromdata';

const makeColumns = (which) => {
    const cols = exportconfig[which];
    return Object.keys(cols).reduce((acc, cur, i) => {
        acc[cur] = cols[cur].default === true;
        return acc;
    }, {});
}

class ExportDataModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filename: "chromdata_export.csv",
            chromdata: makeColumns(EXPORT_CHROMDATA) // checkboxes
        }
    }

    handleHide = () => {
        this.setState({});
        this.props.onHide();
    }

    handleExport = () => {

    }

    onChangeTextInput = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onChangeCheckbox = (e, which) => {
        const toChange = {...this.state[which]};
        toChange[e.target.name] = e.target.checked;
        this.setState({ [which]: toChange });
    }

    makeCheckboxes = (which, subwhich) => {
        const state = { ...this.state[which] };
        const configCols = exportconfig[which];
        const relevantCols = Object.keys(configCols).filter(c => configCols[c].group === subwhich);
        return relevantCols.map(c => (
            <Checkbox
                key={c}
                name={c}
                checked={state[c]}
                value={c}
                onChange={e => this.onChangeCheckbox(e, which)}
            >
                {configCols[c].name}
            </Checkbox>
        ));
    }

    render() {
        return (
            <Modal id="export-data-modal" show={this.props.show} onHide={this.handleHide} >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Export data - {this.props.count || 0} records to export
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey={1} id="export-tabs" className="">
                        <Tab eventKey={1} title="File">
                            <FormGroup controlId="filename" bsSize="sm">
                                <ControlLabel>File name</ControlLabel>
                                <FormControl type="text" value={this.state.filename} onChange={this.onChangeTextInput} placeholder="filename" />
                            </FormGroup>
                        </Tab>
                        <Tab eventKey={2} title="Columns">
                            <Row>
                                <Col md={6}>
                                    <h6>Identification:</h6>
                                    {this.makeCheckboxes('chromdata', 'identification')}

                                    <h6>Publication:</h6>
                                    {this.makeCheckboxes('chromdata', 'publication')}

                                    <h6>Chromosomes data:</h6>
                                    {this.makeCheckboxes('chromdata', 'cdata')}
                                </Col>
                                <Col md={6}>
                                    <h6>Material:</h6>
                                    {this.makeCheckboxes('chromdata', 'material')}
                                    <h6>DNA data:</h6>
                                    {this.makeCheckboxes('chromdata', 'dna')}
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleHide}>Close</Button>
                    <Button bsStyle="primary" onClick={this.handleExport}>Export</Button>
                </Modal.Footer>
            </Modal >
        );
    }

}

export default ExportDataModal;