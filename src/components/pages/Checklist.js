import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Grid, Col, Row,
    Button, Glyphicon, Panel, Well,
    ListGroup, ListGroupItem,
    Form, FormControl, FormGroup, ControlLabel
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';

import { NotificationContainer } from 'react-notifications';

import TabledPage from '../wrappers/TabledPageParent';
import LosName from '../segments/LosName';
import AddableList from '../segments/AddableList';
import SynonymListItem from '../segments/SynonymListItem';
import SpeciesNameModal from '../segments/modals/SpeciesNameModal';

import checklistFacade from '../../facades/checklist';

import helper from '../../utils/helper';
import notifications from '../../utils/notifications';
import config from '../../config/config';

import '../../styles/custom.css';
import ChecklistDetail from './checklist/ChecklistDetail';

const titleColWidth = 2;
const mainColWidth = 10;

const buildNtypesOptions = ntypes => {
    const obj = {};
    Object.keys(ntypes).forEach(t => {
        obj[t] = t;
    });
    return obj;
}

const ntypeFormatter = cell => <span style={{ color: config.mappings.losType[cell].colour }}>{cell}</span>;

const synonymFormatter = (synonym, prefix) => ({
    id: synonym.id,
    prefix,
    value: synonym
});

const addSynonymToList = async (selected, synonyms, accessToken) => {
    if (!selected) {
        return null;
    }
    if (synonyms.find(s => s.id === selected.id)) {
        notifications.warning('The item is already in the list');
        return null;
    }
    const synonymJson = await checklistFacade.getSpeciesByIdWithFilter(selected.id, accessToken);
    synonyms.push(synonymJson);
    synonyms.sort(helper.listOfSpeciesSorterLex);
    return synonyms;
}

const formatTableRow = data => {
    return data.map(n => {
        return ({
            id: n.id,
            ntype: n.ntype,
            speciesName: helper.listOfSpeciesString(n),
            extra: <Glyphicon glyph='chevron-right' style={{ color: '#cecece' }}></Glyphicon>
        })
    });
};

