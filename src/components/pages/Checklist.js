import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Grid, Col, Row,
    Button, Glyphicon,
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';

import { NotificationContainer } from 'react-notifications';

import TabledPage from '../wrappers/TabledPageParent';
import SpeciesNameModal from '../segments/modals/SpeciesNameModal';

import checklistFacade from '../../facades/checklist';

import helper from '../../utils/helper';
import config from '../../config/config';

import '../../styles/custom.css';
import ChecklistDetail from './checklist/ChecklistDetail';

const buildNtypesOptions = ntypes => {
    const obj = {};
    Object.keys(ntypes).forEach(t => {
        obj[t] = t;
    });
    return obj;
}

const ntypeFormatter = cell => <span style={{ color: config.mappings.losType[cell].colour }}>{cell}</span>;

const formatTableRow = data => data.map(n => ({
    id: n.id,
    ntype: n.ntype,
    speciesName: helper.listOfSpeciesString(n),
    extra: <Glyphicon glyph='chevron-right' style={{ color: '#cecece' }}></Glyphicon>
}));

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
            showModalSpecies: false,
            listOfSpecies: [], //options for autocomplete fields
            species: {},
            tableRowsSelected: [],

            synonyms: {},
            synonymIdsToDelete: [],
            fors: {}
        }
    };

    showModal = id => this.setState({
        showModalSpecies: true
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
        },
    };

    populateDetailsForEdit = async id => {
        const accessToken = this.props.accessToken;

        const species = await checklistFacade.getSpeciesByIdWithFilter(id, accessToken);
        const listOfSpecies = await checklistFacade.getAllSpecies(accessToken);

        const synonyms = await checklistFacade.getSynonyms(id, accessToken);
        const fors = await checklistFacade.getBasionymsFor(id, accessToken);

        this.setState({
            species,
            listOfSpecies,
            tableRowsSelected: [id],
            synonymIdsToDelete: [],
            fors,
            synonyms
        });
    };

    handleValueChange = obj => this.setState(obj);

    componentDidMount() {
        const selectedId = this.props.match.params.id;
        if (selectedId) {
            const selectedIdInt = parseInt(selectedId);
            this.populateDetailsForEdit(selectedIdInt);
        }
    }

    render() {
        const tableRowSelectedProps = { ...this.selectRow, selected: this.state.tableRowsSelected };
        return (
            <div id='names'>
                <Grid>
                    <div id="functions">
                        <Button bsStyle="success" onClick={this.showModal}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
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
                                synonymIdsToDelete={this.state.synonymIdsToDelete}
                                listOfSpecies={this.state.listOfSpecies}
                                accessToken={this.props.accessToken}
                                onShowModal={this.showModal}
                                onValueChange={this.handleValueChange}
                                onDetailsChanged={() => this.props.onTableChange(undefined, {})}
                            />
                        </Col>
                    </Row>
                </Grid>
                <SpeciesNameModal editId={this.state.species.id} show={this.state.showModalSpecies} onHide={this.hideModal} />
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
