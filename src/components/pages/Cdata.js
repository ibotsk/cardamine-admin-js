import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
  Grid,
  Row,
  Col,
  Badge,
  Button,
  Glyphicon,
  Checkbox,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table2-toolkit';

import { NotificationContainer } from 'react-notifications';

import PropTypes from 'prop-types';

import { setPagination, setExportCdata } from '../../actions';

import LosName from '../segments/LosName';

import { formatterUtils, helperUtils, utils } from '../../utils';
import config from '../../config';

import ExportDataModal from '../segments/modals/ExportDataModal';

import commonHooks from '../segments/hooks';

const PAGE_DETAIL = '/names/';
const EDIT_RECORD = '/chromosome-data/edit/';
const NEW_RECORD = '/chromosome-data/new';

const EXPORT_PAGE = 'exportPage';
const EXPORT_ALL = 'exportAll';
const EXPORT_ALL_VALUE = 'all';

const GEOG_POINT_REGEX = /POINT\((?<lon>(\d+(\.\d+)?)) (?<lat>(\d+(\.\d+)?))/; // /POINT\((\d+\.\d+) (\d+\.\d+)/;

const { ToggleList } = ColumnToggle;

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    filter: textFilter(),
    headerStyle: { width: '80px' },
    sort: true,
  },
  {
    dataField: 'inExport',
    text: 'Add to export',
  },
  {
    dataField: 'action',
    text: 'Action',
  },
  {
    dataField: 'originalIdentification',
    text: 'Orig. identification',
    formatter: (cell) => (
      cell.id ? (
        <Link to={`${PAGE_DETAIL}${cell.id}`}>
          <LosName
            key={cell.id}
            data={cell}
            format="plain"
          />
        </Link>
      ) : (
        ''
      )
    ),
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'latestRevision',
    text: 'Last revision',
    formatter: (cell) => (
      cell.id ? (
        <Link to={`${PAGE_DETAIL}${cell.id}`}>
          <LosName
            key={cell.id}
            data={cell}
            format="plain"
          />
        </Link>
      ) : (
        ''
      )
    ),
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'literature',
    text: 'Publication',
    formatter: (cell) => helperUtils.parsePublication(cell),
    filter: textFilter(),
    hidden: false,
    sort: true,
  },
  {
    dataField: 'literature_paperAuthor',
    text: 'Publ. author',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'literature_year',
    text: 'Year',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'n',
    text: 'n',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'dn',
    text: '2n',
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'ploidyLevel',
    text: 'Ploidy',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'ploidyLevelRevised',
    text: 'Ploidy revised',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'xRevised',
    text: 'x revised',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'countedBy',
    text: 'Counted by',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'countedDate',
    text: 'Counted date',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'numberOfAnalysedPlants',
    text: 'N. of plants',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'note',
    text: 'Note',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'eda',
    text: 'E/D/A',
    hidden: true,
    formatter: (cell) => formatterUtils.eda(cell),
  },
  {
    dataField: 'duplicate',
    text: 'Duplicate',
    hidden: true,
    sort: true,
  },
  {
    dataField: 'depositedIn',
    text: 'Deposited in',
    filter: textFilter(),
    hidden: true,
    sort: true,
  },
  {
    dataField: 'worldL4',
    text: 'W4',
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'country',
    text: 'Country',
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'latitude',
    text: 'Latitude',
  },
  {
    dataField: 'longitude',
    text: 'Longitude',
  },
  {
    dataField: 'localityDescription',
    text: 'Loc. description',
  },
];

const getInitialToggles = (toggledColumns) => toggledColumns
  .reduce((obj, el) => {
    const key = el.dataField;
    return {
      ...obj,
      [key]: !el.hidden,
    };
  },
  {});

