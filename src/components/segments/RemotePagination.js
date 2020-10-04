/* eslint-disable react/forbid-prop-types */
import React from 'react';

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
  rowEvents,
  rowClasses,
  page,
  sizePerPage,
  totalSize,
  onTableChange,
  cellEdit,
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
            <div>
              <PaginationTotalStandalone
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...paginationProps}
              />
            </div>
            <div>
              <PaginationListStandalone
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...paginationProps}
              />
            </div>
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
              rowEvents={rowEvents}
              rowClasses={rowClasses}
              onTableChange={onTableChange}
              cellEdit={cellEdit}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...paginationTableProps}
            />
          </div>
        )
      }
    </PaginationProvider>
  </div>
);

export default RemotePagination;

RemotePagination.propTypes = {
  remote: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.object,
  ]).isRequired,
  striped: PropTypes.bool,
  hover: PropTypes.bool,
  condensed: PropTypes.bool,
  id: PropTypes.string,
  tableClasses: PropTypes.string,
  keyField: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    dataField: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  rowEvents: PropTypes.object,
  rowClasses: PropTypes.func,
  page: PropTypes.number.isRequired,
  sizePerPage: PropTypes.number.isRequired,
  totalSize: PropTypes.number.isRequired,
  onTableChange: PropTypes.func.isRequired,
  cellEdit: PropTypes.object,
};

RemotePagination.defaultProps = {
  striped: false,
  hover: false,
  condensed: false,
  id: undefined,
  tableClasses: undefined,
  rowEvents: undefined,
  rowClasses: undefined,
  keyField: undefined,
  cellEdit: undefined,
};
