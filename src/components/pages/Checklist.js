import React, { Component } from 'react';

import {
    Grid, Col, Row,
    Button, Glyphicon, Panel, Well,
    Form, FormGroup, ControlLabel
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';


import TabledPage from '../wrappers/TabledPageParent';
import LosName from '../segments/LosName';
import SpeciesNameModal from '../segments/SpeciesNameModal';

import axios from 'axios';
import template from 'url-template';

import helper from '../../utils/helper';
import config from '../../config/config';

import '../../styles/custom.css';

const MODAL_SPECIES_NAME = 'showModalSpecies';

const columns = [
    {
        dataField: 'id',
        text: 'ID'
    },
    {
        dataField: 'type',
        text: 'Type'
    },
    {
        dataField: 'speciesName',
        text: 'Name',
        filter: textFilter()
    },
    {
        dataField: 'extra',
        text: '',
        headerStyle: { width: '10px' }
    }
];

const getLosById = async (id) => {
    const getByIdUri = template.parse(config.uris.listOfSpeciesUri.getByIdWFilterUri).expand({ id });
    const response = await axios.get(getByIdUri);
    return response.data;
}

const getAllLos = async () => {
    const getAllUri = template.parse(config.uris.listOfSpeciesUri.getAllWOrderUri).expand();
    const response = await axios.get(getAllUri);
    return response.data;
}

class Checklist extends Component {

    constructor(props) {
        super(props);

        this.state = {
            [MODAL_SPECIES_NAME]: false,
            modalEditId: 0, //id for modal
            listOfSpecies: [], //options for autocomplete fields
            species: { // properties for synonyms
                id: undefined,
                accepted: {}
            }
        }
    }

    showModal = (id) => {
        this.setState({
            [MODAL_SPECIES_NAME]: true,
            modalEditId: id
        });
    }

    hideModal = () => {
        this.props.onTableChange(undefined, {});
        this.setState({ [MODAL_SPECIES_NAME]: false });
    }

    selectRow = () => ({
        mode: 'radio',
        clickToSelect: true,
        hideSelectColumn: true,
        bgColor: '#00BFFF',
        onSelect: (row, isSelect, rowIndex, e) => {
            this.populateDetailsForEdit(row.id);
        },
    });

    populateDetailsForEdit = async (id) => {
        const los = await getLosById(id);
        const speciesListRaw = await getAllLos();
        const listOfSpecies = speciesListRaw.map(l => ({
            id: l.id,
            label: helper.listOfSpeciesString(l)
        }));

        this.setState({
            species: {
                ...los
            },
            listOfSpecies
        });
    }

    formatResult = (data) => {
        return data.map(n => ({
            id: n.id,
            type: n.ntype,
            speciesName: <LosName data={n} />,
            extra: <Glyphicon glyph='chevron-right' style={{ color: '#cecece' }}></Glyphicon>
        }));
    }

    renderDetailHeader = () => {
        if (!this.state.species.id) {
            return (
                <Panel>
                    <Panel.Body>Click row to edit details</Panel.Body>
                </Panel>
            )
        }
        return (
            <Panel onClick={() => this.showModal(this.state.species.id)} >
                <Panel.Heading>
                    <h5><small>Click to edit</small></h5>
                </Panel.Heading>
                <Panel.Body>
                    <h4><LosName data={this.state.species} /></h4>
                    <h5>{this.state.species.publication}</h5>
                </Panel.Body>
            </Panel>
        )
    }

    renderEditDetails = () => {
        if (this.state.species.id) {
            return (
                <Form>
                    <FormGroup controlId="ntype" bsSize='sm'>
                        <ControlLabel>
                            Accepted name
                        </ControlLabel>
                        <Typeahead
                            options={this.state.listOfSpecies}
                            selected={this.state.species.idAcceptedName}
                            onChange={(selected) => console.log(selected)}
                            placeholder="Start by typing a species present in the database" />
                    </FormGroup>
                </Form>
            );
        }
        return undefined;
    }

    render() {
        console.log(this.state);
        return (
            <div id='names'>
                <Grid>
                    <div id="functions">
                        <Button bsStyle="success" onClick={() => this.showModal('')}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                    </div>
                    <h2>Names</h2>
                </Grid>
                <Grid fluid={true} >
                    <Row>
                        <Col sm={6}>
                            <div className="scrollable">
                                <BootstrapTable hover striped condensed
                                    remote={{ filter: true }}
                                    keyField='id'
                                    data={this.formatResult(this.props.data)}
                                    columns={columns}
                                    filter={filterFactory()}
                                    selectRow={this.selectRow()}
                                    onTableChange={this.props.onTableChange}
                                />
                            </div>
                        </Col>
                        <Col sm={6}>
                            {this.renderDetailHeader()}
                            <Well>
                                {this.renderEditDetails()}
                            </Well>
                        </Col>
                    </Row>
                </Grid>
                <SpeciesNameModal id={this.state.modalEditId} show={this.state[MODAL_SPECIES_NAME]} onHide={this.hideModal} />
            </div>
        );
    }

}

export default TabledPage({
    getAll: config.uris.listOfSpeciesUri.getAllWOrderUri,
    getCount: config.uris.listOfSpeciesUri.countUri
})(Checklist);