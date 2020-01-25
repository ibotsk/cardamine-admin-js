import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Grid, Col, Row,
    Button, Glyphicon,
    // Panel, Well,
    // ListGroup, ListGroupItem,
    // Form, FormControl, FormGroup, ControlLabel
} from 'react-bootstrap';

// import { Typeahead } from 'react-bootstrap-typeahead';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';

import { NotificationContainer } from 'react-notifications';

import TabledPage from '../wrappers/TabledPageParent';
// import LosName from '../segments/LosName';
// import AddableList from '../segments/AddableList';
// import SynonymListItem from '../segments/SynonymListItem';
import SpeciesNameModal from '../segments/modals/SpeciesNameModal';

import checklistFacade from '../../facades/checklist';

import helper from '../../utils/helper';
import notifications from '../../utils/notifications';
import config from '../../config/config';

import '../../styles/custom.css';
import ChecklistDetail from './checklist/ChecklistDetail';

// const titleColWidth = 2;
// const mainColWidth = 10;

const buildNtypesOptions = ntypes => {
    const obj = {};
    Object.keys(ntypes).forEach(t => {
        obj[t] = t;
    });
    return obj;
}

const ntypeFormatter = cell => <span style={{ color: config.mappings.losType[cell].colour }}>{cell}</span>;

// const synonymFormatter = (synonym, prefix) => ({
//     id: synonym.id,
//     prefix,
//     value: synonym
// });

// const addSynonymToList = async (selected, synonyms, accessToken) => {
//     if (!selected) {
//         return null;
//     }
//     if (synonyms.find(s => s.id === selected.id)) {
//         notifications.warning('The item is already in the list');
//         return null;
//     }
//     const synonymJson = await checklistFacade.getSpeciesByIdWithFilter(selected.id, accessToken);
//     synonyms.push(synonymJson);
//     synonyms.sort(helper.listOfSpeciesSorterLex);
//     return synonyms;
// }

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
// const typifications = config.mappings.typifications;

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
            species: { // properties for synonyms
                // id: undefined
            },
            tableRowsSelected: [],

            synonyms: {},
            // nomenclatoricSynonyms: [], // contains objects of list-of-species
            // taxonomicSynonyms: [], // contains objects of list-of-species
            // invalidDesignations: [],
            // misidentifications: [],

            misidentificationAuthors: {},

            // isNomenclatoricSynonymsChanged: false,
            // isTaxonomicSynonymsChanged: false,
            // isInvalidDesignationsChanged: false,
            // isMisidentificationsChanged: false,

            fors: {}
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
        if (this.state.species.id) {
            this.populateDetailsForEdit(this.state.species.id);
        }
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
            this.setState({
                tableRowsSelected: [row.id],
                editId: row.id
            });
        },
    };

    populateDetailsForEdit = async id => {
        const accessToken = this.props.accessToken;

        const species = await checklistFacade.getSpeciesByIdWithFilter(id, accessToken);
        const speciesListRaw = await checklistFacade.getAllSpecies(accessToken);
        const listOfSpecies = speciesListRaw.map(l => ({
            id: l.id,
            label: helper.listOfSpeciesString(l)
        }));

        const synonyms = await checklistFacade.getSynonyms(id, accessToken);
        // const { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations, misidentifications } = await checklistFacade.getSynonyms(id, accessToken);
        const fors = await checklistFacade.getBasionymsFor(id, accessToken);
        // const { basionymFor, replacedFor, nomenNovumFor } = await checklistFacade.getBasionymsFor(id, accessToken);

        let misidentificationAuthors = {};
        if (fors.misidentifications) {
            misidentificationAuthors = fors.misidentifications.reduce((acc, curr) => {
                acc[curr.id] = curr.metadata ? curr.metadata.misidentificationAuthor : undefined;
                return acc;
            }, {});
        }

        this.setState({
            species,
            listOfSpecies,
            tableRowsSelected: [id],
            // nomenclatoricSynonyms,
            // taxonomicSynonyms,
            // invalidDesignations,
            // misidentifications,
            misidentificationAuthors,
            // basionymFor,
            // replacedFor,
            // nomenNovumFor,
            fors,
            synonyms
        });
    };

    getSelectedName = id => this.state.listOfSpecies.filter(l => l.id === id);

    handleChangeTypeahead = (selected, prop) => {
        const id = selected[0] ? selected[0].id : undefined;
        this.handleSpeciesChange(prop, id);
    };

    handleChangeInput = e => this.handleSpeciesChange(e.target.id, e.target.value);

    handleSpeciesChange = (prop, val) => {
        console.log(prop, val);

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
                tableRowsSelected: [selectedIdInt],
                editId: selectedIdInt
            });
        }
    }

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
                            <ChecklistDetail
                                species={this.state.species}
                                fors={this.state.fors}
                                synonyms={this.state.synonyms}
                                misidentificationAuthors={this.state.misidentificationAuthors}
                                accessToken={this.props.accessToken}
                                onShowModal={this.showModal}
                                onChangeSpecies={this.handleSpeciesChange}
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
