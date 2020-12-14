import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { NotificationContainer } from 'react-notifications';

import {
  setExportCdata, setCdataNeedsRefresh,
} from '../../../actions';

import LosName from '../../segments/LosName';

import {
  filterUtils, formatterUtils, helperUtils, utils,
} from '../../../utils';
import config from '../../../config';

import ExportToggles from './components/ExportToggles';
import SelectCdataTableColumnsModal
  from './modals/SelectCdataTableColumnsModal';

import ExportDataModal from './modals/ExportDataModal';
import RemotePagination from '../../segments/RemotePagination';

import commonHooks from '../../segments/hooks';

import { crecordFacade } from '../../../facades';

const PAGE_DETAIL = '/names/';
const EDIT_RECORD = '/chromosome-data/edit/';
const NEW_RECORD = '/chromosome-data/new';

// eslint-disable-next-line max-len
const GEOG_POINT_REGEX = /POINT\((?<lon>(-?\d+(\.\d+)?)) (?<lat>(-?\d+(\.\d+)?))/;

const EXPORT_ALL_VALUE = 'all';

const addPrefixToFilter = (filterKey, filterVal) => {
  const complexColumn = config.nomenclature.filter.columnMap[filterKey];
  if (complexColumn) {
    const { prefix: colPrefix } = complexColumn;
    return { ...filterVal, prefix: colPrefix };
  }
  return filterVal;
};

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

const Cdata = () => {
  const [tableColumns, setTableColumns] = useState(columns);
  const [showModalExport, setShowModalExport] = useState(false);
  const [showModalColumns, setShowModalColumns] = useState(false);

  const accessToken = useSelector((state) => state.authentication.accessToken);
  const exportedCdata = useSelector((state) => state.exportData.cdata);
  const needsRefresh = useSelector((state) => state.cdataRefresh.needsRefresh);
  const dispatch = useDispatch();

  // needsRefresh is in local redux store
  // currently needsRefresh = true is set in Coordinates page
  useEffect(() => {
    const doRefresh = async () => {
      if (needsRefresh) {
        await crecordFacade.refreshAdminView(accessToken);
        dispatch(setCdataNeedsRefresh(false));
      }
    };
    doRefresh();
  }, [needsRefresh, accessToken, dispatch]);

  const {
    page, sizePerPage, where, order, setValues,
  } = commonHooks.useTableChange();

  const { data, totalSize } = commonHooks.useTableData(
    getCountUri, getAllUri, accessToken, where, page,
    sizePerPage, order, showModalExport,
  );

  const handleColumnToggle = (toggledDataField) => {
    const newTableColumns = tableColumns.map((val) => {
      if (val.dataField === toggledDataField) {
        return {
          ...val,
          hidden: !val.hidden,
        };
      }
      return val;
    });
    setTableColumns(newTableColumns);
  };

  const onAddToExport = (e, ids) => {
    let exportedIds = ids.includes(EXPORT_ALL_VALUE) ? [] : [...exportedCdata]; // when adding "all", remove all others

    const { checked } = e.target;
    for (const id of ids) {
      if (checked && !exportedIds.includes(id)) {
        if (id !== EXPORT_ALL_VALUE) {
          exportedIds.push(parseInt(id, 10));
        } else {
          exportedIds.push(EXPORT_ALL_VALUE);
        }
      } else {
        exportedIds = exportedIds.filter((item) => item !== id);
      }
    }

    dispatch(setExportCdata(exportedIds));
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

  const hideModal = () => {
    setShowModalExport(false);
    setShowModalColumns(false);
  };

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
    // add relevant prefix to complex column filters
    const newFilters = filterUtils.applyToFilters(filters, addPrefixToFilter);

    return setValues({
      page: pageTable,
      sizePerPage: sizePerPageTable,
      filters: newFilters,
      sortField: newSortField,
      sortOrder,
      prefix,
      defaultOrderField: 'id',
    });
  };

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
              {' '}
              Export
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
          columns={tableColumns}
        >
          {({ baseProps, columnToggleProps }) => (
            <div>
              <Button
                bsStyle="primary"
                onClick={() => setShowModalColumns(true)}
              >
                Display columns
                {' '}
                <Glyphicon glyph="menu-down" />
              </Button>
              <ExportToggles data={data} onAddToExport={onAddToExport} />
              <hr />
              <RemotePagination
                remote
                hover
                striped
                condesed
                keyField={baseProps.keyField}
                columns={baseProps.columns}
                data={baseProps.data}
                onTableChange={onTableChange}
                defaultSorted={[{ dataField: 'id', order: 'asc' }]}
                filter={filterFactory()}
                page={page}
                sizePerPage={sizePerPage}
                totalSize={totalSize}
                columnToggle={baseProps.columnToggle}
              />
              <SelectCdataTableColumnsModal
                show={showModalColumns}
                onHide={hideModal}
                toggleListProps={{
                  columns: columnToggleProps.columns,
                  toggles: columnToggleProps.toggles,
                  onColumnToggle: handleColumnToggle,
                }}
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

export default Cdata;
