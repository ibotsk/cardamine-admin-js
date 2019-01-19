import React, { Component } from 'react';
import axios from 'axios';
import template from 'url-template';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import helper from '../../utils/helper';
import config from '../../config/config';

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
        Showing {from} to {to} of {size} Results
    </span>
);
const paginationOptions = config.pagination;
paginationOptions.paginationTotalRenderer = customTotal;

const TabledPage = injectedProps => WrappingComponent => {

    return class extends Component {

        constructor(props) {
            super(props);

            this.getAllUri = template.parse(injectedProps.getAll);
            this.getCountUri = template.parse(injectedProps.getCount);
            this.state = {
                records: [],
                totalSize: 0,
                page: 1,
                sizePerPage: paginationOptions.sizePerPageList[0].value,
                where: {}
            }
        }

        handleTableChange = (type, { page = this.state.page, sizePerPage = this.state.sizePerPage, filters = {} }) => {
            const where = helper.makeWhere(filters); //TODO make function to take into account existing where
            this.handleChange(page, sizePerPage, where);
        }

        handleChange = (page, sizePerPage, where) => {
            return this.fetchCount(where).then(() => {
                const offset = (page - 1) * sizePerPage;
                return this.fetchRecords(where, offset, sizePerPage);
            }).then(response => {
                // const records = injectedProps.formatResult(response.data);
                const records = response.data;
                this.setState({
                    records,
                    sizePerPage,
                    page,
                    where
                });
            }).catch(e => console.error(e));
        }

        fetchRecords = (where, offset, limit) => {
            const uri = this.getAllUri.expand({ offset: offset, where: JSON.stringify(where), limit: limit });
            return axios.get(uri);
        }

        fetchCount = (where) => {
            const whereString = JSON.stringify(where);
            const uri = this.getCountUri.expand({ base: config.uris.backendBase, whereString: whereString });
            return axios.get(uri).then(response => this.setState({
                totalSize: response.data.count
            }));
        }

        componentDidMount() {
            this.handleChange(this.state.page, paginationOptions.sizePerPageList[0].value, this.state.where);
        }

        render() {
            const { page, sizePerPage, totalSize } = this.state;
            const allPaginationOptions = { ...paginationOptions, page, sizePerPage, totalSize };
            return (
                <WrappingComponent
                    {...this.props}
                    onTableChange={this.handleTableChange}
                    paginationOptions={allPaginationOptions}
                    data={this.state.records}
                />
            );
        }

    }

}

export default TabledPage;