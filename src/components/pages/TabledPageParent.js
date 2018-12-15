import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import axios from 'axios';
import template from 'url-template';

import Filter from '../segments/Filter';
import CPaginator from '../segments/CPaginator';
import CTable from '../segments/CTable';

import config from '../../config/config';

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
                where: {}
            }
        }

        handlePageChange(activePage) {
            this.handleChange(activePage, this.state.where);
            this.setState({ activePage: activePage });
        }

        handleFilterChange(where) {
            this.handleChange(this.state.activePage, where);
            this.setState({ where: where });
        }

        handleChange(activePage, where) {
            return this.fetchCount(where).then(() => {
                const page = Math.max(activePage - 1, 0);
                const limit = config.format.recordsPerPage;
                const offset = page * limit;
                return this.fetchRecords(where, offset, limit);
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
            this.handleChange(this.state.activePage, this.state.where);
        }

        render() {
            return (
                <WrappingComponent>
                    <Grid id="functions">
                        <Filter
                            include={injectedProps.filterInclude}
                            onHandleChange={(where) => this.handleFilterChange(where)}
                            searchFields={injectedProps.searchFields}
                            searchFieldMinLength={config.format.searchFieldMinLength}
                        />
                    </Grid>
                    <Grid fluid={true}>
                        <CPaginator
                            totalItems={this.state.numOfRecords}
                            recordsPerPage={config.format.recordsPerPage}
                            displayRange={config.format.rangeDisplayed}
                            numOfElementsAtEnds={config.format.numOfElementsAtEnds}
                            onHandleSelect={(activePage) => this.handlePageChange(activePage)}
                        />
                        <CTable head={injectedProps.tableHeader} rows={this.state.records} />
                    </Grid>
                </WrappingComponent>
            );
        }

    }

}

export default TabledPage;