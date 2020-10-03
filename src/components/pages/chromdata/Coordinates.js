import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Grid, FormGroup, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import RemotePagination from '../../segments/RemotePagination';

import materialFacade from '../../../facades/material';

import whereUtils from '../../../utils/where';
import config from '../../../config/config';

const defaultSizePerPage = config.pagination.sizePerPageList[0].value;

const EDIT_RECORD = '/chromosome-data/edit/';

const RED_ROWS = 1;
const YELLOW_ROWS = 2;
const OK_ROWS = 3;

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    hidden: true,
  },
  {
    dataField: 'idCdata',
    text: 'Record ID',
  },
  {
    dataField: 'coordinatesOriginal',
    text: 'Original coordinates',
  },
  {
    dataField: 'coordinatesGeoref',
    text: 'Georeferenced coordinates',
  },
  {
    dataField: 'coordinatesForMap',
    text: 'Coordinates for map',
  },
];

const rowClasses = (row) => {
  const { coordinatesOriginal, coordinatesGeoref, coordinatesForMap } = row;
  let classes = null;

  if ((coordinatesOriginal && !coordinatesForMap)
    || (coordinatesGeoref && !coordinatesForMap)) {
    classes = 'danger';
  } else if (!coordinatesOriginal && !coordinatesGeoref && !coordinatesForMap) {
    classes = 'warning';
  }

  return classes;
};

const formatData = (data) => data.map(({
  id, idCdata, coordinatesLat, coordinatesLon,
  coordinatesGeoref = {}, coordinatesForMap = {},
}) => {
  const { coordinates: coordinatesG } = coordinatesGeoref || {};
  const { coordinates: coordinatesM } = coordinatesForMap || {};

  return {
    id,
    idCdata: (
      <Link to={`${EDIT_RECORD}${idCdata}`}>
        {idCdata}
      </Link>
    ),
    coordinatesOriginal: coordinatesLat && coordinatesLon
      ? `${coordinatesLat}, ${coordinatesLon}`
      : null,
    coordinatesGeoref: coordinatesG
      ? `${coordinatesG.lat}, ${coordinatesG.lon}`
      : null,
    coordinatesForMap: coordinatesM
      ? `${coordinatesM.lat}, ${coordinatesM.lon}`
      : null,
  };
});

const Coordinates = ({ accessToken }) => {
  const [checked, setChecked] = useState({
    [RED_ROWS]: false,
    [YELLOW_ROWS]: false,
    [OK_ROWS]: false,
  });
  const [where, setWhere] = useState({});
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(defaultSizePerPage);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const offset = (page - 1) * sizePerPage;
      const results = await materialFacade.getCoordinates(
        accessToken,
        where,
        offset,
        sizePerPage,
      );
      const totalCount = await materialFacade.getCoordinatesCount(
        where,
        accessToken,
      );
      setData(results);
      setTotalSize(totalCount);
    }

    fetchData();
  }, [accessToken, where, sizePerPage, page]);

  const handleCheckboxChange = (option) => {
    const checkedBoxes = { ...checked, [option]: !checked[option] };

    const filterWhere = whereUtils.whereCoordinates(
      checkedBoxes[RED_ROWS], checkedBoxes[YELLOW_ROWS], checkedBoxes[OK_ROWS],
    );
    setWhere(filterWhere);
    setChecked(checkedBoxes);
  };

  const handleTableChange = async (type, {
    page: currentPage, sizePerPage: currentSizePerPage,
  }) => {
    setPage(currentPage);
    setSizePerPage(currentSizePerPage);
  };

  return (
    <Grid>
      <h2>Map coordinates</h2>
      <p>
        This section helps in reviewing coordinates of the chromosome records.
        Map coordinates are used in showing a location of the chromosome record
        on the
        {' '}
        <b>public website</b>
        .
      </p>
      <ol>
        <li>
          A map coordinate must be a
          {' '}
          <b>number in degrees</b>
          {' '}
          with decimal point.
        </li>
        <li>
          By
          {' '}
          <b>default</b>
          {' '}
          they are set as
          {' '}
          <b>georeferenced coordinates</b>
          {' '}
          if a record has those,
          as they are considered the most actual information.
        </li>
        <li>
          In cases when there are only original coordinates
          (which is a free-text) a
          {' '}
          <b>manual conversion</b>
          {' '}
          is required.
        </li>
      </ol>
      <div>
        <h5>Filter:</h5>
        <FormGroup>
          <Checkbox
            onChange={() => handleCheckboxChange(RED_ROWS)}
            className="bg-danger"
          >
            Rows that require immediate attention
          </Checkbox>
          <Checkbox
            onChange={() => handleCheckboxChange(YELLOW_ROWS)}
            className="bg-warning"
          >
            Empty rows
          </Checkbox>
          <Checkbox
            onChange={() => handleCheckboxChange(OK_ROWS)}
          >
            Resolved rows
          </Checkbox>
        </FormGroup>
      </div>
      <RemotePagination
        hover
        striped
        condensed
        keyField="id"
        data={formatData(data)}
        columns={columns}
        rowClasses={rowClasses}
        page={page}
        sizePerPage={sizePerPage}
        totalSize={totalSize}
        onTableChange={handleTableChange}
      />
    </Grid>
  );
};


const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(Coordinates);

Coordinates.propTypes = {
  accessToken: PropTypes.string.isRequired,
};
