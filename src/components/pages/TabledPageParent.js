import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import axios from 'axios';
import template from 'url-template';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

// import Filter from '../segments/Filter';

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
                numOfRecords: 0,
                activePage: 1,
                sizePerPage: paginationOptions.sizePerPageList[0].value,
                where: {}
            }
        }

        handleTableChange(type, { page, sizePerPage }) {
            this.handleChange(page, sizePerPage, this.state.where);
            this.setState({ activePage: page });
        }

        // handleFilterChange(where) {
        //     this.handleChange(this.state.activePage, where);
        //     this.setState({ where: where });
        // }

        handleChange(page, sizePerPage, where) {
            return this.fetchCount(where).then(() => {
                // const page = Math.max(activePage - 1, 0);
                const offset = (page - 1) * sizePerPage;
                return this.fetchRecords(where, offset, sizePerPage);
            }).then(response => {
                const noms = injectedProps.formatResult(response);
                this.setState({ records: noms });
            }).catch(e => console.error(e));
        }

        fetchRecords(where, offset, limit) {
            const uri = this.getAllUri.expand({ offset: offset, where: JSON.stringify(where), limit: limit });
            return axios.get(uri);
        }

        fetchCount(where) {
            const whereString = JSON.stringify(where);
            const uri = this.getCountUri.expand({ base: config.uris.backendBase, whereString: whereString });
            return axios.get(uri).then(response => this.setState({ numOfRecords: response.data.count }));
        }

        componentDidMount() {
            this.handleChange(this.state.activePage, paginationOptions.sizePerPageList[0].value, this.state.where);
        }

        render() {
            const paginationCurrents = { page: this.state.activePage, sizePerPage: this.state.sizePerPage, totalSize: this.state.numOfRecords };
            return (
                <WrappingComponent>
                    <Grid id="old-functions">
                        {/* <Filter
                            include={injectedProps.filterInclude}
                            onHandleChange={(where) => this.handleFilterChange(where)}
                            searchFields={injectedProps.searchFields}
                            searchFieldMinLength={config.format.searchFieldMinLength}
                        /> */}
                    </Grid>
                    <Grid fluid={true}>
                        <BootstrapTable
                            remote
                            keyField='id'
                            data={this.state.records}
                            columns={injectedProps.columns}
                            onTableChange={(type, opts) => this.handleTableChange(type, opts)}
                            pagination={paginationFactory({ ...paginationOptions, ...paginationCurrents })}
                        />
                    </Grid>
                </WrappingComponent>
            );
        }

    }

}

export default TabledPage;