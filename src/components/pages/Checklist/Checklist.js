import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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

import SpeciesNameModal from './modals/SpeciesNameModal';

import { checklistFacade } from '../../../facades';

import { notifications, helperUtils } from '../../../utils';
import config from '../../../config';

import '../../../styles/custom.css';
import ChecklistDetail from './components/ChecklistDetail';
import DeleteSpeciesModal from './modals/DeleteSpeciesModal';
import ExportSpeciesModal from './modals/ExportSpeciesModal';

const buildNtypesOptions = (ntypes) => {
  const obj = {};
  Object.keys(ntypes).forEach((t) => {
    obj[t] = t;
  });
  return obj;
};

const ntypes = config.mappings.losType;
const ntypesFilterOptions = buildNtypesOptions(ntypes);

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    sort: true,
  },
  {
    dataField: 'ntype',
    text: 'Type',
    formatter: (cell) => (
      <span style={{ color: config.mappings.losType[cell].colour }}>
        {cell}
      </span>
    ),
    filter: multiSelectFilter({
      options: ntypesFilterOptions,
    }),
    sort: true,
  },
  {
    dataField: 'speciesName',
    text: 'Name',
    formatter: (cell, row) => helperUtils.listOfSpeciesString(row),
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'extra',
    text: '',
    formatter: () => (
      <Glyphicon glyph="chevron-right" style={{ color: '#cecece' }} />
    ),
    headerStyle: { width: '10px' },
  },
];

const selectRow = (history, onSelectedRow) => ({
  mode: 'radio',
  clickToSelect: true,
  hideSelectColumn: true,
  bgColor: '#ffea77',
  onSelect: (row) => {
    history.push(`/names/${row.id}`);
    onSelectedRow(row.id);
  },
});

const Checklist = ({ match: { params }, history }) => {
  const [showModalSpecies, setShowModalSpecies] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalExport, setShowModalExport] = useState(false);

  const selectedId = params.id ? parseInt(params.id, 10) : undefined;
  const [speciesEditId, setSpeciesEditId] = useState(selectedId);

  const [listOfSpecies, setListOfSpecies] = useState([]);
  const [species, setSpecies] = useState({});

  const [synonyms, setSynonyms] = useState({});
  const [synonymIdsToDelete, setSynonymIdsToDelete] = useState([]);
  const [fors, setFors] = useState({});

  const accessToken = useSelector((state) => state.authentication.accessToken);

  // refetch when species changes
  useEffect(() => {
    const fetch = async () => {
      const listOfSpeciesFetched = await checklistFacade.getAllSpecies(
        accessToken,
      );
      setListOfSpecies(listOfSpeciesFetched);
    };
    fetch();
  }, [species, accessToken]);

  // refetch when selected row changes and any modal closes
  useEffect(() => {
    const fetch = async () => {
      if (speciesEditId && !showModalSpecies
        && !showModalDelete && !showModalExport) {
        const speciesFetched = await checklistFacade.getSpeciesByIdWithFilter(
          speciesEditId, accessToken,
        );
        const synonymsFetched = await checklistFacade.getSynonyms(
          speciesEditId, accessToken,
        );
        const forsFetched = await checklistFacade.getBasionymsFor(
          speciesEditId, accessToken,
        );

        setSpecies(speciesFetched);
        setSynonyms(synonymsFetched);
        setFors(forsFetched);
      }
    };

    fetch();
  }, [speciesEditId, accessToken,
    showModalSpecies, showModalDelete, showModalExport]);

  const handleShowModalEditSpecies = (id) => {
    setSpeciesEditId(id);
    setShowModalSpecies(true);
  };
  const handleShowModalDelete = () => {
    setShowModalDelete(true);
  };
  const handleShowModalExport = () => {
    setShowModalExport(true);
  };

  const handleHideModal = () => {
    setShowModalSpecies(false);
    setShowModalDelete(false);
    setShowModalExport(false);
  };

  const deleteRecord = async (id) => {
    try {
      await checklistFacade.deleteSpecies(id, accessToken);
      history.push('/names');
      handleHideModal();
      notifications.success('Succesfully deleted');
    } catch (e) {
      notifications.error('Error deleting record');
      throw e;
    }
  };

  const handleSpeciesChange = (updatedSpecies) => {
    setSpecies(updatedSpecies);
  };

  const handleSynonymsChange = (newSynonyms, idsToDelete) => {
    setSynonyms(newSynonyms);
    setSynonymIdsToDelete(idsToDelete);
  };

  const selectRowProperties = selectRow(history, setSpeciesEditId);
  const tableRowSelectedProps = {
    ...selectRowProperties,
    selected: [speciesEditId].filter((i) => !!i),
  };

  const { id: speciesId } = species;

  return (
    <div id="names">
      <Grid id="functions">
        <Row>
          <Col md={2}>
            <Button
              bsStyle="success"
              onClick={() => handleShowModalEditSpecies()}
            >
              <Glyphicon glyph="plus" />
              {' '}
              Add new
            </Button>
          </Col>
          <Col md={2}>
            <Button
              bsStyle="primary"
              onClick={() => handleShowModalExport()}
            >
              <Glyphicon glyph="export" />
              {' '}
              Export
            </Button>
          </Col>
        </Row>
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
                data={listOfSpecies}
                columns={columns}
                filter={filterFactory()}
                selectRow={tableRowSelectedProps}
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
              onShowEditModal={() => handleShowModalEditSpecies(speciesId)}
              onShowDeleteModal={() => handleShowModalDelete()}
              onSpeciesChange={handleSpeciesChange}
              onSynonymsChange={handleSynonymsChange}
              onDetailsChanged={handleSpeciesChange}
            />
          </Col>
        </Row>
      </Grid>
      <SpeciesNameModal
        id="modal-edit-species"
        editId={speciesEditId}
        show={showModalSpecies}
        onHide={handleHideModal}
      />
      <DeleteSpeciesModal
        id="modal-delete-species"
        show={showModalDelete}
        onCancel={handleHideModal}
        onConfirm={() => deleteRecord(speciesId)}
      />
      <ExportSpeciesModal
        id="modal-export-species"
        show={showModalExport}
        onHide={handleHideModal}
        ids={[]} // TODO all species for now
      />
      <NotificationContainer />
    </div>
  );
};

export default Checklist;

Checklist.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