const formatResult = (data, { onAddToExport, isExported }) => data.map((d) => {
  const {
    id,
    coordinatesLatOrig, coordinatesLonOrig, coordinatesGeoref,
    ambiguous, doubtful, erroneous, ...origValues
  } = d;

  let latitudeString = '';
  let longitudeString = '';

  if (coordinatesGeoref) {
    const found = coordinatesGeoref.match(GEOG_POINT_REGEX); // 0: full match, 1: lon, 2: lat
    if (!found) {
      throw new Error(`${coordinatesGeoref} not parsed correctly`);
    }
    latitudeString = `${found.groups.lat} (gr)`;
    longitudeString = `${found.groups.lon} (gr)`;
  } else if (coordinatesLatOrig && coordinatesLonOrig) {
    latitudeString = `${coordinatesLatOrig} (orig)`;
    longitudeString = `${coordinatesLonOrig} (orig)`;
  }

  return {
    ...origValues,
    id,
    inExport: (
      <Checkbox
        name={`${id}isExported`}
        checked={isExported(id)}
        onChange={(e) => onAddToExport(e, [id])}
      />
    ),
    action: (
      <LinkContainer to={`${EDIT_RECORD}${id}`}>
        <Button bsStyle="warning" bsSize="xsmall">
          Edit
        </Button>
      </LinkContainer>
    ),
    originalIdentification: utils.getObjWKeysThatStartWithStr(d, 'original_'),
    latestRevision: utils.getObjWKeysThatStartWithStr(d, 'latestRevision_'),
    literature: utils.getObjWKeysThatStartWithStr(d, 'literature_'),
    eda: {
      ambiguous: d.ambiguous,
      doubtful: d.doubtful,
      erroneous: d.erroneous,
    },
    latitude: latitudeString,
    longitude: longitudeString,
    localityDescription: d.localityDescription,
  };
});

const getCountUri = config.uris.chromosomeDataUri.countUri;
const getAllUri = config.uris.chromosomeDataUri.getAllWFilterUri;

const ExportToggles = ({ data, onAddToExport }) => {
  const [exportPage, setExportPage] = useState(false);
  const [exportAll, setExportAll] = useState(false);

  const onChangeCheckboxPage = (e) => {
    const idsOnPage = data.map((d) => d.id);
    onAddToExport(e, idsOnPage);
    setExportPage(e.target.checked);
    setExportAll(false);
  };
  const onChangeCheckboxAll = (e) => {
    onAddToExport(e, [EXPORT_ALL_VALUE]);
    setExportPage(e.target.checked);
    setExportAll(false);
  };

  return (
    <Row>
      <Col xs={12}>
        <Checkbox
          name={EXPORT_PAGE}
          checked={exportPage}
          onChange={(e) => onChangeCheckboxPage(e)}
        >
          Add
          {' '}
          <b>all records on this page</b>
          {' '}
          to export
        </Checkbox>
        <Checkbox
          name={EXPORT_ALL}
          checked={exportAll}
          onChange={(e) => onChangeCheckboxAll(e)}
        >
          Add
          {' '}
          <b>all results</b>
          {' '}
          to export
        </Checkbox>
      </Col>
    </Row>
  );
};

