import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Grid, Glyphicon } from 'react-bootstrap';

import filterFactory, { multiSelectFilter, textFilter }
  from 'react-bootstrap-table2-filter';

import RemotePagination from '../../segments/RemotePagination';
import PublicationModal from './modals/PublicationModal';

import { helperUtils } from '../../../utils';
import config from '../../../config';

import commonHooks from '../../segments/hooks';

const {
  nomenclature,
  uris,
  mappings,
} = config;

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'action',
    text: 'Actions',
  },
  {
    dataField: 'displayType',
    text: 'Type',
    formatter: (cell) => mappings.displayType[cell].name,
    filter: multiSelectFilter({
      options: Object.keys(mappings.displayTypeStringToId).reduce(
        (ret, key) => ({
          ...ret,
          [mappings.displayTypeStringToId[key]]: key,
        }), {},
      ),
    }),
    sort: true,
  },
  {
    dataField: 'literature',
    text: 'Publication',
    formatter: (cell) => helperUtils.parsePublication(cell),
    filter: textFilter(),
    sort: true,
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
  displayType: l.displayType,
  literature: l,
}));

const getAllUri = uris.literaturesUri.getAllWFilterUri;
const getCountUri = uris.literaturesUri.countUri;

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
  }) => {
    let newSortField = sortField;

    const newSortFieldObj = nomenclature.filter.columnMap[sortField];
    if (newSortFieldObj) {
      newSortField = newSortFieldObj.filter;
    }
    return setValues({
      page: pageTable,
      sizePerPage: sizePerPageTable,
      filters,
      sortField: newSortField,
      sortOrder,
    });
  };

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
          defaultSorted={[{ dataField: 'literature', order: 'asc' }]}
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
