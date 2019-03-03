import React, { Component } from 'react';

import {
    Col, Grid, Row,
    InputGroup,
    Button, Checkbox, ControlLabel, Form, FormControl, FormGroup
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';

import { NotificationContainer } from 'react-notifications';

import axios from 'axios';
import template from 'url-template';

import config from '../../config/config';
import helper from '../../utils/helper';
import notifications from '../../utils/notifications';

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
const SELECTED = (prop) => `${prop}Selected`;

const MODAL_PERSONS = 'showModalPerson';
const MODAL_LITERATURE = 'showModalLiterature';
const MODAL_SPECIES = 'showModalSpecies';

class Record extends Component {

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.getByIdUri = template.parse(config.uris.chromosomeDataUri.getByIdUri);
        this.getAllLiteraturesUri = template.parse(config.uris.literaturesUri.getAllWOrderUri);
        this.getAllListOfSpeciesUri = template.parse(config.uris.listOfSpeciesUri.getAllWOrderUri);
        this.getAllPersonsUri = template.parse(config.uris.personsUri.getAllWOrderUri);
        this.getAllWorld4sUri = template.parse(config.uris.worldl4Uri.getAllWFilterUri);

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
            }
        };
    }

    getChromosomeRecord = async () => {
        const recordId = this.props.match.params.recordId;
        if (recordId) {
            const getCdataByIdUri = this.getByIdUri.expand({ id: recordId });
            const response = await axios.get(getCdataByIdUri); // get chromosome record

            const cdata = response.data;
            const mat = cdata.material;
            const ref = mat.reference;
            const hist = cdata.histories;

            delete cdata.material;
            delete cdata.histories;
            delete mat.reference;

            this.setState({
                chromrecord: cdata,
                material: mat,
                reference: ref,
                histories: hist
            });
        }
    }

    getPersons = async () => {
        const response = await axios.get(this.getAllPersonsUri.expand());  // get all persons

        const persons = response.data.map(p => ({ id: p.id, label: p.persName, countedByText: p.persName, collectedByText: p.persName }));
        const countedByInitial = persons.find(p => p.id === this.state.chromrecord.countedBy);
        const collectedByInitial = persons.find(p => p.id === this.state.material.collectedBy);
        const identifiedByInitial = persons.find(p => p.id === this.state.material.identifiedBy);
        const checkedByInitial = persons.find(p => p.id === this.state.material.checkedBy);

        this.setState({
            persons,
            countedBySelected: countedByInitial ? [countedByInitial] : null,
            collectedBySelected: collectedByInitial ? [collectedByInitial] : null,
            identifiedBySelected: identifiedByInitial ? [identifiedByInitial] : null,
            checkedBySelected: checkedByInitial ? [checkedByInitial] : null
        });
    }

    getWorld4s = async () => {
        const response = await axios.get(this.getAllWorld4sUri.expand()); // get all world4s

        const world4s = response.data.map(w => ({ id: w.id, label: w.description, idWorld3: w.idParent }));
        const world4Initial = world4s.find(w => w.id === this.state.material.idWorld4);

        this.setState({
            world4s,
            idWorld4Selected: world4Initial ? [world4Initial] : null
        });
    }

    getLiteratures = async () => {
        const response = await axios.get(this.getAllLiteraturesUri.expand()); // get all publications

        const literatures = response.data.map(l => ({
            id: l.id,
            label: helper.parsePublication({
                type: l.displayType,
                authors: l.paperAuthor,
                title: l.paperTitle,
                series: l.seriesSource,
                volume: l.volume,
                issue: l.issue,
                publisher: l.publisher,
                editor: l.editor,
                year: l.year,
                pages: l.pages,
                journal: l.journalName
            })
        }));
        const literatureInitial = literatures.find(l => l.id === this.state.reference.idLiterature);

        this.setState({
            literatures,
            idLiteratureSelected: literatureInitial ? [literatureInitial] : null
        });
    }

    getSpecies = async () => {
        const response = await axios.get(this.getAllListOfSpeciesUri.expand());

        const listOfSpecies = response.data.map(l => ({
            id: l.id,
            label: helper.listOfSpeciesString(l)
        }));

        const originalIdentificationInitial = listOfSpecies.find(l => l.id === this.state.reference.idStandardisedName);

        this.setState({
            listOfSpecies,
            idStandardisedNameSelected: originalIdentificationInitial ? [originalIdentificationInitial] : null
        });
    }

    getLists = async () => {
        await this.getPersons();
        await this.getWorld4s();
        await this.getLiteratures();
        await this.getSpecies();
    }

    showModal = (prop) => {
        const modals = this.state.modals;
        modals[prop] = true;
        this.setState({ modals });
    }

    hideModal = () => {
        const modals = this.state.modals;
        for (const m in modals) {
            modals[m] = false;
        }
        this.setState({ modals });
        this.getLists();
    }

    componentDidMount() {
        this.getChromosomeRecord()
            .then(this.getLists())
            .catch(e => {
                console.error(e)
                throw e;
            });
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

    submitForm = (e) => {
        e.preventDefault();

        const cdataUri = template.parse(config.uris.chromosomeDataUri.baseUri).expand();
        const materialUri = template.parse(config.uris.materialUri.baseUri).expand();
        const referenceUri = template.parse(config.uris.referenceUri.baseUri).expand();

        axios.put(cdataUri, this.state.chromrecord) //upsert cdata
            .then(response => {
                const body = { ...this.state.material, idCdata: response.data.id };
                return axios.put(materialUri, body); //upsert material
            }).then(response => {
                const body = { ...this.state.reference, idMaterial: response.data.id };
                return axios.put(referenceUri, body); //upsert reference
            }).then(() => {
                this.context.router.history.push(CHROM_DATA_LIST_URI); // redirect to chromosome data
                notifications.success('Saved');
            }).catch(e => {
                notifications.success('Error saving');
                throw e;
            });
    }

    render() {
        return (
            <div id="chromosome-record">
                <Grid>
                    <h2>Chromosome record <small>{this.state.chromrecord.id ? this.state.chromrecord.id : 'new'}</small></h2>
                    <Form horizontal onSubmit={(e) => this.submitForm(e)} action={CHROM_DATA_LIST_URI}>
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
                                            options={this.state.listOfSpecies}
                                            selected={this.state.idStandardisedNameSelected}
                                            onChange={(selected) => this.onChangeTypeahead(selected, 'reference', 'idStandardisedName')}
                                            placeholder="Start by typing a species in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_SPECIES)}>
                                                Add new
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
                                            options={this.state.literatures}
                                            selected={this.state.idLiteratureSelected}
                                            onChange={(selected) => this.onChangeTypeahead(selected, 'reference', 'idLiterature')}
                                            placeholder="Start by typing a publication in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_LITERATURE)}>
                                                Add new
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
                                            options={this.state.persons}
                                            selected={this.state.countedBySelected}
                                            onChange={(selected) => this.onChangeTypeaheadChromrecord(selected, 'countedBy')}
                                            placeholder="Start by typing a surname present in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_PERSONS)}>
                                                Add new
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
                                            options={this.state.persons}
                                            selected={this.state.collectedBySelected}
                                            onChange={(selected) => this.onChangeTypeaheadMaterial(selected, 'collectedBy')}
                                            placeholder="Start by typing a surname present in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_PERSONS)}>
                                                Add new
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
                                            options={this.state.persons}
                                            selected={this.state.identifiedBySelected}
                                            onChange={(selected) => this.onChangeTypeaheadMaterial(selected, 'identifiedBy')}
                                            placeholder="Start by typing a surname present in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_PERSONS)}>
                                                Add new
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
                                            options={this.state.persons}
                                            selected={this.state.checkedBySelected}
                                            onChange={(selected) => this.onChangeTypeaheadMaterial(selected, 'checkedBy')}
                                            placeholder="Start by typing a surname present in the database" />
                                        <InputGroup.Button>
                                            <Button
                                                bsStyle='info'
                                                onClick={() => this.showModal(MODAL_PERSONS)}>
                                                Add new
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
                                <Button bsStyle="default" href={CHROM_DATA_LIST_URI} >Cancel</Button>
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

export default Record;