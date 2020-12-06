import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Grid, Glyphicon } from 'react-bootstrap';

import filterFactory from 'react-bootstrap-table2-filter';

import RemotePagination from '../segments/RemotePagination';
import PublicationModal from '../segments/modals/PublicationModal';

import { helperUtils } from '../../utils';
import config from '../../config';

import commonHooks from '../segments/hooks';

const columns = [
  {
    dataField: 'id',
    text: 'ID',
  },
  {
    dataField: 'action',
    text: 'Actions',
  },
  {
    dataField: 'type',
    text: 'Type',
  },
  {
    dataField: 'publication',
    text: 'Publication',
  },
];

const formatResult = (data, onEdit) => data.map((l) => ({
  id: l.id,
  action: (
    <Button
      bsSize="xsmall"
      bsStyle="warning"
      onClick={() => onEdit(l.id)}
    >
      Edit
    </Button>
  ),
  type: config.mappings.displayType[l.displayType].name,
  publication: helperUtils.parsePublication(l),
}));

const getAllUri = config.uris.literaturesUri.getAllWFilterUri;
const getCountUri = config.uris.literaturesUri.countUri;

const Publications = () => {
  const [showModalLiterature, setShowModalLiterature] = useState(false);
  const [editId, setEditId] = useState(undefined);

  const accessToken = useSelector((state) => state.authentication.accessToken);

  const {
    page, sizePerPage, where, order, setValues,
  } = commonHooks.useTableChange();

  const { data, totalSize } = commonHooks.useTableData(
    getCountUri, getAllUri, accessToken, where, page,
    sizePerPage, order, showModalLiterature,
  );

  const handleShowModal = (id) => {
    setEditId(id);
    setShowModalLiterature(true);
  };

  const handleHideModal = async () => {
    setShowModalLiterature(false);
    setEditId(undefined);
  };

  const onTableChange = (type, {
    page: pageTable,
    sizePerPage: sizePerPageTable,
    filters,
    sortField,
    sortOrder,
  }) => (
    setValues({
      page: pageTable,
      sizePerPage: sizePerPageTable,
      filters,
      sortField,
      sortOrder,
    })
  );

  return (
    <div id="publications">
      <Grid id="functions">
        <div id="functions">
          <Button bsStyle="success" onClick={() => handleShowModal()}>
            <Glyphicon glyph="plus" />
            {' '}
            Add new
          </Button>
        </div>
        <h2>Publications</h2>
      </Grid>
      <Grid fluid>
        <RemotePagination
          remote
          hover
          striped
          condesed
          keyField="id"
          columns={columns}
          data={formatResult(data, handleShowModal)}
          onTableChange={onTableChange}
          defaultSorted={[{ dataField: 'id', order: 'asc' }]}
          filter={filterFactory()}
          page={page}
          sizePerPage={sizePerPage}
          totalSize={totalSize}
        />
      </Grid>
      <PublicationModal
        id={editId}
        show={showModalLiterature}
        onHide={handleHideModal}
      />
    </div>
  );
};

export default Publications;
