import React from 'react';

import { Row, Col, Checkbox } from 'react-bootstrap';

import PropTypes from 'prop-types';

const CdataColumnsToggleList = ({
  columns,
  onColumnToggle,
  toggles,
}) => (
  <div>
    <Row>
      <Col md={6}>
        {
          columns
            .map((column) => ({
              ...column,
              toggle: toggles[column.dataField],
            }))
            .map((column) => (
              <Checkbox
                value={column.dataField}
                key={column.dataField}
                checked={!!column.toggle}
                aria-pressed={column.toggle ? 'true' : 'false'}
                onChange={() => onColumnToggle(column.dataField)}
              >
                {column.text}
              </Checkbox>
            ))
        }
      </Col>
    </Row>
  </div>
);

export default CdataColumnsToggleList;

CdataColumnsToggleList.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    dataField: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  onColumnToggle: PropTypes.func.isRequired,
  toggles: PropTypes.objectOf(PropTypes.bool).isRequired,
};