const Cdata = ({ exportedCdata, onAddToCdataExport, accessToken }) => {
  const [toggles, setToggles] = useState(getInitialToggles(columns));
  const [showModalExport, setShowModalExport] = useState(false);

  const {
    page, sizePerPage, where, order, setValues,
  } = commonHooks.useTableChange();

  const { data, totalSize } = commonHooks.useTableData(
    getCountUri, getAllUri, accessToken, where, page,
    sizePerPage, order, showModalExport,
  );

  const onColumnToggleWithDispatch = (tkProps, param) => {
    tkProps.columnToggleProps.onColumnToggle(param);
    setToggles(tkProps.columnToggleProps.toggles);
  };

  const onAddToExport = (e, ids) => {
    let exportedIds = ids.includes(EXPORT_ALL_VALUE) ? [] : [...exportedCdata]; // when adding "all", remove all others
    if (exportedIds.includes(EXPORT_ALL_VALUE)) {
      // remove "all" when adding specific ids
      exportedIds = [];
    }

    const { checked } = e.target;
    for (const id of ids) {
      if (checked && !exportedIds.includes(id)) {
        exportedIds.push(parseInt(id, 10));
      } else {
        exportedIds = exportedIds.filter((item) => item !== id);
      }
    }

    onAddToCdataExport(exportedIds);
  };

  const isExported = (id) => exportedCdata.includes(id)
    || exportedCdata.includes(EXPORT_ALL_VALUE);

  const getExportedCount = () => (
    exportedCdata.includes(EXPORT_ALL_VALUE) ? totalSize : exportedCdata.length
  );

  const showExportModal = () => {
    if (exportedCdata.length > 0) {
      setShowModalExport(true);
    }
  };

  const hideModal = () => setShowModalExport(false);

  const onTableChange = (type, {
    page: pageTable,
    sizePerPage: sizePerPageTable,
    filters,
    sortField,
    sortOrder,
  }) => {
    let prefix = '';
    let newSortField = sortField;

    // process coplex fields like originalIdentification, latestRevision and literature
    const newSortFieldObj = config.nomenclature.filter.columnMap[sortField];
    if (newSortFieldObj) {
      prefix = newSortFieldObj.prefix;
      newSortField = newSortFieldObj.filter;
    }
    return setValues({
      page: pageTable,
      sizePerPage: sizePerPageTable,
      filters,
      sortField: newSortField,
      sortOrder,
      prefix,
      defaultOrderField: 'id',
    });
  };

  const paginationOptions = { page, sizePerPage, totalSize };

  return (
    <div id="chromosome-data">
      <Grid id="functions">
        <Row id="functions">
          <Col md={2}>
            <LinkContainer to={NEW_RECORD}>
              <Button bsStyle="success">
                <Glyphicon glyph="plus" />
                {' '}
                Create new
              </Button>
            </LinkContainer>
          </Col>
          <Col md={2}>
            <Button
              bsStyle="primary"
              onClick={showExportModal}
              disabled={getExportedCount() === 0}
            >
              <Glyphicon glyph="export" />
              Export Export
              {' '}
              <Badge>{getExportedCount()}</Badge>
            </Button>
          </Col>
        </Row>
        <h2>Chromosome data</h2>
      </Grid>
      <Grid fluid>
        <ToolkitProvider
          columnToggle
          keyField="id"
          data={formatResult(data, {
            onAddToExport,
            isExported,
          })}
          columns={columns}
        >
          {(tkProps) => (
            <div>
              <ToggleList
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...tkProps.columnToggleProps}
                toggles={toggles || tkProps.columnToggleProps.toggles}
                onColumnToggle={(p) => onColumnToggleWithDispatch(
                  tkProps,
                  p,
                )}
              />
              <hr />
              <ExportToggles data={data} onAddToExport={onAddToExport} />
              <BootstrapTable
                hover
                striped
                condensed
                remote
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...tkProps.baseProps}
                defaultSorted={[{ dataField: 'id', order: 'asc' }]}
                filter={filterFactory()}
                onTableChange={onTableChange}
                pagination={paginationFactory(paginationOptions)}
              />
            </div>
          )}
        </ToolkitProvider>
      </Grid>
      <ExportDataModal
        show={showModalExport}
        onHide={hideModal}
        type="chromdata"
        count={exportedCdata.length}
        ids={exportedCdata}
        accessToken={accessToken}
      />
      <NotificationContainer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
  exportedCdata: state.exportData.cdata,
});

const mapDispatchToProps = (dispatch) => ({
  onChangePage: (page, pageSize) => {
    dispatch(setPagination({ page, pageSize }));
  },
  onAddToCdataExport: (ids) => {
    dispatch(setExportCdata({ ids }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cdata);

Cdata.propTypes = {
  exportedCdata: PropTypes.arrayOf(PropTypes.number),
  accessToken: PropTypes.string.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onAddToCdataExport: PropTypes.func.isRequired,
};

Cdata.defaultProps = {
  exportedCdata: [],
};

ExportToggles.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  })).isRequired,
  onAddToExport: PropTypes.func.isRequired,
};
