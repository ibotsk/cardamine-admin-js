import React, { Component } from 'react';

import {
  Grid, Col, Row, Button, Glyphicon,
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {
  textFilter,
  multiSelectFilter,
} from 'react-bootstrap-table2-filter';

import { NotificationContainer } from 'react-notifications';

import PropTypes from 'prop-types';
import SpeciesType from '../propTypes/species';

import TabledPage from '../wrappers/TabledPageParent';
import SpeciesNameModal from '../segments/modals/SpeciesNameModal';

import { checklistFacade } from '../../facades';

import { notifications, helperUtils } from '../../utils';
import config from '../../config';

import '../../styles/custom.css';
import ChecklistDetail from './checklist/ChecklistDetail';
import DeleteSpeciesModal from '../segments/modals/DeleteSpeciesModal';

const buildNtypesOptions = (ntypes) => {
  const obj = {};
  Object.keys(ntypes).forEach((t) => {
    obj[t] = t;
  });
  return obj;
};

const ntypeFormatter = (cell) => (
  <span style={{ color: config.mappings.losType[cell].colour }}>{cell}</span>
);

const formatTableRow = (data) => data.map((n) => ({
  id: n.id,
  ntype: n.ntype,
  speciesName: helperUtils.listOfSpeciesString(n),
  extra: <Glyphicon glyph="chevron-right" style={{ color: '#cecece' }} />,
}));

const ntypes = config.mappings.losType;
const ntypesFilterOptions = buildNtypesOptions(ntypes);

const MODAL_EDIT_SPECIES = 'modal-edit-species';
const MODAL_DELETE_SPECIES = 'modal-delete-species';

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    sort: true,
  },
  {
    dataField: 'ntype',
    text: 'Type',
    formatter: ntypeFormatter,
    filter: multiSelectFilter({
      options: ntypesFilterOptions,
    }),
    sort: true,
  },
  {
    dataField: 'speciesName',
    text: 'Name',
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'extra',
    text: '',
    headerStyle: { width: '10px' },
  },
];

const selectRow = (history, populateDetailsForEdit) => ({
  mode: 'radio',
  clickToSelect: true,
  hideSelectColumn: true,
  bgColor: '#ffea77',
  onSelect: (row) => {
    history.push(`/names/${row.id}`);
    populateDetailsForEdit(row.id);
  },
});

