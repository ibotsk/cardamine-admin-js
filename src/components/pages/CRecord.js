import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Col, Grid, Row,
    InputGroup,
    Button, Checkbox, ControlLabel, Form, FormControl, FormGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';

import { NotificationContainer } from 'react-notifications';

import notifications from '../../utils/notifications';

import cRecordFacade from '../../facades/crecord';

import LosName from '../segments/LosName';
import PersonModal from '../segments/PersonModal';
import PublicationModal from '../segments/PublicationModal';
import SpeciesNameModal from '../segments/SpeciesNameModal';

const revisionsColumns = [
    {
        dataField: 'id',
        text: 'Name',
        formatter: (cell, row, rowIndex, formatExtraData) => {
            return (
                <LosName data={row['list-of-species']} />
            );
        }
    },
    {
        dataField: 'hDate',
        text: 'Date'
    }
]

const CHROM_DATA_LIST_URI = '/chromosome-data';
const SELECTED = prop => `${prop}Selected`;

const MODAL_PERSONS = 'showModalPerson';
const MODAL_LITERATURE = 'showModalLiterature';
const MODAL_SPECIES = 'showModalSpecies';

class Record extends Component {

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            chromrecord: {}, //to save
            material: {}, //to save
            reference: {}, //to save
            histories: [], //to save - not persisted yet
            listOfSpecies: [],
            persons: [],
            world4s: [],
            literatures: [],
            modals: {
                [MODAL_PERSONS]: false,
                [MODAL_LITERATURE]: false,
                [MODAL_SPECIES]: false
            },
            idStandardisedNameSelected: undefined,
            idLiteratureSelected: undefined,
            countedBySelected: undefined,
            idWorld4Selected: undefined,
            collectedBySelected: undefined,
            identifiedBySelected: undefined,
            checkedBySelected: undefined
        };
    }

    getChromosomeRecord = async () => {
        const accessToken = this.props.accessToken;
        const recordId = this.props.match.params.recordId;

        const {
            chromrecord,
            material,
            reference,
            histories
        } = await cRecordFacade.getChromosomeRecord(accessToken, recordId);

        this.setState({
            chromrecord,
            material,
            reference,
            histories
        });
    }

    getLists = async () => {
        const accessToken = this.props.accessToken;

        const { listOfSpecies, idStandardisedNameSelected } = await cRecordFacade.getSpecies(accessToken, this.state.reference.idStandardisedName);

        const { persons, countedBySelected, collectedBySelected, identifiedBySelected, checkedBySelected } = await cRecordFacade.getPersons(accessToken, {
            countedBy: this.state.chromrecord.countedBy,
            collectedBy: this.state.material.collectedBy,
            identifiedBy: this.state.material.identifiedBy,
            checkedBy: this.state.material.checkedBy
        });

        const { world4s, idWorld4Selected } = await cRecordFacade.getWorld4s(accessToken, this.state.material.idWorld4);

        const { literatures, idLiteratureSelected } = await cRecordFacade.getLiteratures(accessToken, this.state.reference.idLiterature);

        this.setState({
            listOfSpecies,
            literatures,
            persons,
            world4s,
            idStandardisedNameSelected,
            idLiteratureSelected,
            countedBySelected,
            collectedBySelected,
            identifiedBySelected,
            checkedBySelected,
            idWorld4Selected
        });
    }

    showModal = prop => {
        const modals = this.state.modals;
        modals[prop] = true;
        this.setState({ modals });
    }

    hideModal = async () => {
        const modals = this.state.modals;
        for (const m in modals) {
            modals[m] = false;
        }
        await this.getLists();
        this.setState({ modals });
    }

    async componentDidMount() {
        try {
            await this.getChromosomeRecord();
            await this.getLists();
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    onChangeTextInput = (e, objName) => {
        // id is set from FormGroup controlId
        this.onChangeInput(objName, e.target.id, e.target.value);
    }

    onChangeCheckbox = (e, objName) => {
        this.onChangeInput(objName, e.target.name, e.target.checked);
    }

    onChangeInput = (objName, property, value) => {
        const obj = { ...this.state[objName] };
        obj[property] = value;
        this.setState({ [objName]: obj });
    }

    onChangeTypeaheadChromrecord = (selected, prop) => {
        this.onChangeTypeahead(selected, 'chromrecord', prop);
    }

    onChangeTypeaheadMaterial = (selected, prop) => {
        this.onChangeTypeahead(selected, 'material', prop);
    }

    onChangeTypeahead = (selected, objName, prop) => {
        const obj = { ...this.state[objName] }

        obj[prop] = null;

        if (selected && selected.length > 0) {
            obj[prop] = selected[0].id;

            const { id, label, ...noIdLabel } = selected[0]; // loop properties in selected (except id and label) and try to assign them to the obj
            for (const p in noIdLabel) {
                if (p in obj) {
                    obj[p] = noIdLabel[p];
                }
            }
        }

        this.setState({
            [SELECTED(prop)]: selected,
            [objName]: obj
        });
    }

    submitForm = async e => {
        e.preventDefault();
        const accessToken = this.props.accessToken;

        try {
            await cRecordFacade.saveUpdateChromrecordWithAll({
                chromrecord: this.state.chromrecord,
                material: this.state.material,
                reference: this.state.reference
            }, accessToken);
            this.context.router.history.push(CHROM_DATA_LIST_URI); // redirect to chromosome data
            notifications.success('Saved');
        } catch (e) {
            notifications.error('Error saving');
            throw e;
        }
    }

    render() {
        return (
            <div id="chromosome-record">
                <Grid>
                    <h2>Chromosome record <small>{this.state.chromrecord.id ? this.state.chromrecord.id : 'new'}</small></h2>
                    <Form horizontal onSubmit={(e) => this.submitForm(e)}>
                        <div id="identification">
                            <h3>Identification</h3>
                            <FormGroup controlId="nameAsPublished" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Name as published<br />
                                    <small>(with spelling errors)</small>:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.reference.nameAsPublished || ''} onChange={e => this.onChangeTextInput(e, 'reference')} placeholder="Name as published" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="original-identification" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Original identification<br />
                                    <small>(name from checklist)</small>:
                                </Col>
                                <Col sm={10}>
                                    <InputGroup bsSize='sm'>
                                        <Typeahead
                                            id="original-identification-autocomplete"
                                            options={this.state.listOfSpecies}
                                            selected={this.state.idStandardisedNameSelected}
                                            onChange={(selected) => this.onChangeTypeahead(selected, 'reference', 'idStandardisedName')}
                                            placeholder="Start by typing a species in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_SPECIES)}>
                                                Create new
                                            </Button>
                                        </InputGroup.Button>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Identification history - revisions<br />
                                    <small>(names from checklist)</small>:
                                </Col>
                                <Col sm={10}>
                                    <BootstrapTable condensed
                                        keyField='id'
                                        data={this.state.histories}
                                        columns={revisionsColumns}
                                    />
                                </Col>
                            </FormGroup>
                        </div>
                        <div id="literature">
                            <h3>Publication</h3>
                            <FormGroup controlId="publication" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Publication:
                                </Col>
                                <Col sm={10}>
                                    <InputGroup bsSize='sm'>
                                        <Typeahead
                                            id="publication-autocomplete"
                                            options={this.state.literatures}
                                            selected={this.state.idLiteratureSelected}
                                            onChange={(selected) => this.onChangeTypeahead(selected, 'reference', 'idLiterature')}
                                            placeholder="Start by typing a publication in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_LITERATURE)}>
                                                Create new
                                            </Button>
                                        </InputGroup.Button>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="page" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Data published on pages:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.reference.page || ''} onChange={e => this.onChangeTextInput(e, 'reference')} placeholder="Data published on pages" />
                                </Col>
                            </FormGroup>
                        </div>
                        <div id="chromosome-data">
                            <h3>Chromosome data</h3>
                            <FormGroup controlId="n" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    n:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.n || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="dn" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    2n:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.dn || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="x" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    x:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.x || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="xRevised" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    x revised:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.xRevised || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="ploidyLevel" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Ploidy level:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.ploidyLevel || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="ploidyLevelRevised" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Ploidy level revised:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.ploidyLevelRevised || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="countedBy" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Counted by:
                                </Col>
                                <Col sm={10}>
                                    <InputGroup bsSize='sm'>
                                        <Typeahead
                                            id="counted-by-autocomplete"
                                            options={this.state.persons}
                                            selected={this.state.countedBySelected}
                                            onChange={(selected) => this.onChangeTypeaheadChromrecord(selected, 'countedBy')}
                                            placeholder="Start by typing a surname present in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_PERSONS)}>
                                                Create new
                                            </Button>
                                        </InputGroup.Button>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="countedDate" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Counted date:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.countedDate || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="karyotype" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Karyotype:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.karyotype || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="numberOfAnalysedPlants" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    N° of analysed plants:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.numberOfAnalysedPlants || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="slideNo" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Slide N°:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.slideNo || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="depositedIn" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Deposited in:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.depositedIn || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={10} smOffset={2}>
                                    <Checkbox inline
                                        name="drawing"
                                        value={this.state.chromrecord.drawing || false}
                                        checked={this.state.chromrecord.drawing || false}
                                        onChange={e => this.onChangeCheckbox(e, 'chromrecord')}>
                                        Drawing
                                    </Checkbox>
                                    <Checkbox inline
                                        name="photo"
                                        value={this.state.chromrecord.photo || false}
                                        checked={this.state.chromrecord.photo || false}
                                        onChange={e => this.onChangeCheckbox(e, 'chromrecord')}>
                                        Photo
                                    </Checkbox>
                                    <Checkbox inline
                                        name="idiogram"
                                        value={this.state.chromrecord.idiogram || false}
                                        checked={this.state.chromrecord.idiogram || false}
                                        onChange={e => this.onChangeCheckbox(e, 'chromrecord')}>
                                        Idiogram
                                    </Checkbox>
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="note" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Note:
                                </Col>
                                <Col sm={10}>
                                    <FormControl componentClass="textarea" value={this.state.chromrecord.note || ''} onChange={e => this.onChangeTextInput(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                        </div>
                        <div id="material">
                            <h3>Material</h3>
                            <FormGroup controlId="country" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Country:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.country || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="world4" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    World 4:
                                </Col>
                                <Col sm={10}>
                                    <Typeahead
                                        id="world4-autocomplete"
                                        options={this.state.world4s}
                                        selected={this.state.idWorld4Selected}
                                        onChange={(selected) => this.onChangeTypeahead(selected, 'material', 'idWorld4')}
                                        placeholder="Start by typing a country present in the database" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="geographicalDistrict" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Geogr. district:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.geographicalDistrict || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="centralEuropeanMappingUnit" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    CEMU:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.centralEuropeanMappingUnit || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="administrativeUnit" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Administr. unit:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.administrativeUnit || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="closestVillageTown" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Closest village:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.closestVillageTown || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="altitude" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Altitude:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.altitude || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="exposition" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Exposition:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.exposition || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="description" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Description:
                                </Col>
                                <Col sm={10}>
                                    <FormControl componentClass="textarea" value={this.state.material.description || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="collectedBy" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Collected by:
                                </Col>
                                <Col sm={10}>
                                    <InputGroup bsSize='sm'>
                                        <Typeahead
                                            id="collected-by-autocomplete"
                                            options={this.state.persons}
                                            selected={this.state.collectedBySelected}
                                            onChange={(selected) => this.onChangeTypeaheadMaterial(selected, 'collectedBy')}
                                            placeholder="Start by typing a surname present in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_PERSONS)}>
                                                Create new
                                            </Button>
                                        </InputGroup.Button>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="collectedDate" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Collected date:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.collectedDate || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="identifiedBy" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Identified by:
                                </Col>
                                <Col sm={10}>
                                    <InputGroup bsSize='sm'>
                                        <Typeahead
                                            id="identified-by-autocomplete"
                                            options={this.state.persons}
                                            selected={this.state.identifiedBySelected}
                                            onChange={(selected) => this.onChangeTypeaheadMaterial(selected, 'identifiedBy')}
                                            placeholder="Start by typing a surname present in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_PERSONS)}>
                                                Create new
                                            </Button>
                                        </InputGroup.Button>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="voucherSpecimenNo" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Voucher specimen N°:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.voucherSpecimenNo || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="depositedIn" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Deposited in:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.depositedIn || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="checkedBy" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Checked by:
                                </Col>
                                <Col sm={10}>
                                    <InputGroup bsSize='sm'>
                                        <Typeahead
                                            id="checked-by-autocomplete"
                                            options={this.state.persons}
                                            selected={this.state.checkedBySelected}
                                            onChange={(selected) => this.onChangeTypeaheadMaterial(selected, 'checkedBy')}
                                            placeholder="Start by typing a surname present in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_PERSONS)}>
                                                Create new
                                            </Button>
                                        </InputGroup.Button>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="coordinatesLat" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lat. orig:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.coordinatesLat || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="coordinatesLon" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lon. orig:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.coordinatesLon || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="coordinatesGeorefLat" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lat. georef:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.coordinatesGeorefLat || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="coordinatesGeorefLon" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lon. georef:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.coordinatesGeorefLon || ''} onChange={e => this.onChangeTextInput(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                        </div>
                        <Row>
                            <Col sm={5} smOffset={2}>
                                <Button bsStyle="default" onClick={this.props.history.goBack} >Cancel</Button>
                            </Col>
                            <Col sm={5}>
                                <Button bsStyle="primary" type='submit' >Save</Button>
                            </Col>
                        </Row>
                    </Form>
                </Grid>
                <PersonModal show={this.state.modals[MODAL_PERSONS]} onHide={this.hideModal} />
                <PublicationModal show={this.state.modals[MODAL_LITERATURE]} onHide={this.hideModal} />
                <SpeciesNameModal show={this.state.modals[MODAL_SPECIES]} onHide={this.hideModal} />
                <NotificationContainer />
            </div>
        );
    }

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(Record);