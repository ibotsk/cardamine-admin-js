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
import SpeciesType from '../propTypes/species';

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

const GEOG_POINT_REGEX = /POINT\((\d+\.\d+) (\d+\.\d+)/;

const { ToggleList } = ColumnToggle;

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    filter: textFilter(),
    headerStyle: { width: '80px' },
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
  },
  {
    dataField: 'lastRevision',
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
  },
  {
    dataField: 'fullPublication',
    text: 'Publication',
    hidden: false,
    formatter: (cell) => helperUtils.parsePublication(cell),
  },
  {
    dataField: 'publicationAuthor',
    text: 'Publ. author',
    hidden: true,
  },
  {
    dataField: 'year',
    text: 'Year',
    hidden: true,
  },
  {
    dataField: 'n',
    text: 'n',
    hidden: true,
  },
  {
    dataField: 'dn',
    text: '2n',
  },
  {
    dataField: 'ploidy',
    text: 'Ploidy',
    hidden: true,
  },
  {
    dataField: 'ploidyRevised',
    text: 'Ploidy revised',
    hidden: true,
  },
  {
    dataField: 'xRevised',
    text: 'x revised',
    hidden: true,
  },
  {
    dataField: 'countedBy',
    text: 'Counted by',
    hidden: true,
  },
  {
    dataField: 'countedDate',
    text: 'Counted date',
    hidden: true,
  },
  {
    dataField: 'nOfPlants',
    text: 'N. of plants',
    hidden: true,
  },
  {
    dataField: 'note',
    text: 'Note',
    hidden: true,
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
  },
  {
    dataField: 'depositedIn',
    text: 'Deposited in',
    hidden: true,
  },
  {
    dataField: 'w4',
    text: 'W4',
  },
  {
    dataField: 'country',
    text: 'Country',
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
  const { coordinatesLatOrig, coordinatesLonOrig, coordinatesGeoref } = d;

  let latitudeString = '';
  let longitudeString = '';

  if (coordinatesGeoref) {
    const found = coordinatesGeoref.match(GEOG_POINT_REGEX); // 0: full match, 1: lon, 2: lat
    latitudeString = `${found[2]} (gr)`;
    longitudeString = `${found[1]} (gr)`;
  } else if (coordinatesLatOrig && coordinatesLonOrig) {
    latitudeString = `${coordinatesLatOrig} (orig)`;
    longitudeString = `${coordinatesLonOrig} (orig)`;
  }

  return {
    id: d.id,
    inExport: (
      <Checkbox
        name={`${d.id}isExported`}
        checked={isExported(d.id)}
        onChange={(e) => onAddToExport(e, [d.id])}
      />
    ),
    action: (
      <LinkContainer to={`${EDIT_RECORD}${d.id}`}>
        <Button bsStyle="warning" bsSize="xsmall">
          Edit
        </Button>
      </LinkContainer>
    ),
    originalIdentification: utils.getObjWKeysThatStartWithStr(d, 'original_'),
    lastRevision: utils.getObjWKeysThatStartWithStr(d, 'latestRevision_'),
    fullPublication: utils.getObjWKeysThatStartWithStr(d, 'literature_'),
    publicationAuthor: d.literature_paperAuthor,
    year: d.literature_year,
    n: d.n,
    dn: d.dn,
    ploidy: d.ploidyLevel,
    ploidyRevised: d.ploidyLevelRevised,
    xRevised: d.xRevised,
    countedBy: d.countedBy,
    countedDate: d.countedDate,
    nOfPlants: d.numberOfAnalysedPlants,
    note: d.note,
    eda: {
      ambiguous: d.ambiguous,
      doubtful: d.doubtful,
      erroneous: d.erroneous,
    },
    duplicate: d.duplicate,
    depositedIn: d.depositedIn,
    w4: d.worldL4,
    country: d.country,
    latitude: latitudeString,
    longitude: longitudeString,
    localityDescription: d.localityDescription,
  };
});

const getCountUri = config.uris.chromosomeDataUri.countUri;
const getAllUri = config.uris.chromosomeDataUri.getAllWFilterUri;

// class Cdata extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       toggles: getInitialToggles(columns),
//       exportPage: false,
//       exportAll: false,
//     };
//   }
const Cdata = ({ exportedCdata, onAddToCdataExport, accessToken }) => {
  const [toggles, setToggles] = useState(getInitialToggles(columns));
  const [exportPage, setExportPage] = useState(false);
  const [exportAll, setExportAll] = useState(false);
  const [showModalExport, setShowModalExport] = useState(false);

  const {
    page, sizePerPage, where, order, setValues,
  } = commonHooks.useTableChange();

  const { data, totalSize } = commonHooks.useTableData(
    getCountUri, getAllUri, accessToken, where, page,
    sizePerPage, order, showModalExport,
  );

  // onTableChangeWithDispatch = (type, newState) => {
  //   const { onChangePage, onTableChange } = this.props;
  //   onChangePage(newState.page, newState.sizePerPage);
  //   onTableChange(type, newState);
  // };

  const onColumnToggleWithDispatch = (tkProps, param) => {
    tkProps.columnToggleProps.onColumnToggle(param);
    setToggles(tkProps.columnToggleProps.toggles);
    // this.setState({
    //   toggles: tkProps.columnToggleProps.toggles,
    // });
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
        exportedIds.push(id);
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

  const ExportToggles = ({ onAddToExport }) => {
    const onChangeCheckboxPage = (e) => {
      const idsOnPage = data.map((d) => d.id);
      onAddToExport(e, idsOnPage);
      setExportPage(e.target.checked);
      setExportAll(false);
      // this.setState({ exportPage: e.target.checked, exportAll: false });
    };
    const onChangeCheckboxAll = (e) => {
      onAddToExport(e, [EXPORT_ALL_VALUE]);
      setExportPage(e.target.checked);
      setExportAll(false);
      // this.setState({ exportAll: e.target.checked, exportPage: false });
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
              <ExportToggles onAddToExport={onAddToExport} />
              <BootstrapTable
                hover
                striped
                condensed
                remote
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...tkProps.baseProps}
                // remote={{ filter: true, pagination: true }}
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
  // data: PropTypes.arrayOf(SpeciesType.type).isRequired,
  // paginationOptions: PropTypes.shape({
  //   page: PropTypes.number.isRequired,
  // }).isRequired,
  exportedCdata: PropTypes.arrayOf(PropTypes.number),
  // totalSize: PropTypes.number.isRequired,
  accessToken: PropTypes.string.isRequired,
  onChangePage: PropTypes.func.isRequired,
  // onTableChange: PropTypes.func.isRequired,
  onAddToCdataExport: PropTypes.func.isRequired,
};

Cdata.defaultProps = {
  exportedCdata: [],
};