class Checklist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModalSpecies: false,
      showModalDelete: false,
      modalSpeciesEditId: undefined,

      listOfSpecies: [], // options for autocomplete fields
      species: {},
      tableRowsSelected: [],

      synonyms: {},
      synonymIdsToDelete: [],
      fors: {},
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const selectedId = match.params.id;
    if (selectedId) {
      const selectedIdInt = parseInt(selectedId, 10);
      this.populateDetailsForEdit(selectedIdInt);
    }
  }

  showModal = (name, id) => {
    switch (name) {
      case MODAL_EDIT_SPECIES:
        this.setState({
          showModalSpecies: true,
          modalSpeciesEditId: id,
        });
        break;
      case MODAL_DELETE_SPECIES:
        this.setState({ showModalDelete: true });
        break;
      default:
        break;
    }
  };

  hideModal = (repopulate = true) => {
    const { onTableChange } = this.props;
    const { species } = this.state;
    onTableChange(undefined, {});

    const id = repopulate ? species.id : undefined;
    this.populateDetailsForEdit(id);
    this.setState({
      showModalSpecies: false,
      showModalDelete: false,
    });
  };

  deleteRecord = async (id) => {
    const { accessToken, history } = this.props;
    try {
      await checklistFacade.deleteSpecies({ id, accessToken });
      history.push('/names');
      this.hideModal(false);
      notifications.success('Succesfully deleted');
    } catch (e) {
      notifications.error('Error deleting record');
      throw e;
    }
  };

  populateDetailsForEdit = async (id) => {
    let species = {};
    let listOfSpecies = [];
    let synonyms = {};
    let fors = {};
    let tableRowsSelected = [];

    if (id) {
      const { accessToken } = this.props;

      species = await checklistFacade.getSpeciesByIdWithFilter(id, accessToken);
      listOfSpecies = await checklistFacade.getAllSpecies(accessToken);

      synonyms = await checklistFacade.getSynonyms(id, accessToken);
      fors = await checklistFacade.getBasionymsFor(id, accessToken);

      tableRowsSelected = [id];
    }

    this.setState({
      species,
      listOfSpecies,
      tableRowsSelected,
      synonymIdsToDelete: [],
      fors,
      synonyms,
    });
  };

  handleSpeciesChange = (updatedSpecies) => this.setState({
    species: updatedSpecies,
  });

  handleSynonymsChange = (newSynonyms, synonymIdsToDelete) => this.setState({
    synonyms: newSynonyms,
    synonymIdsToDelete,
  });

  render() {
    const {
      data, onTableChange, history, accessToken,
    } = this.props;
    const {
      tableRowsSelected,
      species,
      fors,
      synonyms,
      synonymIdsToDelete,
      listOfSpecies,
      modalSpeciesEditId,
      showModalSpecies,
      showModalDelete,
    } = this.state;
    const { id: speciesId } = species;

    const selectRowProperties = selectRow(history, this.populateDetailsForEdit);
    const tableRowSelectedProps = {
      ...selectRowProperties,
      selected: tableRowsSelected,
    };
    return (
      <div id="names">
        <Grid>
          <div id="functions">
            <Button
              bsStyle="success"
              onClick={() => this.showModal(MODAL_EDIT_SPECIES)}
            >
              <Glyphicon glyph="plus" />
              {' '}
              Add new
            </Button>
          </div>
          <h2>Names</h2>
        </Grid>
        <Grid fluid>
          <Row>
            <Col sm={6} id="species-list">
              <div className="scrollable scrollable-higher">
                <BootstrapTable
                  hover
                  striped
                  condensed
                  keyField="id"
                  rowClasses="as-pointer"
                  data={formatTableRow(data)}
                  columns={columns}
                  filter={filterFactory()}
                  selectRow={tableRowSelectedProps}
                  onTableChange={onTableChange}
                />
              </div>
            </Col>
            <Col sm={6} id="species-detail">
              <ChecklistDetail
                species={species}
                fors={fors}
                synonyms={synonyms}
                synonymIdsToDelete={synonymIdsToDelete}
                listOfSpecies={listOfSpecies}
                accessToken={accessToken}
                onShowEditModal={() => this.showModal(
                  MODAL_EDIT_SPECIES,
                  speciesId,
                )}
                onShowDeleteModal={() => this.showModal(MODAL_DELETE_SPECIES)}
                onSpeciesChange={this.handleSpeciesChange}
                onSynonymsChange={this.handleSynonymsChange}
                onDetailsChanged={() => onTableChange(undefined, {})}
              />
            </Col>
          </Row>
        </Grid>
        <SpeciesNameModal
          id={MODAL_EDIT_SPECIES}
          editId={modalSpeciesEditId}
          show={showModalSpecies}
          onHide={this.hideModal}
        />
        <DeleteSpeciesModal
          id={MODAL_DELETE_SPECIES}
          show={showModalDelete}
          onCancel={this.hideModal}
          onConfirm={() => this.deleteRecord(speciesId)}
        />
        <NotificationContainer />
      </div>
    );
  }
}

export default TabledPage({
  getAll: config.uris.listOfSpeciesUri.getAllWOrderUri,
  getCount: config.uris.listOfSpeciesUri.countUri,
})(Checklist);

Checklist.propTypes = {
  data: PropTypes.arrayOf(SpeciesType.type).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  accessToken: PropTypes.string.isRequired,
  onTableChange: PropTypes.func.isRequired,
};
