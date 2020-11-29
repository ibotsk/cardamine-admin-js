import React, { useState } from 'react';

import { Row, Col, Checkbox } from 'react-bootstrap';

import PropTypes from 'prop-types';

const EXPORT_PAGE = 'exportPage';
const EXPORT_ALL = 'exportAll';
const EXPORT_ALL_VALUE = 'all';

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

export default ExportToggles;

ExportToggles.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  })).isRequired,
  onAddToExport: PropTypes.func.isRequired,
};
