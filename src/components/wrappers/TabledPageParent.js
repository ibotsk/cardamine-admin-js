import React, { Component } from 'react';

import PropTypes from 'prop-types';

// eslint-disable-next-line max-len
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import tablesService from '../../services/tables';

import whereHelper from '../../utils/where';
import config from '../../config/config';

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
    Results
  </span>
);
const paginationOptions = config.pagination;
paginationOptions.paginationTotalRenderer = customTotal;

const TabledPage = (injectedProps) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (WrappedComponent) => {
    const hoc = class extends Component {
      constructor(props) {
        super(props);

        this.state = {
          records: [],
          totalSize: 0,
          page: 1,
          sizePerPage: paginationOptions.sizePerPageList[0].value,
          where: {},
        };
      }

      componentDidMount() {
        const { page: propPage, pageSize } = this.props;
        const { page, sizePerPage, where } = this.state;

        let currentPage = page;
        let currentPageSize = sizePerPage;
        if (propPage && pageSize) {
          currentPage = propPage;
          currentPageSize = pageSize;
        }
        this.handleChange(currentPage, currentPageSize, where);
      }

      handleTableChange = async (type, { page, sizePerPage, filters = {} }) => {
        // TODO make function to take into account existing where
        const where = whereHelper.makeWhereFromFilter(filters);
        await this.handleChange(page, sizePerPage, where);
      };

      handleChange = async (page, sizePerPage, where) => {
        await this.fetchCount(where);
        const offset = (page - 1) * sizePerPage;
        const records = await this.fetchRecords(where, offset, sizePerPage);
        this.setState({
          records,
          sizePerPage,
          page,
          where,
        });
      };

      fetchRecords = async (where, offset, limit) => {
        const { accessToken } = this.props;

        return tablesService.getAll(
          injectedProps.getAll,
          offset,
          where,
          limit,
          accessToken,
        );
      };

      fetchCount = async (where) => {
        const { accessToken } = this.props;

        const whereString = JSON.stringify(where);
        const countResponse = await tablesService.getCount(
          injectedProps.getCount,
          whereString,
          accessToken,
        );
        this.setState({
          totalSize: countResponse.count,
        });
      };

      render() {
        const {
          page, sizePerPage, totalSize, records,
        } = this.state;
        const allPaginationOptions = {
          ...paginationOptions,
          page,
          sizePerPage,
          totalSize,
        };
        return (
          <WrappedComponent
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...this.props}
            onTableChange={this.handleTableChange}
            paginationOptions={allPaginationOptions}
            data={records}
            size={totalSize}
          />
        );
      }
    };

    hoc.propTypes = {
      page: PropTypes.number.isRequired,
      pageSize: PropTypes.number.isRequired,
      accessToken: PropTypes.string.isRequired,
    };

    return hoc;
  };

export default TabledPage;

TabledPage.propTypes = {
  WrappedComponent: PropTypes.element,
};
