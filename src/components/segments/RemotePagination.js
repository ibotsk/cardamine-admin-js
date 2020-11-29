/* eslint-disable react/forbid-prop-types */
import React from 'react';

import { Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory,
{
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone,
} from 'react-bootstrap-table2-paginator';

import PropTypes from 'prop-types';

import config from '../../config';

const { pagination: paginationConfig } = config;

const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    Showing
    {' '}
    {from}
    {' '}
    to
    {' '}
    {to}
    {' '}
    of
    {' '}
    {size}
    {' '}
    results
  </span>
);

const TotalAndPaginator = ({ paginationProps }) => (
  <Row>
    <Col md={6}>
      <PaginationTotalStandalone
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...paginationProps}
      />
    </Col>
    <Col md={6}>
      <PaginationListStandalone
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...paginationProps}
      />
    </Col>
  </Row>
);

const RemotePagination = ({
  remote,
  striped,
  hover,
  condensed,
  id,
  tableClasses,
  keyField,
  data,
  columns,
  filter,
  defaultSorted,
  rowEvents,
  rowClasses,
  page,
  sizePerPage,
  totalSize,
  onTableChange,
  cellEdit,
  columnToggle,
}) => (
  <div>
    <PaginationProvider
      pagination={
        paginationFactory({
          ...paginationConfig,
          custom: true,
          paginationTotalRenderer: customTotal,
          page,
          sizePerPage,
          totalSize,
        })
      }
    >
      {
        ({
          paginationProps,
          paginationTableProps,
        }) => (
          <div>
            <TotalAndPaginator paginationProps={paginationProps} />
            <BootstrapTable
              remote={remote}
              striped={striped}
              hover={hover}
              condensed={condensed}
              id={id}
              classes={tableClasses}
              keyField={keyField}
              data={data}
              columns={columns}
              filter={filter}
              defaultSorted={defaultSorted}
              rowEvents={rowEvents}
              rowClasses={rowClasses}
              onTableChange={onTableChange}
              cellEdit={cellEdit}
              columnToggle={columnToggle}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...paginationTableProps}
            />
            <TotalAndPaginator paginationProps={paginationProps} />
          </div>
        )
      }
    </PaginationProvider>
  </div>
);

export default RemotePagination;

RemotePagination.propTypes = {
  cellEdit: PropTypes.object,
  columnToggle: PropTypes.shape({
    toggles: PropTypes.object.isRequired,
  }),
  columns: PropTypes.arrayOf(PropTypes.shape({
    dataField: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  condensed: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultSorted: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object,
  id: PropTypes.string,
  keyField: PropTypes.string,
  hover: PropTypes.bool,
  onTableChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  remote: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.object,
  ]).isRequired,
  rowClasses: PropTypes.func,
  rowEvents: PropTypes.object,
  sizePerPage: PropTypes.number.isRequired,
  striped: PropTypes.bool,
  tableClasses: PropTypes.string,
  totalSize: PropTypes.number.isRequired,
};

RemotePagination.defaultProps = {
  cellEdit: undefined,
  columnToggle: undefined,
  condensed: false,
  defaultSorted: undefined,
  filter: undefined,
  hover: false,
  id: undefined,
  keyField: undefined,
  rowClasses: undefined,
  rowEvents: undefined,
  striped: false,
  tableClasses: undefined,
};

TotalAndPaginator.propTypes = {
  paginationProps: PropTypes.object.isRequired,
};
