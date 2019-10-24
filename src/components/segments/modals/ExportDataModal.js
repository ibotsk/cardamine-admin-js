import React from 'react';
import {
    Modal, Button, Checkbox,
    Tabs, Tab,
    FormGroup, FormControl, ControlLabel,
    Row, Col
} from 'react-bootstrap';
import { CSVDownload } from "react-csv";

import exportconfig from '../../../config/export';
import exportFacade from '../../../facades/export';
import exportUtils from '../../../utils/export';

const CHECK_ALL = "All";
const EXPORT_CHROMDATA = 'chromdata';

const makeColumns = (which) => {
    const cols = exportconfig[which];
    return Object.keys(cols).reduce((acc, cur, i) => {
        acc[cur] = cols[cur].default === true;
        return acc;
    }, {});
}

const initialState = {
    exportFormat: ["CSV"],
    filename: "chromdata_export.csv",
    separator: exportconfig.options.separator,
    enclosingCharacter: exportconfig.options.enclosingCharacter,
    chromdata: makeColumns(EXPORT_CHROMDATA), // checkboxes
    checkedAll: false,
    exportData: [],
    exportHeaders: []
}

class ExportDataModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ...initialState
        };
    }

    handleHide = () => {
        this.setState({ ...initialState });
        this.props.onHide();
    }

    handleExport = async () => {
        const which = this.props.type;
        const dataToExport = await exportFacade.getForExport(this.props.ids, this.props.accessToken);
        const fields = this.state[which];
        const checkedFields = Object.keys(fields).filter(f => fields[f] === true);
        const exportconfigWhich = exportconfig[which];

        const { data: exportData, headers: exportHeaders } = exportUtils.createCsvData(dataToExport, checkedFields, exportconfigWhich);

        this.setState({
            exportData: exportData,
            exportHeaders: exportHeaders
        });
    }

    onChangeTextInput = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onChangeCheckbox = (e, which) => {
        const targetName = e.target.name;
        const targetChecked = e.target.checked;

        const checkboxesToChooseFrom = { ...this.state[which] };
        let checkedAll = this.state.checkedAll;
        if (targetName === CHECK_ALL) {
            if (targetChecked) {
                Object.keys(checkboxesToChooseFrom).forEach(k => checkboxesToChooseFrom[k] = true);
            } else {
                Object.keys(checkboxesToChooseFrom).forEach(k => checkboxesToChooseFrom[k] = false);
            }
            checkedAll = targetChecked;
        } else {
            checkboxesToChooseFrom[targetName] = targetChecked;
        }

        this.setState({
            [which]: checkboxesToChooseFrom,
            checkedAll
        });
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
            <Modal id="export-data-modal" show={this.props.show} onHide={this.handleHide} onEnter={this.handleEnter}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Export data - {this.props.count || 0} records to export
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey={1} id="export-tabs" className="">
                        <Tab eventKey={1} title="File">
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Export format</ControlLabel>
                                <FormControl componentClass="select">
                                    {this.state.exportFormat.map((v, i) => (<option key={i} value={v}>{v}</option>))}
                                </FormControl>
                            </FormGroup>
                            <FormGroup controlId="filename" bsSize="sm">
                                <ControlLabel>File name</ControlLabel>
                                <FormControl type="text" value={this.state.filename} onChange={this.onChangeTextInput} placeholder="Filename" />
                            </FormGroup>
                            <FormGroup controlId="separator " bsSize="sm">
                                <ControlLabel>Separator</ControlLabel>
                                <FormControl type="text" value={this.state.separator} onChange={this.onChangeTextInput} placeholder="Separator" />
                            </FormGroup>
                            <FormGroup controlId="enclosingCharacter" bsSize="sm">
                                <ControlLabel>Enclosing Character</ControlLabel>
                                <FormControl type="text" value={this.state.enclosingCharacter} onChange={this.onChangeTextInput} placeholder="Enclosing character" />
                            </FormGroup>
                        </Tab>
                        <Tab eventKey={2} title="Columns">
                            <Row>
                                <Col md={6}>
                                    <Checkbox
                                        name={CHECK_ALL}
                                        checked={this.state.checkedAll}
                                        value={CHECK_ALL}
                                        onChange={e => this.onChangeCheckbox(e, 'chromdata')}
                                    >
                                        All
                                    </Checkbox>

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
                    {
                        this.state.exportData.length > 0 &&
                        <CSVDownload
                            headers={this.state.exportHeaders}
                            data={this.state.exportData}
                            filename={this.state.filename}
                            separator={this.state.separator}
                            enclosingCharacter={this.state.enclosingCharacter}
                            target="_self"
                        />
                    }
                    <Button bsStyle="primary" onClick={this.handleExport}>Export</Button>
                </Modal.Footer>
            </Modal >
        );
    }

}

export default ExportDataModal;