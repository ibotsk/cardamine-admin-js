import React, { Component } from 'react';

import {
    Grid, Col, Row,
    Button, Glyphicon, Panel, Well,
    Form, FormControl, FormGroup, ControlLabel
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';

import { NotificationContainer } from 'react-notifications';
import '../../utils/notifications';

import TabledPage from '../wrappers/TabledPageParent';
import LosName from '../segments/LosName';
import SpeciesNameModal from '../segments/SpeciesNameModal';

import axios from 'axios';
import template from 'url-template';

import helper from '../../utils/helper';
import config from '../../config/config';

import '../../styles/custom.css';
import notifications from '../../utils/notifications';

const MODAL_SPECIES_NAME = 'showModalSpecies';
const idAcceptedName = 'idAcceptedName';
const idBasionym = 'idBasionym';
const idReplaced = 'idReplaced';
const idNomenNovum = 'idNomenNovum';

const buildNtypesOptions = (types) => {
    const obj = {};
    Object.keys(ntypes).forEach(t => {
        obj[t] = t;
    });
    return obj;
}

const ntypeFormatter = (cell) => {
    return (
        <span style={{ color: config.mappings.losType[cell].colour }}>{cell}</span>
    );
}

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

const ntypes = config.mappings.losType;
const ntypesFilterOptions = buildNtypesOptions(ntypes);

const columns = [
    {
        dataField: 'id',
        text: 'ID',
        sort: true
    },
    {
        dataField: 'ntype',
        text: 'Type',
        formatter: ntypeFormatter,
        filter: multiSelectFilter({
            options: ntypesFilterOptions
        }),
        sort: true
    },
    {
        dataField: 'speciesName',
        text: 'Name',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'extra',
        text: '',
        headerStyle: { width: '10px' }
    }
];

class Checklist extends Component {

    constructor(props) {
        super(props);

        this.state = {
            [MODAL_SPECIES_NAME]: false,
            modalEditId: 0, //id for modal
            listOfSpecies: [], //options for autocomplete fields
            species: { // properties for synonyms
                id: undefined
            },
            tableRowsSelected: []
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
        if (this.state.species.id) {
            this.populateDetailsForEdit(this.state.species.id);
        }
        this.setState({ [MODAL_SPECIES_NAME]: false });
    }

    selectRow = () => ({
        mode: 'radio',
        clickToSelect: true,
        hideSelectColumn: true,
        bgColor: '#ffea77',
        onSelect: (row, isSelect, rowIndex, e) => {
            this.props.history.push(`/names/${row.id}`);
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
            listOfSpecies,
            tableRowsSelected: [id]
        });
    }

    formatResult = (data) => {
        return data.map(n => {
            return ({
                id: n.id,
                ntype: n.ntype,
                speciesName: helper.listOfSpeciesString(n),
                extra: <Glyphicon glyph='chevron-right' style={{ color: '#cecece' }}></Glyphicon>
            })
        });
    }

    getSelectedName = (id) => {
        return this.state.listOfSpecies.filter(l => l.id === id);
    }

    hangeChangeTypeahead = (selected, prop) => {
        const id = selected[0] ? selected[0].id : undefined;
        this.handleChange(prop, id);
    }

    hangeChangeInput = (e) => {
        this.handleChange(e.target.id, e.target.value);
    }

    handleChange = (prop, val) => {
        const species = { ...this.state.species };
        species[prop] = val;
        this.setState({
            species
        });
    }

    submitForm = (e) => {
        e.preventDefault();

        const losUri = template.parse(config.uris.listOfSpeciesUri.baseUri).expand();

        axios.put(losUri, this.state.species)
            .then(() => {
                notifications.success('Saved');
                this.props.onTableChange(undefined, {});
            })
            .catch(error => {
                notifications.error('Error saving');
                throw error;
            });
    }

    componentDidMount() {
        const selectedId = this.props.match.params.id;
        if (selectedId) {
            const selectedIdInt = parseInt(selectedId);
            this.populateDetailsForEdit(selectedIdInt);
            this.setState({
                tableRowsSelected: [selectedIdInt]
            });
        }
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
            <Panel>
                <Panel.Heading>
                    <Button bsStyle='warning' bsSize='xsmall' onClick={() => this.showModal(this.state.species.id)}>
                        <Glyphicon glyph='edit' /> Edit Name
                    </Button>
                </Panel.Heading>
                <Panel.Body>
                    <h4><LosName data={this.state.species} /></h4>
                    <h5>{this.state.species.publication}</h5>
                    <FormGroup controlId='ntype' bsSize='sm'>
                        <Row>
                            <Col xs={3}>
                                <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    value={this.state.species.ntype}
                                    onChange={this.hangeChangeInput} >
                                    {
                                        Object.keys(ntypes).map(t => <option value={t} key={t}>{ntypes[t].text}</option>)
                                    }
                                </FormControl>
                            </Col>
                        </Row>
                    </FormGroup>
                </Panel.Body>
            </Panel>
        )
    }

    renderEditDetails = () => {
        if (this.state.species.id) {
            return (
                <Well>
                    <FormGroup controlId={idAcceptedName} bsSize='sm'>
                        <ControlLabel>
                            Accepted name
                        </ControlLabel>
                        <Typeahead
                            options={this.state.listOfSpecies}
                            selected={this.getSelectedName(this.state.species[idAcceptedName])}
                            onChange={(selected) => this.hangeChangeTypeahead(selected, idAcceptedName)}
                            placeholder="Start by typing a species present in the database" />
                    </FormGroup>
                    <FormGroup controlId={idBasionym} bsSize='sm'>
                        <ControlLabel>
                            Basionym
                        </ControlLabel>
                        <Typeahead
                            options={this.state.listOfSpecies}
                            selected={this.getSelectedName(this.state.species[idBasionym])}
                            onChange={(selected) => this.hangeChangeTypeahead(selected, idBasionym)}
                            placeholder="Start by typing a species present in the database" />
                    </FormGroup>
                    <FormGroup controlId={idReplaced} bsSize='sm'>
                        <ControlLabel>
                            Replaced Name
                        </ControlLabel>
                        <Typeahead
                            options={this.state.listOfSpecies}
                            selected={this.getSelectedName(this.state.species[idReplaced])}
                            onChange={(selected) => this.hangeChangeTypeahead(selected, idReplaced)}
                            placeholder="Start by typing a species present in the database" />
                    </FormGroup>
                    <FormGroup controlId={idNomenNovum} bsSize='sm'>
                        <ControlLabel>
                            Nomen Novum
                        </ControlLabel>
                        <Typeahead
                            options={this.state.listOfSpecies}
                            selected={this.getSelectedName(this.state.species[idNomenNovum])}
                            onChange={(selected) => this.hangeChangeTypeahead(selected, idNomenNovum)}
                            placeholder="Start by typing a species present in the database" />
                    </FormGroup>
                    <Button bsStyle="primary" type='submit' >Save</Button>
                </Well>
            );
        }
        return undefined;
    }

    render() {
        const tableRowSelectedProps = { ...this.selectRow(), selected: this.state.tableRowsSelected};
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
                                    keyField='id'
                                    data={this.formatResult(this.props.data)}
                                    columns={columns}
                                    filter={filterFactory()}
                                    // selectRow={this.selectRow()}
                                    selectRow={tableRowSelectedProps}
                                    onTableChange={this.props.onTableChange}
                                />
                            </div>
                        </Col>
                        <Col sm={6}>
                            <Form onSubmit={this.submitForm}>
                                {this.renderDetailHeader()}
                                {this.renderEditDetails()}
                            </Form>
                        </Col>
                    </Row>
                </Grid>
                <SpeciesNameModal id={this.state.modalEditId} show={this.state[MODAL_SPECIES_NAME]} onHide={this.hideModal} />
                <NotificationContainer />
            </div>
        );
    }

}

export default TabledPage({
    getAll: config.uris.listOfSpeciesUri.getAllWOrderUri,
    getCount: config.uris.listOfSpeciesUri.countUri
})(Checklist);