const ntypes = config.mappings.losType;
const ntypesFilterOptions = buildNtypesOptions(ntypes);
const typifications = config.mappings.typifications;

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
            showModalSpecies: false,
            // modalEditId: 0, //id for modal
            editId: undefined,
            listOfSpecies: [], //options for autocomplete fields
            // species: { // properties for synonyms
            //     id: undefined
            // },
            tableRowsSelected: [],

            // nomenclatoricSynonyms: [], // contains objects of list-of-species
            // taxonomicSynonyms: [], // contains objects of list-of-species
            // invalidDesignations: [],
            // misidentifications: [],

            // misidentificationAuthors: {},

            // isNomenclatoricSynonymsChanged: false,
            // isTaxonomicSynonymsChanged: false,
            // isInvalidDesignationsChanged: false,
            // isMisidentificationsChanged: false,

            // basionymFor: [],
            // replacedFor: [],
            // nomenNovumFor: [],
        }
    };

    showModal = id => this.setState({
        showModalSpecies: true,
        modalEditId: id
    });

    hideModal = () => {
        this.props.onTableChange(undefined, {});
        // if (this.state.species.id) {
        //     this.populateDetailsForEdit(this.state.species.id);
        // }
        this.setState({ showModalSpecies: false });
    };

    selectRow = {
        mode: 'radio',
        clickToSelect: true,
        hideSelectColumn: true,
        bgColor: '#ffea77',
        onSelect: (row, isSelect, rowIndex, e) => {
            this.props.history.push(`/names/${row.id}`);
            this.populateDetailsForEdit(row.id);
        },
    };

    // populateDetailsForEdit = async id => {
    //     const accessToken = this.props.accessToken;

    //     const los = await checklistFacade.getSpeciesByIdWithFilter(id, accessToken);
    //     const speciesListRaw = await checklistFacade.getAllSpecies(accessToken);
    //     const listOfSpecies = speciesListRaw.map(l => ({
    //         id: l.id,
    //         label: helper.listOfSpeciesString(l)
    //     }));

    //     const { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations, misidentifications } = await checklistFacade.getSynonyms(id, accessToken);
    //     const { basionymFor, replacedFor, nomenNovumFor } = await checklistFacade.getBasionymsFor(id, accessToken);

    //     const misidentificationAuthors = misidentifications.reduce((acc, curr) => {
    //         acc[curr.id] = curr.metadata ? curr.metadata.misidentificationAuthor : undefined;
    //         return acc;
    //     }, {});

    //     this.setState({
    //         species: {
    //             ...los
    //         },
    //         listOfSpecies,
    //         tableRowsSelected: [id],
    //         nomenclatoricSynonyms,
    //         taxonomicSynonyms,
    //         invalidDesignations,
    //         misidentifications,
    //         misidentificationAuthors,
    //         basionymFor,
    //         replacedFor,
    //         nomenNovumFor
    //     });
    // };

    getSelectedName = id => this.state.listOfSpecies.filter(l => l.id === id);

    handleChangeTypeahead = (selected, prop) => {
        const id = selected[0] ? selected[0].id : undefined;
        this.handleSpeciesChange(prop, id);
    };

    handleChangeInput = e => this.handleSpeciesChange(e.target.id, e.target.value);

    handleSpeciesChange = (prop, val) => {
        const species = { ...this.state.species };
        species[prop] = val;
        this.setState({
            species
        });
    };

    // handleAddNomenclatoricSynonym = async selected => this.handleAddRow(selected, 'nomenclatoricSynonyms', 'isNomenclatoricSynonymsChanged');
    // handleAddTaxonomicSynonym = async selected => this.handleAddRow(selected, 'taxonomicSynonyms', 'isTaxonomicSynonymsChanged');
    // handleAddInvalidDesignation = async selected => this.handleAddRow(selected, 'invalidDesignations', 'isInvalidDesignationsChanged');
    // handleAddMisidentification = async selected => this.handleAddRow(selected, 'misidentifications', 'isMisidentificationsChanged');

    // handleAddRow = async (selected, property, changedProperty) => {
    //     const accessToken = this.props.accessToken;
    //     const collectionState = this.state[property];
    //     const collection = await addSynonymToList(selected, collectionState, accessToken);
    //     this.setState({
    //         [property]: collection,
    //         [changedProperty]: true
    //     });
    // }

    // handleRemoveNomenclatoricSynonym = id => this.handleRemoveRow(id, 'nomenclatoricSynonyms', 'isNomenclatoricSynonymsChanged');
    // handleRemoveTaxonomicSynonym = id => this.handleRemoveRow(id, 'taxonomicSynonyms', 'isTaxonomicSynonymsChanged');
    // handleRemoveInvalidDesignation = id => this.handleRemoveRow(id, 'invalidDesignations', 'isInvalidDesignationsChanged');
    // handleRemoveMisidentification = id => this.handleRemoveRow(id, 'misidentifications', 'isMisidentificationsChanged');

    // handleRemoveRow = (id, property, changedProperty) => {
    //     const collection = this.state[property].filter(s => s.id !== id);
    //     this.setState({
    //         [property]: collection,
    //         [changedProperty]: true
    //     });
    // };

    handleChangeToTaxonomic = async (id, fromList) => {
        const selected = fromList.find(s => s.id === id);
        await this.handleAddTaxonomicSynonym(selected);
        // remove from all others
        await this.handleRemoveNomenclatoricSynonym(id);
        await this.handleRemoveInvalidDesignation(id);
    }

    handleChangeToNomenclatoric = async (id, fromList) => {
        const selected = fromList.find(s => s.id === id);
        await this.handleAddNomenclatoricSynonym(selected);
        // remove from all others
        await this.handleRemoveTaxonomicSynonym(id);
        await this.handleRemoveInvalidDesignation(id);
    }

    handleChangeToInvalid = async (id, fromList) => {
        const selected = fromList.find(s => s.id === id);
        await this.handleAddInvalidDesignation(selected);
        //remove from all others
        await this.handleRemoveNomenclatoricSynonym(id);
        await this.handleRemoveTaxonomicSynonym(id);
    }

    // submitForm = async e => {
    //     e.preventDefault();
    //     const accessToken = this.props.accessToken;

    //     const misidentifications = this.state.misidentifications;
    //     misidentifications.forEach(m => {
    //         if (!m.metadata) {
    //             m.metadata = {};
    //         }
    //         m.metadata.misidentificationAuthor = this.state.misidentificationAuthors[m.id];
    //     });

    //     try {
    //         await checklistFacade.saveSpeciesAndSynonyms({
    //             species: this.state.species,
    //             accessToken,
    //             nomenclatoricSynonyms: this.state.nomenclatoricSynonyms,
    //             taxonomicSynonyms: this.state.taxonomicSynonyms,
    //             invalidDesignations: this.state.invalidDesignations,
    //             misidentifications,
    //             isNomenclatoricSynonymsChanged: this.state.isNomenclatoricSynonymsChanged,
    //             isTaxonomicSynonymsChanged: this.state.isTaxonomicSynonymsChanged,
    //             isInvalidDesignationsChanged: this.state.isInvalidDesignationsChanged,
    //             isMisidentificationsChanged: this.state.isMisidentificationsChanged
    //         });

    //         notifications.success('Saved');
    //         this.props.onTableChange(undefined, {});

    //         this.setState({
    //             isNomenclatoricSynonymsChanged: false,
    //             isTaxonomicSynonymsChanged: false,
    //             isInvalidDesignationsChanged: false,
    //             isMisidentificationsChanged: false
    //         });
    //     } catch (error) {
    //         notifications.error('Error saving');
    //         throw error;
    //     }
    // };

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

    // renderPlainListOfSpeciesNames = list => {
    //     if (!list || list.length === 0) {
    //         return <ListGroupItem />
    //     }
    //     return (
    //         <ListGroup>
    //             {list.map(b =>
    //                 <ListGroupItem key={b.id}>
    //                     <LosName data={b} />
    //                 </ListGroupItem>)}
    //         </ListGroup>
    //     )
    // };

    // NomenclatoricSynonymListItem = ({ rowId, ...props }) => {
    //     const fromList = this.state.nomenclatoricSynonyms;
    //     const Additions = () => (
    //         <React.Fragment>
    //             <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToTaxonomic(rowId, fromList)} title="Change to taxonomic synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.taxonomic.prefix}</Button>
    //             &nbsp;
    //             <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToInvalid(rowId, fromList)} title="Change to invalid designation"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.invalid.prefix}</Button>
    //         </React.Fragment>
    //     );
    //     return (
    //         <SynonymListItem {...props} additions={Additions} />
    //     );
    // };

    // TaxonomicSynonymListItem = ({ rowId, ...props }) => {
    //     const fromList = this.state.taxonomicSynonyms;
    //     const Additions = p => (
    //         <React.Fragment>
    //             <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToNomenclatoric(rowId, fromList)} title="Change to nomenclatoric synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.nomenclatoric.prefix}</Button>
    //             &nbsp;
    //             <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToInvalid(rowId, fromList)} title="Change to invalid designation"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.invalid.prefix}</Button>
    //         </React.Fragment>
    //     );
    //     return (
    //         <SynonymListItem {...props} additions={Additions} />
    //     );
    // };

    // InvalidSynonymListItem = ({ rowId, ...props }) => {
    //     const fromList = this.state.invalidDesignations;
    //     const Additions = p => (
    //         <React.Fragment>
    //             <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToNomenclatoric(rowId, fromList)} title="Change to nomenclatoric synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.nomenclatoric.prefix}</Button>
    //             &nbsp;
    //             <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToTaxonomic(rowId, fromList)} title="Change to taxonomic synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.taxonomic.prefix}</Button>
    //         </React.Fragment>
    //     );
    //     return (
    //         <SynonymListItem {...props} additions={Additions} />
    //     );
    // };

    // MisidentifiedSynonymListItem = ({ rowId, ...props }) => {

    //     const handleChangeAuthor = e => {
    //         const misidentificationAuthors = this.state.misidentificationAuthors;
    //         misidentificationAuthors[rowId] = e.target.value;
    //         this.setState({
    //             misidentificationAuthors,
    //             isMisidentificationsChanged: true
    //         });
    //     };

    //     return (
    //         <SynonymListItem showSubNomenclatoric={false} {...props}>
    //             <FormGroup bsSize='sm'>
    //                 <Col componentClass={ControlLabel} sm={2}>
    //                     Author:
    //                 </Col>
    //                 <Col xs={8}>
    //                     <FormControl
    //                         type="text"
    //                         value={this.state.misidentificationAuthors[rowId] || ""}
    //                         placeholder="Misidentification Author"
    //                         onChange={handleChangeAuthor}
    //                     />
    //                 </Col>
    //             </FormGroup>
    //         </SynonymListItem>
    //     );
    // }
    // 
    // renderDetailHeader = () => {
    //     if (!this.state.species.id) {
    //         return (
    //             <Panel>
    //                 <Panel.Body>Click row to edit details</Panel.Body>
    //             </Panel>
    //         )
    //     }
    //     return (
    //         <Panel id="species-edit-header">
    //             <Panel.Heading>
    //                 <Button bsStyle='warning' bsSize='xsmall' onClick={() => this.showModal(this.state.species.id)}>
    //                     <Glyphicon glyph='edit' /> Edit Name
    //                 </Button>
    //             </Panel.Heading>
    //             <Panel.Body>
    //                 <h4><LosName data={this.state.species} /></h4>
    //                 <h5>{this.state.species.publication || '-'}</h5>
    //                 <hr />
    //                 <FormGroup controlId='ntype' bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Category
    //                     </Col>
    //                     <Col xs={3}>
    //                         <FormControl
    //                             componentClass="select"
    //                             placeholder="select"
    //                             value={this.state.species.ntype}
    //                             onChange={this.handleChangeInput} >
    //                             {
    //                                 Object.keys(ntypes).map(t => <option value={t} key={t}>{ntypes[t].text}</option>)
    //                             }
    //                         </FormControl>
    //                     </Col>
    //                 </FormGroup>
    //                 <hr />
    //                 <FormGroup controlId='typification' bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Type
    //                     </Col>
    //                     <Col xs={3}>
    //                         <FormControl
    //                             componentClass="select"
    //                             placeholder="typification"
    //                             value={this.state.species.typification || ""}
    //                             onChange={this.handleChangeInput} >
    //                             <option value={""}>-</option>
    //                             {
    //                                 Object.keys(typifications).map(t => <option value={t} key={t}>{typifications[t].text}</option>)
    //                             }
    //                         </FormControl>
    //                     </Col>
    //                 </FormGroup>
    //                 <FormGroup controlId="typeLocality" bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Type Locality
    //                     </Col>
    //                     <Col sm={mainColWidth}>
    //                         <FormControl
    //                             type="text"
    //                             value={this.state.species.typeLocality || ""}
    //                             placeholder="Type Locality"
    //                             onChange={this.handleChangeInput}
    //                             disabled={!this.state.species.typification}
    //                         />
    //                     </Col>
    //                 </FormGroup>
    //             </Panel.Body>
    //         </Panel>
    //     )
    // }

    // renderEditDetails = () => {
    //     if (this.state.species.id) {
    //         return (
    //             <Well id="species-edit-references">
    //                 <FormGroup controlId="accepted-name-autocomplete" bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Accepted name
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         <Typeahead
    //                             id="accepted-name-autocomplete"
    //                             options={this.state.listOfSpecies}
    //                             selected={this.getSelectedName(this.state.species.idAcceptedName)}
    //                             onChange={(selected) => this.handleChangeTypeahead(selected, 'idAcceptedName')}
    //                             placeholder="Start by typing a species present in the database" />
    //                     </Col>
    //                 </FormGroup>
    //                 <FormGroup controlId="basionym-autocomplete" bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Basionym
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         <Typeahead
    //                             id="basionym-autocomplete"
    //                             options={this.state.listOfSpecies}
    //                             selected={this.getSelectedName(this.state.species.idBasionym)}
    //                             onChange={(selected) => this.handleChangeTypeahead(selected, 'idBasionym')}
    //                             placeholder="Start by typing a species present in the database" />
    //                     </Col>
    //                 </FormGroup>
    //                 <FormGroup controlId="replaced-autocomplete" bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Replaced Name
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         <Typeahead
    //                             id="replaced-autocomplete"
    //                             options={this.state.listOfSpecies}
    //                             selected={this.getSelectedName(this.state.species.idReplaced)}
    //                             onChange={(selected) => this.handleChangeTypeahead(selected, 'idReplaced')}
    //                             placeholder="Start by typing a species present in the database" />
    //                     </Col>
    //                 </FormGroup>
    //                 <FormGroup controlId="nomen-novum-autocomplete" bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Nomen Novum
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         <Typeahead
    //                             id="nomen-novum-autocomplete"
    //                             options={this.state.listOfSpecies}
    //                             selected={this.getSelectedName(this.state.species.idNomenNovum)}
    //                             onChange={(selected) => this.handleChangeTypeahead(selected, 'idNomenNovum')}
    //                             placeholder="Start by typing a species present in the database" />
    //                     </Col>
    //                 </FormGroup>
    //                 <hr />
    //                 <FormGroup controlId="nomenclatoric-synonyms-autocomplete" bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Nomenclatoric Synonyms
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         <AddableList
    //                             id="nomenclatoric-synonyms-autocomplete"
    //                             data={this.state.nomenclatoricSynonyms.map(s => synonymFormatter(s, config.mappings.synonym.nomenclatoric.prefix))}
    //                             options={this.state.listOfSpecies}
    //                             changeToTypeSymbol={config.mappings.synonym.taxonomic.prefix}
    //                             onAddItemToList={this.handleAddNomenclatoricSynonym}
    //                             onRowDelete={this.handleRemoveNomenclatoricSynonym}
    //                             itemComponent={this.NomenclatoricSynonymListItem}
    //                         />
    //                     </Col>
    //                 </FormGroup>
    //                 <FormGroup controlId="taxonomic-synonyms-autocomplete" bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Taxonomic Synonyms
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         <AddableList
    //                             id="taxonomic-synonyms-autocomplete"
    //                             data={this.state.taxonomicSynonyms.map(s => s.ntype === 'DS' ? synonymFormatter(s, config.mappings.synonym.doubtful.prefix) : synonymFormatter(s, config.mappings.synonym.taxonomic.prefix))}
    //                             options={this.state.listOfSpecies}
    //                             changeToTypeSymbol={config.mappings.synonym.nomenclatoric.prefix}
    //                             onAddItemToList={this.handleAddTaxonomicSynonym}
    //                             onRowDelete={this.handleRemoveTaxonomicSynonym}
    //                             itemComponent={this.TaxonomicSynonymListItem}
    //                         />
    //                     </Col>
    //                 </FormGroup>
    //                 <FormGroup controlId="invalid-designations-autocomplete" bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Invalid Designations
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         <AddableList
    //                             id="invalid-designations-autocomplete"
    //                             data={this.state.invalidDesignations.map(s => synonymFormatter(s, config.mappings.synonym.invalid.prefix))}
    //                             options={this.state.listOfSpecies}
    //                             changeToTypeSymbol={config.mappings.synonym.nomenclatoric.prefix}
    //                             onAddItemToList={this.handleAddInvalidDesignation}
    //                             onRowDelete={this.handleRemoveInvalidDesignation}
    //                             itemComponent={this.InvalidSynonymListItem}
    //                         />
    //                     </Col>
    //                 </FormGroup>
    //                 <FormGroup controlId="misidentifications-autocomplete" bsSize='sm'>
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Misidentifications
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         <AddableList
    //                             id="misidentifications-autocomplete"
    //                             data={this.state.misidentifications.map(s => synonymFormatter(s, config.mappings.synonym.misidentification.prefix))}
    //                             options={this.state.listOfSpecies}
    //                             onAddItemToList={this.handleAddMisidentification}
    //                             onRowDelete={this.handleRemoveMisidentification}
    //                             itemComponent={this.MisidentifiedSynonymListItem}
    //                         />
    //                     </Col>
    //                 </FormGroup>
    //                 <hr />
    //                 <FormGroup controlId="basionym-for">
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Basionym For
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         {this.renderPlainListOfSpeciesNames(this.state.basionymFor)}
    //                     </Col>
    //                 </FormGroup>
    //                 <FormGroup controlId="replaced-for">
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Replaced For
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         {this.renderPlainListOfSpeciesNames(this.state.replacedFor)}
    //                     </Col>
    //                 </FormGroup>
    //                 <FormGroup controlId="nomen-novum-for">
    //                     <Col componentClass={ControlLabel} sm={titleColWidth}>
    //                         Nomen Novum For
    //                     </Col>
    //                     <Col xs={mainColWidth}>
    //                         {this.renderPlainListOfSpeciesNames(this.state.nomenNovumFor)}
    //                     </Col>
    //                 </FormGroup>
    //                 <hr />
    //                 <Button bsStyle="primary" type='submit' >Save</Button>
    //             </Well>
    //         );
    //     }
    //     return undefined;
    // }

    render() {
        const tableRowSelectedProps = { ...this.selectRow, selected: this.state.tableRowsSelected };
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
                        <Col sm={6} id="species-list">
                            <div className="scrollable">
                                <BootstrapTable hover striped condensed
                                    keyField='id'
                                    rowClasses='as-pointer'
                                    data={formatTableRow(this.props.data)}
                                    columns={columns}
                                    filter={filterFactory()}
                                    selectRow={tableRowSelectedProps}
                                    onTableChange={this.props.onTableChange}
                                />
                            </div>
                        </Col>
                        <Col sm={6} id="species-detail">
                            {/* <Form onSubmit={this.submitForm} horizontal>
                                {this.renderDetailHeader()}
                                {this.renderEditDetails()}
                            </Form> */}
                            <ChecklistDetail
                                id={this.state.editId}
                                accessToken={this.props.accessToken}
                                onShowModal={this.showModal}
                                onDetailsChanged={() => this.onTableChange(undefined, {})}
                            />
                        </Col>
                    </Row>
                </Grid>
                <SpeciesNameModal id={this.state.editId} show={this.state.showModalSpecies} onHide={this.hideModal} />
                <NotificationContainer />
            </div>
        );
    }

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(
    TabledPage({
        getAll: config.uris.listOfSpeciesUri.getAllWOrderUri,
        getCount: config.uris.listOfSpeciesUri.countUri
    })(Checklist)
);
